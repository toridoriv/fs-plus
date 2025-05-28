#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { readdir } from "../../source/main.ts";

const banner = "// @ts-nocheck\n/* eslint-disable */\n\n";

const files = readdir("./lib", {
  depth: 1,
  filter(path) {
    const extension = path.split(".").pop()?.toLowerCase() || "";

    return ["js", "cjs", "mjs", "ts", "cts", "mts"].includes(extension);
  },
});

for (const file of files) {
  file.content = banner + file.content;

  file.write();
}
