import { eslintConfig } from "@toridoriv/eslint-config";

/**
 * @import {Linter} from "eslint"
 */

/**
 * Add or delete any Eslint configuration that you want (or not) to use in your project.
 * You can import it from the eslint-config library or create your own.
 *
 * @type {Linter.Config[]}
 */
export default [
  {
    ignores: [
      "DS_Store",
      "node_modules",
      "package*.json",
      "coverage",
      "!bin/**",
      "!.vscode/**",
      "logs",
      "*.log",
      "npm-debug.log*",
      "tmp/",
      "*.tmp",
      "tmp.*",
      "var/tmp",
    ],
  },
  ...eslintConfig.javascript.node,
  eslintConfig.typescript,
  ...eslintConfig.jsdoc,
  eslintConfig.serialization.json,
  eslintConfig.serialization.jsonc,
  eslintConfig.markup.markdown,
  eslintConfig.prettier,
];
