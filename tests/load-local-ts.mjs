import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const cache = new Map();
const require = createRequire(import.meta.url);
async function moduleURL(path) {
  if (cache.has(path)) return cache.get(path);
  const source = await readFile(path, "utf8");
  let { outputText } = ts.transpileModule(source, { fileName: path, compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } });
  for (const match of [...outputText.matchAll(/from ["']([^"']+)["']/g)]) {
    const name = match[1];
    if (!name.startsWith("@/") && !name.startsWith(".")) {
      outputText = outputText.replace(match[0], `from ${JSON.stringify(pathToFileURL(require.resolve(name)).href)}`);
      continue;
    }
    const stem = resolve(name.startsWith("@/") ? root : dirname(path), name.startsWith("@/") ? name.slice(2) : name);
    const dependency = existsSync(stem + ".ts") ? stem + ".ts" : stem + ".tsx";
    outputText = outputText.replace(match[0], `from ${JSON.stringify(await moduleURL(dependency))}`);
  }
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  cache.set(path, url); return url;
}
export async function loadLocalTS(path) { return import(await moduleURL(resolve(root, path))); }
