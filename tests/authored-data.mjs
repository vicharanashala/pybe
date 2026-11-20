import { readFile } from "node:fs/promises";
import { build } from "esbuild";
// Read the reviewed literal data inside an authored component for preservation
// and walkthrough checks. Rendering continues to use the original component.
export async function readComponentLiteral(relative, name, bindings = {}) {
  if (!/^[A-Za-z_$][\w$]*$/.test(name))
    throw new Error("Invalid authored data name.");
  const source = await readFile(
    new URL("../" + relative, import.meta.url),
    "utf8",
  );
  const match = source.match(
    new RegExp("const " + name + " = ([\\s\\S]*?\\n  [\\]}]);"),
  );
  if (!match) throw new Error("Authored literal not found: " + name);
  const declarations = Object.entries(bindings)
    .map(([key, value]) => {
      if (!/^[A-Za-z_$][\w$]*$/.test(key))
        throw new Error("Invalid authored binding");
      return "const " + key + "=" + JSON.stringify(value) + ";";
    })
    .join("\n");
  const result = await build({
    stdin: {
      contents: declarations + "\nexport default " + match[1],
      loader: "js",
    },
    format: "esm",
    write: false,
  });
  return (
    await import(
      "data:text/javascript;base64," +
        Buffer.from(result.outputFiles[0].text).toString("base64")
    )
  ).default;
}
