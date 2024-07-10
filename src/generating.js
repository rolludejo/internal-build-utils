import * as path from "node:path";

import { getRelativeOutDir } from "./utils";

export function generatePackageJSON(
  oldPackageJSON,
  opts,
) {
  /**
   * @type { import("./generating").Entry[] }
   */
  const entries = [opts.mainEntry, ...(opts.otherEntries ?? [])];

  const newPackageJSON = structuredClone(oldPackageJSON);
  newPackageJSON.exports = {
    ...(Object.fromEntries(entries.map((e) => [
      e.name ? "./" + e.name : ".",
      {
        "import": {
          "types": "./" + path.join(
            getRelativeOutDir("dist", e.name),
            path.parse(e.entry).name + ".d.ts",
          ),
          "default": "./" + path.join(
            getRelativeOutDir("dist", e.name),
            path.parse(e.entry).name + ".js",
          ),
        },
      },
    ]))),
    ...(opts.withInternalEntry ? { "./internal": "./internal.ts" } : {}),
  };
  delete newPackageJSON.main;
  newPackageJSON.types = newPackageJSON.exports["."].import.types;
  newPackageJSON.module = newPackageJSON.exports["."].import.default;

  return newPackageJSON;
}

export function generateTSUPOptions(opts) {
  /**
   * @type {import("./generating").Entry[]}
   */
  const entries = [opts.mainEntry, ...(opts.otherEntries ?? [])];

  return entries.map((entry) => {
    const { entry: entryPoint, name } = entry;

    const outDir = getRelativeOutDir("dist", name);

    const buildOpts = {
      target: "es2020",
      format: "esm",
      minify: true,
    };

    return {
      ...buildOpts,
      entry: [entryPoint],
      outDir,
      name,
      dts: true,
      noExternal: entry.noExternal,
      external: entry.external ?? opts.external,
      minify: "terser",
      clean: true,
    };
  });
}
