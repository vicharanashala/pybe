import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Authored data modules are evaluated only at build/test time, never from a request path.
export async function readAuthoredExport(relative, exportName, options = {}) {
  if (!/^[A-Za-z_$][\w$]*$/.test(exportName))
    throw new Error("Invalid authored export name.");
  const source =
    options.format === "script"
      ? await readFile(path.join(root, relative), "utf8")
      : null;
  const result = await build({
    absWorkingDir: root,
    ...(source !== null
      ? {
          stdin: {
            contents: source + `\nexport {${exportName}};`,
            resolveDir: path.dirname(path.join(root, relative)),
            sourcefile: relative,
            loader: options.loader || "js",
          },
        }
      : { entryPoints: [relative] }),
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
  });
  const module = await import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
  );
  return JSON.parse(
    JSON.stringify(module[exportName], (_key, value) =>
      value instanceof RegExp
        ? { pattern: value.source, flags: value.flags }
        : value,
    ),
  );
}
export async function readAuthoredData(relative, exportName, options = {}) {
  const data = await readAuthoredExport(relative, exportName, options);
  if (!Array.isArray(data))
    throw new Error(`Expected authored steps in ${relative}`);
  return data;
}
