import fs from "node:fs";
import np from "node:path";
import util from "node:util";

const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

export const TEXT_FILE_EXTENSIONS = [
  ".js",
  ".ts",
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
  ".toml",
];

export const TEXT_FILE_NAMES = [
  ".gitignore",
  ".gitattributes",
  ".zshrc",
  ".bashrc",
  ".profile",
];

export type FileProperties<T> = {
  /**
   * The name of the file.
   *
   * @example
   *   name: "settings.json";
   *
   */
  name: string;
  /**
   * The relative path to the file.
   *
   * @example
   *   path: ".vscode/settings.json";
   *
   */
  path: string;
  /**
   * The directory of the file.
   *
   * @example
   *   directory: ".vscode";
   *
   */
  directory: string;
  /**
   * The extension of the file.
   *
   * @example
   *   extension: "json";
   *
   */
  extension: string;
  /**
   * The encoding of the file.
   *
   * @example
   *   encoding: "utf-8";
   *
   */
  encoding: BufferEncoding;
  /**
   * The content of the file.
   *
   * @example
   *   content: '{"editor.fontFamily": "'Victor Mono'"}';
   *
   */
  content: T;
};

export interface TextFile extends FileProperties<string> {}

/**
 * Represents a file with text content. Said content can be read either as a `utf-8`
 * string or as a `base64` string (if the file is not a text file by default).
 */
export class TextFile {
  /**
   * Gets the encoding of a given file.
   *
   * **Note:** So far only `utf-8` and `base64` encodings are supported.
   *
   * @param name      - The name of the file.
   * @param extension - The extension of the file.
   * @returns The encoding of the file (e.g. `utf-8`, `base64`, etc.).
   */
  static getEncoding(name: string, extension: string): BufferEncoding {
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
  static getFileContent(path: string, encoding: BufferEncoding) {
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
  static fromPath(path: string) {
    const name = np.basename(path);
    const extension = np.extname(path);
    const encoding = TextFile.getEncoding(name, extension);
    const properties = {
      name,
      path,
      directory: np.dirname(path),
      extension,
      encoding,
      content: TextFile.getFileContent(path, encoding),
    };

    return new TextFile(properties);
  }

  /**
   * Parses a file from a given set of properties.
   *
   * @param properties - The properties of the file.
   * @returns A new `TextFile` instance.
   */
  static parse(properties: FileProperties<string>) {
    return new TextFile(properties);
  }

  private constructor(properties: FileProperties<string>) {
    Object.assign(this, properties);
  }

  /**
   * Creates a new `TextFile` instance with the encoding and content of the current file.
   * Useful for cloning a file into another location.
   *
   * @param to
   * @returns
   */
  clone(to: string) {
    return new TextFile({
      ...this.toJSON(),
      name: np.basename(to),
      directory: np.dirname(to),
      extension: np.extname(to),
      path: to,
    });
  }

  /**
   * Returns the properties of the file as a plain object.
   */
  toJSON(): FileProperties<string> {
    return {
      name: this.name,
      directory: this.directory,
      extension: this.extension,
      path: this.path,
      encoding: this.encoding,
      content: this.content,
    };
  }

  /**
   * Writes the content of the file to the given path or to the current path if no path is
   * given.
   */
  write(to?: string) {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory, { recursive: true });
    }

    return fs.writeFileSync(to || this.path, this.content, { encoding: this.encoding });
  }

  /**
   * Returns a preview of the content of the file. Basically, it returns the truncated
   * content of the file.
   */
  getContentPreview() {
    const newLineSymbol = "↩︎";
    const preview = this.content
      .substring(0, 80)
      .replaceAll("\n", util.styleText(["dim"], newLineSymbol));
    const rest = this.content.substring(80);
    const additional = rest.length > 0 ? `...${rest.length} more characters` : "";

    return `${preview}${additional}`;
  }

  /**
   * Returns a custom string representation of the file.
   */
  [customInspectSymbol]() {
    const properties = this.toJSON();
    const lines = ["--- File ---"];
    const longest = Math.max(...Object.keys(properties).map((item) => item.length));

    for (const _ in properties) {
      const name = _ as keyof FileProperties<string>;
      const value = name === "content" ? this.getContentPreview() : properties[name];
      const padding = " ".repeat(longest - name.length);
      const section = util.styleText(
        ["bold"],
        name[0].toUpperCase() + name.substring(1) + padding + ":",
      );

      lines.push(`${section} ${value}`);
    }

    lines.push(lines[0], "\n");

    return lines.join("\n");
  }
}
