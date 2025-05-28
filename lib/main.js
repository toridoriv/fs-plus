// @ts-nocheck
/* eslint-disable */

import fs from 'fs';
import np from 'path';
import util from 'util';

// source/file.ts
var customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
var TEXT_FILE_EXTENSIONS = [
  ".js",
  ".cjs",
  ".mjs",
  ".ts",
  ".cts",
  ".mts",
  ".tsx",
  ".json",
  ".md",
  ".txt",
  ".html",
  ".css",
  ".csv",
  ".xml",
  ".yml",
  ".yaml",
  ".toml"
];
var TEXT_FILE_NAMES = [".gitignore", ".gitattributes", ".zshrc", ".bashrc", ".profile"];
var TextFile = class _TextFile {
  /**
   * Gets the encoding of a given file.
   *
   * **Note:** So far only `utf-8` and `base64` encodings are supported.
   *
   * @param name      - The name of the file.
   * @param extension - The extension of the file.
   * @returns The encoding of the file (e.g. `utf-8`, `base64`, etc.).
   */
  static getEncoding(name, extension) {
    if (TEXT_FILE_NAMES.includes(name)) {
      return "utf-8";
    }
    if (TEXT_FILE_EXTENSIONS.includes(extension)) {
      return "utf-8";
    }
    return "base64";
  }
  /**
   * Gets the content of a file. If the file does not exist, an empty string is returned.
   *
   * @param path     - The path to the file.
   * @param encoding - The encoding of the file.
   * @returns The content of the file with the given encoding.
   */
  static getFileContent(path, encoding) {
    if (!fs.existsSync(path)) {
      return "";
    }
    return fs.readFileSync(path, encoding);
  }
  /**
   * Creates a new `TextFile` instance from a path.
   *
   * @param path - The path to the file.
   * @returns A new `TextFile` instance.
   */
  static fromPath(path) {
    const name = np.basename(path);
    const extension = np.extname(path);
    const encoding = _TextFile.getEncoding(name, extension);
    const properties = {
      name,
      path,
      directory: np.dirname(path),
      extension,
      encoding,
      content: _TextFile.getFileContent(path, encoding)
    };
    return new _TextFile(properties);
  }
  /**
   * Parses a file from a given set of properties.
   *
   * @param properties - The properties of the file.
   * @returns A new `TextFile` instance.
   */
  static parse(properties) {
    return new _TextFile(properties);
  }
  constructor(properties) {
    Object.assign(this, properties);
  }
  /**
   * Creates a new `TextFile` instance with the encoding and content of the current file.
   * Useful for cloning a file into another location.
   *
   * @param to
   * @returns
   */
  clone(to) {
    return new _TextFile({
      ...this.toJSON(),
      name: np.basename(to),
      directory: np.dirname(to),
      extension: np.extname(to),
      path: to
    });
  }
  /**
   * Returns the properties of the file as a plain object.
   */
  toJSON() {
    return {
      name: this.name,
      directory: this.directory,
      extension: this.extension,
      path: this.path,
      encoding: this.encoding,
      content: this.content
    };
  }
  /**
   * Writes the content of the file to the given path or to the current path if no path is given.
   */
  write(to) {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory, { recursive: true });
    }
    return fs.writeFileSync(to || this.path, this.content, { encoding: this.encoding });
  }
  /**
   * Returns a preview of the content of the file. Basically, it returns the truncated content of the file.
   */
  getContentPreview() {
    const newLineSymbol = "\u21A9\uFE0E";
    const preview = this.content.substring(0, 80).replaceAll("\n", util.styleText(["dim"], newLineSymbol));
    const rest = this.content.substring(80);
    const additional = rest.length > 0 ? `...${rest.length} more characters` : "";
    return `${preview}${additional}`;
  }
  /**
   * Returns a custom string representation of the file.
   *
   * @internal
   */
  [customInspectSymbol]() {
    const properties = this.toJSON();
    const lines = ["--- File ---"];
    const longest = Math.max(...Object.keys(properties).map((item) => item.length));
    for (const _ in properties) {
      const name = _;
      const value = name === "content" ? this.getContentPreview() : properties[name];
      const padding = " ".repeat(longest - name.length);
      const section = util.styleText(["bold"], name[0].toUpperCase() + name.substring(1) + padding + ":");
      lines.push(`${section} ${value}`);
    }
    lines.push(lines[0], "\n");
    return lines.join("\n");
  }
};
function isDirectory(entry) {
  return entry.isDirectory();
}
function isFile(entry) {
  return entry.isFile();
}
function toPath(entry) {
  return np.join(entry.parentPath, entry.name);
}
function includePath(_path) {
  return true;
}
function readDirectory(path) {
  return fs.readdirSync(path, {
    encoding: "utf-8",
    recursive: false,
    withFileTypes: true
  });
}
function readDirectoryFiles(path, filter = includePath) {
  return readDirectory(path).filter(isFile).map(toPath).filter(filter);
}
function readDirectorySubdirectories(path, filter = includePath) {
  return readDirectory(path).filter(isDirectory).map(toPath).filter(filter);
}

// source/main.ts
var defaultOpts = { depth: 0, filter: includePath, skip: 0 };
function readdir(path, options = {}) {
  const opts = { ...defaultOpts, ...options };
  if (opts.skip > opts.depth) {
    opts.depth = opts.skip;
  }
  return readDirContent(path, opts, 0);
}
function readDirContent(path, { depth, filter, skip }, index) {
  const files = [];
  if (index >= skip) {
    files.push(...readDirectoryFiles(path, filter).map(TextFile.fromPath));
  }
  if (depth <= 0) return files;
  const subdirectories = readDirectorySubdirectories(path);
  for (const subdir of subdirectories) {
    files.push(...readDirContent(subdir, { depth: depth - 1, filter, skip }, index + 1));
  }
  return files;
}

export { readdir };
