import { defineConfig } from "tsup";

export default defineConfig([
  {
    bundle: true,
    dts: {
      only: false,
      resolve: true,
    },
    external: ["node:fs", "node:path"],
    entry: ["source/main.ts"],
    format: ["esm", "cjs"],
    outDir: "lib",
    platform: "node",
    shims: true,
    splitting: false,
    target: "esnext",
    tsconfig: "tsconfig.bundle.json",
    treeshake: {
      preset: "smallest",
      moduleSideEffects: "no-external",
      correctVarValueBeforeDeclaration: true,
    },
  },
]);
