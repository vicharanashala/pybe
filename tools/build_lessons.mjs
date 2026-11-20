import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { build } from "esbuild";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { readFile, writeFile, mkdir, access, copyFile } from "node:fs/promises";
import { readAuthoredData } from "./lesson-data.mjs";
import { buildHtmlStory } from "./html-story.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(
  await readFile(path.join(root, "shared/lesson-registry.json"), "utf8"),
);
for (const definition of Object.values(registry.collections)) {
  if (typeof definition === "string") continue;
  if (definition.kind === "component") continue;
  if (definition.kind === "book") {
    for (const page of definition.pages) await buildHtmlStory(root, page);
    continue;
  }
  if (definition.kind === "html") {
    await buildHtmlStory(root, definition);
    continue;
  }
  const steps = await readAuthoredData(
    definition.source,
    definition.exportName,
    definition,
  );
  await mkdir(path.dirname(path.join(root, definition.output)), {
    recursive: true,
  });
  await writeFile(path.join(root, definition.output), JSON.stringify(steps));
}
await build({
  absWorkingDir: root,
  entryPoints: ["client/src/learning/entry.jsx"],
  outfile: "library/assets/learning.js",
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  jsx: "automatic",
  plugins: [
    {
      name: "authored-tailwind",
      setup(bundler) {
        bundler.onResolve({ filter: /\.css\?tailwind$/ }, (args) => ({
          path: path.resolve(args.resolveDir, args.path.slice(0, -9)),
          namespace: "authored-tailwind",
        }));
        bundler.onLoad(
          { filter: /.*/, namespace: "authored-tailwind" },
          async (args) => {
            const directory = path.dirname(args.path),
              client = path.dirname(directory);
            let config = {};
            for (const extension of ['js','mjs','cjs','ts']) {
              const filename=path.join(client, `tailwind.config.${extension}`);
              try { await access(filename); } catch(error) {
                if(error.code==='ENOENT')continue;
                throw error;
              }
              if(extension==='ts') {
                const compiled=await build({entryPoints:[filename],bundle:true,platform:'node',format:'esm',write:false});
                config=(await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'))).default;
              } else config=(await import(pathToFileURL(filename))).default;
              break;
            }
            let css = await readFile(args.path, "utf8");
            // Older submissions use utility syntax from both Tailwind generations.
            // Preserve their custom rules while compiling through one root toolchain.
            css = css
              .replace(
                /@import\s+["']tailwindcss["'];/,
                "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
              )
              .replace(/@theme\s*\{/g, ":root {");
            const compiled = await postcss([
              tailwindcss({
                ...config,
                content: [
                  path
                    .join(directory, "**/*.{js,jsx,ts,tsx}")
                    .replaceAll("\\", "/"),
                  path
                    .join(client, "../../shared/**/*.{js,jsx}")
                    .replaceAll("\\", "/"),
                ],
              }),
            ]).process(css, {
              from: args.path,
              map: false,
            });
            return { contents: compiled.css, loader: "text" };
          },
        );
      },
    },
    {
      name: "authored-text-assets",
      setup(bundler) {
        bundler.onResolve({ filter: /\.(?:py|txt|md)\?raw$/ }, (args) => {
          const filename = path.resolve(
            args.resolveDir,
            args.path.slice(0, -4),
          );
          if (!filename.startsWith(path.join(root, "case-studies") + path.sep))
            throw new Error("Authored text asset is outside case-studies.");
          return { path: filename, namespace: "authored-text" };
        });
        bundler.onLoad(
          { filter: /.*/, namespace: "authored-text" },
          async (args) => ({
            contents: await readFile(args.path, "utf8"),
            loader: "text",
          }),
        );
      },
    },
  ],
  alias: {
    "motion/react": path.join(root, "node_modules/framer-motion"),
    "framer-motion": path.join(root, "node_modules/framer-motion"),
    "react-router-dom": "react-router-dom",
    "react-router": "react-router",
    "lucide-react": path.join(root, "node_modules/lucide-react"),
    react: path.join(root, "node_modules/react"),
    "react-dom": path.join(root, "node_modules/react-dom"),
  },
  loader: {
    ".css": "text",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".svg": "file",
    ".webp": "file",
  },
  // Each adapter injects CSS text into its scoped surface. Bare imports in the
  // original App components are deliberately excluded from the global page.
  logOverride: { "ignored-bare-import": "silent" },
  assetNames: "media/[name]-[hash]",
  publicPath: "/assets",
  define: { "process.env.NODE_ENV": '"production"' },
});
await copyFile(path.join(root,'node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm'),path.join(root,'library/assets/dotlottie-player.wasm'));
console.log("Built the shared PyBe lesson player.");
