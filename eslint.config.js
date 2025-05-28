import { eslintConfig } from "@toridoriv/eslint-config";

// Use this to set a single rule for TypeScript files.
eslintConfig.setTypescriptRule("@typescript-eslint/no-redeclare", "off");

// Use this to set a rules for JavaScript modules.
eslintConfig.javascript.setJavascriptModuleRules({
  "no-unused-vars": ["warn", { ignoreRestSiblings: true }],
});

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
  eslintConfig.ignorePatterns(
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
    "bin/setup-eslint-config",
  ),
  ...eslintConfig.javascript.node,
  eslintConfig.typescript,
  ...eslintConfig.jsdoc,
  eslintConfig.serialization.json,
  eslintConfig.serialization.jsonc,
  eslintConfig.markup.markdown,
  eslintConfig.markup.markdownWithPrettier,
  eslintConfig.markup.css,
  eslintConfig.markup.html,
  eslintConfig.prettier,
];
