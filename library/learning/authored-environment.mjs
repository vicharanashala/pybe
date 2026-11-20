import { createTimerGroup } from "./timer-group.mjs";
import { createAuthoredRoute } from "./authored-route.mjs";
// Scoped document, timers and event lifecycle for trusted authored scripts.
// There is one PyBe page; a study cannot accidentally re-style its neighbours
// or leave animation/audio loops behind after the learner navigates away.
import { runPython } from "./python-client.mjs";
import { observeAuthoredAssets } from "./authored-assets.mjs";
export function createAuthoredEnvironment({
  host,
  surface,
  body,
  baseURL,
  hashStudyId = null,
}) {
  const realWindow = host.ownerDocument.defaultView,
    realDocument = host.ownerDocument;
  const timers = createTimerGroup(realWindow);
  const listeners = [],
    observers = new Set(),
    audio = new Set();
  let disposed = false,
    title = "";
  const resolve = (value) => new URL(value, baseURL).href;
  observers.add(observeAuthoredAssets(body, { baseURL }));
  const environment = {
    // Explicitly enabled only for reviewed classic-script submissions. Keep
    // their authored handlers in their lexical scope, without global functions.
    bindInlineHandlers(handlers) {
      const bind = () => {
        for (const node of [body, ...body.querySelectorAll("*")])
          for (const attr of [...node.attributes]) {
            if (!/^on[a-z]+$/i.test(attr.name)) continue;
            const previous = node[attr.name];
            const inlineBody = previous
              ?.toString()
              .match(
                /^function\s+on[a-z]+\s*\(\s*event\s*\)\s*\{([\s\S]*)\}$/,
              )?.[1]
              .trim();
            node.removeAttribute(attr.name);
            // A script can replace an inline handler via .onclick. Preserve
            // that replacement, and let later assignments replace our bridge.
            if (previous && inlineBody !== attr.value.trim()) {
              node[attr.name] = previous;
              continue;
            }
            node[attr.name] = function (event) {
              const call = attr.value
                .trim()
                .match(/^([A-Za-z_$][\w$]*)\(([\s\S]*)\);?$/);
              if (!call || !Object.hasOwn(handlers, call[1]))
                throw new Error(
                  "Unreviewed authored event handler: " + attr.value,
                );
              const args = [],
                tokens =
                  /\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|-?\d+(?:\.\d+)?|true|false|null|event|this)\s*(?:,|$)/gy;
              let position = 0;
              while (position < call[2].trim().length) {
                tokens.lastIndex = position;
                const match = tokens.exec(call[2]);
                if (!match)
                  throw new Error(
                    "Unsupported authored handler arguments: " + attr.value,
                  );
                const token = match[1];
                args.push(
                  token === "event"
                    ? event
                    : token === "this"
                      ? node
                      : token.startsWith("'")
                        ? JSON.parse(
                            '"' +
                              token
                                .slice(1, -1)
                                .replace(/\\'/g, "'")
                                .replace(/"/g, '\\"') +
                              '"',
                          )
                        : JSON.parse(token),
                );
                position = tokens.lastIndex;
              }
              return handlers[call[1]].apply(node, args);
            };
          }
      };
      bind();
      const observer = new realWindow.MutationObserver(bind);
      observer.observe(body, {
        subtree: true,
        childList: true,
        attributes: true,
      });
      observers.add(observer);
    },
    async getPythonRuntime() {
      let stdout = () => {},
        stderr = () => {};
      return {
        setStdout({ batched }) {
          stdout = batched;
        },
        setStderr({ batched }) {
          stderr = batched;
        },
        async runPythonAsync(code) {
          const result = await runPython(code);
          if (disposed) return;
          if (result.output)
            for (const line of result.output.replace(/\n$/, "").split("\n"))
              stdout(line);
          if (result.error) {
            stderr(result.error);
            throw new Error(result.error);
          }
        },
      };
    },
    setTimeout: timers.setTimeout,
    clearTimeout: timers.clearTimeout,
    setInterval: timers.setInterval,
    clearInterval: timers.clearInterval,
    requestAnimationFrame: timers.requestAnimationFrame,
    cancelAnimationFrame: timers.cancelAnimationFrame,
  };
  const listen = (target, type, fn, options) => {
    target.addEventListener(type, fn, options);
    listeners.push([target, type, fn, options]);
  };
  function image(width, height) {
    const element = new realWindow.Image(width, height);
    const descriptor = Object.getOwnPropertyDescriptor(
      realWindow.HTMLImageElement.prototype,
      "src",
    );
    Object.defineProperty(element, "src", {
      get() {
        return descriptor.get.call(element);
      },
      set(value) {
        descriptor.set.call(element, resolve(value));
      },
    });
    return element;
  }
  environment.Image = image;
  for (const name of ["ResizeObserver", "IntersectionObserver"])
    if (realWindow[name])
      environment[name] = new Proxy(realWindow[name], {
        construct(target, args) {
          const observer = Reflect.construct(target, args);
          observers.add(observer);
          return observer;
        },
      });
  const audioConstructor =
    realWindow.AudioContext || realWindow.webkitAudioContext;
  const ScopedAudio =
    audioConstructor &&
    new Proxy(audioConstructor, {
      construct(target, args) {
        const context = Reflect.construct(target, args);
        audio.add(context);
        return context;
      },
    });
  const query = (selector) =>
    selector === "body"
      ? body
      : selector === "html"
        ? host
        : surface.querySelector(selector);
  const document = new Proxy(realDocument, {
    get(target, key) {
      if (key === "body") return body;
      if (key === "head") return surface;
      if (key === "documentElement") return host;
      if (key === "title") return title;
      if (key === "activeElement") return surface.activeElement || body;
      if (key === "querySelector") return query;
      if (key === "querySelectorAll")
        return (selector) => surface.querySelectorAll(selector);
      if (key === "getElementsByClassName")
        return body.getElementsByClassName.bind(body);
      if (key === "getElementsByTagName")
        return body.getElementsByTagName.bind(body);
      if (key === "dispatchEvent") return body.dispatchEvent.bind(body);
      if (key === "getElementById") return (id) => surface.getElementById(id);
      if (key === "createElement")
        return (tag, ...args) =>
          tag.toLowerCase() === "img"
            ? image()
            : target.createElement(tag, ...args);
      if (key === "addEventListener")
        return (type, fn, options) =>
          type === "DOMContentLoaded"
            ? queueMicrotask(() => {
                if (!disposed) fn.call(document, new Event(type));
              })
            : listen(body, type, fn, options);
      if (key === "removeEventListener")
        return body.removeEventListener.bind(body);
      const value = Reflect.get(target, key, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(target, key, value) {
      if (key === "title") {
        title = value;
        return true;
      }
      return Reflect.set(target, key, value, target);
    },
  });
  Object.assign(
    environment,
    hashStudyId
      ? createAuthoredRoute(realWindow, hashStudyId)
      : { location: realWindow.location, history: realWindow.history },
  );
  const window = new Proxy(Object.create(null), {
    get(local, key) {
      const target = realWindow;
      if (key === "document") return document;
      if (key === "window" || key === "self") return window;
      if (key === "innerWidth") return host.clientWidth;
      if (key === "innerHeight") return host.clientHeight;
      if (key === "Image") return image;
      if (key === "ResizeObserver") return environment.ResizeObserver;
      if (key === "AudioContext" || key === "webkitAudioContext")
        return ScopedAudio;
      if (Object.hasOwn(environment, key)) return environment[key];
      if (key === "addEventListener")
        return (type, fn, options) =>
          listen(
            /^key(?:down|up|press)$/.test(type) ? body : target,
            type,
            fn,
            options,
          );
      if (key === "removeEventListener")
        return (type, fn, options) =>
          (/^key(?:down|up|press)$/.test(type)
            ? body
            : target
          ).removeEventListener(type, fn, options);
      if (Object.hasOwn(local, key)) return local[key];
      const value = Reflect.get(target, key, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(local, key, value) {
      local[key] = value;
      return true;
    },
  });
  function dispose() {
    if (disposed) return;
    disposed = true;
    timers.dispose();
    for (const [target, type, fn, options] of listeners)
      target.removeEventListener(type, fn, options);
    for (const observer of observers) observer.disconnect();
    for (const context of audio)
      if (context.state !== "closed") context.close().catch(() => {});
    listeners.length = 0;
    observers.clear();
    audio.clear();
  }
  return {
    document,
    window,
    environment,
    dispose,
    get disposed() {
      return disposed;
    },
  };
}

export function scopeAuthoredStyles(css, baseURL) {
  return css
    .replaceAll(":root", ":host")
    .replace(
      /(-?\d*\.?\d+)(dvh|svh|lvh|vh|vw|vmin|vmax)\b/g,
      (_match, value, unit) => {
        const size =
          unit === "vw"
            ? "var(--study-vw)"
            : unit === "vmin"
              ? "min(var(--study-vw),var(--study-vh))"
              : unit === "vmax"
                ? "max(var(--study-vw),var(--study-vh))"
                : "var(--study-vh)";
        return `calc(${value} * ${size})`;
      },
    )
    .replace(
      /(^|[{},])\s*(html|body)\b/g,
      (_match, prefix, tag) =>
        prefix + (tag === "html" ? ":host" : ".authored-html-body"),
    )
    .replace(
      /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g,
      (original, double, single, bare) => {
        const value = (double ?? single ?? bare).trim();
        if (!value || value.startsWith("data:") || value.startsWith("#"))
          return original;
        return `url(${JSON.stringify(new URL(value, baseURL).href)})`;
      },
    );
}
