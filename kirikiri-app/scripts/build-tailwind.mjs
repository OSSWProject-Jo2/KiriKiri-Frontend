import { compile } from "@tailwindcss/node";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const appDir = path.join(process.cwd(), "app");
const inputFile = path.join(appDir, "tailwind-input.css");
const outputFile = path.join(appDir, "generated-tailwind.css");
const sourceExtensions = new Set([".ts", ".tsx"]);
const separators = /[\s"'`{}()<>]+/;

async function getSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getSourceFiles(fullPath);
      }

      if (sourceExtensions.has(path.extname(entry.name))) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function extractCandidates(source) {
  return source
    .split(separators)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => token.replace(/,$/, ""))
    .filter((token) => token.length > 1);
}

const inputCss = '@import "tailwindcss";';
const sourceFiles = await getSourceFiles(appDir);
const sourceText = await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")));
const candidates = [...new Set(sourceText.flatMap(extractCandidates))];

const compiler = await compile(inputCss, {
  base: process.cwd(),
  from: inputFile,
  onDependency() {},
});

await writeFile(outputFile, compiler.build(candidates));
