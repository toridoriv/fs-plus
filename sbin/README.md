# `sbin` Directory

This directory contains internal scripts for maintaining and automating workflows in the library. These scripts could be tasks such as code generation, cleanup, validation, and more. They are intended for contributors and internal tooling—not library consumers.

## Usage

Scripts in this directory can be run in two ways:

### 1. Direct Execution

```bash
./sbin/<script-name>.sh
node ./sbin/<script-name>.js
```

> Make sure the script is executable (see [Permissions](#permissions)).

### 2. Through `npm run` via [scripty](https://github.com/toridoriv/scripty)

Add a script entry to your `package.json`:

```json
"scripts": {
  "generate:constants": "scripty"
}
```

Then create the script file at:

```
./sbin/generate/constants.ts
```

Now you can run:

```bash
npm run generate:constants
```

Scripty will automatically resolve and run the matching file.

## Permissions

After adding a new script, run the following to make it executable:

```bash
npm run chmod
```

> **Important:** Files whose names include `utils` or `helpers` are excluded from this step, as they are intended to be imported, not executed directly.

## Conventions

- **File naming:** Use kebab-case for shell scripts and nested folders to group related logic.
- **Documentation:** Each script should include a comment header with a short description and usage instructions.
- **Location:** Place executable scripts in logical subdirectories under `sbin` (e.g., `generate/`, `lint/`, `build/`), and supporting utilities in a `utils/` or `helpers/` subfolder.

## Examples (to be updated)

| Script Path                    | Description                                 | Package Script           |
| ------------------------------ | ------------------------------------------- | ------------------------ |
| `./sbin/generate/constants.ts` | Generates constant values from source files | `generate:constants`     |
| `./sbin/lint/fix.sh`           | Automatically fixes lint issues             | `lint:fix`               |
| `./sbin/utils/fs.ts`           | Utility functions for filesystem ops        | _(internal import only)_ |

## Contributing

1. Add your script to the appropriate location under `sbin/`.
2. If it is executable, run `npm run chmod`.
3. If it should be accessible via `npm run`, add a corresponding entry to `package.json`.
4. Document the script’s purpose and update this README if appropriate.
