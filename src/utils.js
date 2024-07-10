import * as path from "node:path";
import * as process from "node:process";

export function resolvePathSafe(base, target) {
  const outDir = path.resolve(base, target);
  if (!outDir.startsWith(path.resolve(base))) {
    throw new Error(`outDir is outside of \`${base}\``);
  }
  return outDir;
}

export function getRelativeOutDir(distPath, name) {
  const absPath = resolvePathSafe(distPath, name ? path.dirname(name) : ".");
  return path.relative(process.cwd(), absPath);
}
