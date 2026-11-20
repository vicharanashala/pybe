import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import { createHash } from "node:crypto";

export async function buildHtmlStory(root, definition) {
  if (
    definition.inlineHandlers &&
    (!Array.isArray(definition.inlineHandlers) ||
      definition.inlineHandlers.some(
        (name) => !/^[A-Za-z_$][\w$]*$/.test(name),
      ))
  )
    throw new Error(
      "Inline handlers require an explicit list of authored function names.",
    );
  const source = await readFile(path.join(root, definition.source), "utf8");
  const scripts = [
    ...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ];
  if (
    !definition.moduleScripts &&
    scripts.some((match) => /type\s*=\s*["']module/i.test(match[1]))
  )
    throw new Error(`${definition.source} needs an explicit module adapter.`);
  const resourceHashes = {};
  async function localAsset(relative) {
    const url = new URL(relative, `https://pybe.local/${definition.source}`);
    if (url.hostname !== "pybe.local")
      throw new Error(`External scripts need explicit review: ${relative}`);
    const filename = path.resolve(
      root,
      decodeURIComponent(url.pathname.slice(1)),
    );
    if (!filename.startsWith(path.join(root, "case-studies") + path.sep))
      throw new Error("Authored asset is outside case-studies.");
    const text = await readFile(filename, "utf8");
    resourceHashes[path.relative(root, filename).replaceAll("\\", "/")] =
      createHash("sha256").update(text).digest("hex");
    return text;
  }
  const scriptContents = [];
  for (const script of scripts) {
    const src = script[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    const content = src ? await localAsset(src) : script[2];
    if (/type\s*=\s*["']module/i.test(script[1])) {
      // Bundle imports inside the scoped mount closure. Original modules and
      // assets remain the source of truth; free document/window use PyBe's lifecycle.
      const entry = src
        ? path.resolve(path.dirname(path.join(root, definition.source)), src)
        : path.join(root, definition.source);
      const result = await build({
        stdin: {
          contents: content,
          resolveDir: path.dirname(entry),
          sourcefile: entry,
        },
        bundle: true,
        format: "iife",
        target: "es2022",
        write: false,
        metafile: true,
        outdir: path.join(root, "library/assets/stories"),
        assetNames: "../media/[name]-[hash]",
        publicPath: "/assets/stories",
        loader: {
          ".png": "file",
          ".jpeg": "file",
          ".jpg": "file",
          ".svg": "file",
          ".webp": "file",
        },
      });
      for (const file of result.outputFiles) {
        if (file.path.endsWith(".js")) scriptContents.push(file.text);
        else {
          await mkdir(path.dirname(file.path), { recursive: true });
          await writeFile(file.path, file.contents);
        }
      }
      for (const filename of Object.keys(result.metafile.inputs)) {
        const resolved = path.resolve(root, filename);
        if (
          resolved.startsWith(path.join(root, "case-studies") + path.sep) &&
          /\.(?:m?js|css)$/.test(filename)
        )
          resourceHashes[path.relative(root, resolved).replaceAll("\\", "/")] =
            createHash("sha256")
              .update(await readFile(resolved))
              .digest("hex");
      }
    } else
      scriptContents.push(
        content.replace(
          /(["'`])(?:\.\/|\/)?((?:img|images|assets|audio)\/)/g,
          (_match, quote, directory) => quote + definition.baseURL + directory,
        ),
      );
  }
  const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (
    !body ||
    (!definition.inlineHandlers &&
      /\son[a-z]+\s*=/i.test(
        body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ""),
      ))
  )
    throw new Error(`${definition.source} needs an explicit event adapter.`);
  const styles = [];
  for (const tag of source.matchAll(
    /<style\b[^>]*>([\s\S]*?)<\/style>|<link\b([^>]+)>/gi,
  )) {
    if (tag[1] !== undefined) {
      styles.push({ css: tag[1], baseURL: definition.baseURL });
      continue;
    }
    if (!/\brel\s*=\s*["']stylesheet["']/i.test(tag[2])) continue;
    const href = tag[2].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    if (/^https?:\/\//i.test(href)) {
      styles.push({
        css: `@import url(${JSON.stringify(href)});`,
        baseURL: definition.baseURL,
      });
      continue;
    }
    styles.push({
      css: await localAsset(href),
      baseURL: new URL(href, "https://pybe.local" + definition.baseURL)
        .pathname,
    });
  }
  const markup = body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const code = `export default function mount(document,window,environment){
    const {setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame,cancelAnimationFrame,Image,ResizeObserver,IntersectionObserver,location,history}=environment;
    ${scriptContents.join("\n;\n")}
    ${definition.pythonFactory ? `${definition.pythonFactory}=environment.getPythonRuntime;` : ""}
    ${definition.inlineHandlers ? `environment.bindInlineHandlers({${definition.inlineHandlers.join(",")}});` : ""}
    return {${definition.controller ? `controller:${definition.controller},course:${definition.course || "null"},` : ""}${definition.completeExpression ? `isComplete:()=>(${definition.completeExpression})` : ""}};
  }`;
  const output = path.join(root, definition.module.replace(/^\//, "library/"));
  await mkdir(path.dirname(output), { recursive: true });
  await build({
    stdin: {
      contents: code,
      sourcefile: path.join(root, definition.source),
      resolveDir: path.dirname(path.join(root, definition.source)),
    },
    outfile: output,
    bundle: true,
    format: "esm",
    // Browser scripts intentionally have no CommonJS module object. Keep
    // authored Node-only export guards from being treated as runtime exports.
    define: { module: "undefined" },
    target: "es2022",
  });
  const data = {
    markup,
    styles,
    resourceHashes,
    sourceHash: createHash("sha256").update(source).digest("hex"),
  };
  await mkdir(path.dirname(path.join(root, definition.output)), {
    recursive: true,
  });
  await writeFile(path.join(root, definition.output), JSON.stringify(data));
}
