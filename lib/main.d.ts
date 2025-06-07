// @ts-nocheck
/* eslint-disable */

type FileProperties<T> = {
    /**
     * The name of the file.
     *
     * @example
     *
     * name: "settings.json";
     *
     */
    name: string;
    /**
     * The relative path to the file.
     *
     * @example
     *
     * path: ".vscode/settings.json";
     *
     */
    path: string;
    /**
     * The directory of the file.
     *
     * @example
     *
     * directory: ".vscode";
     *
     */
    directory: string;
    /**
     * The extension of the file.
     *
     * @example
     *
     * extension: "json";
     *
     */
    extension: string;
    /**
     * The encoding of the file.
     *
     * @example
     *
     * encoding: "utf-8";
     *
     */
    encoding: BufferEncoding;
    /**
     * The content of the file.
     *
     * @example
     *
     * content: '{"editor.fontFamily": "'Victor Mono'"}';
     *
     */
    content: T;
};
interface TextFile extends FileProperties<string> {
}
/**
 * Represents a file with text content. Said content can be read either as a `utf-8`
 * string or as a `base64` string (if the file is not a text file by default).
 */
declare class TextFile {
    /**
     * Gets the encoding of a given file.
     *
     * **Note:** So far only `utf-8` and `base64` encodings are supported.
     *
     * @param name      - The name of the file.
     * @param extension - The extension of the file.
     * @returns The encoding of the file (e.g. `utf-8`, `base64`, etc.).
     */
    static getEncoding(name: string, extension: string): BufferEncoding;
    /**
     * Gets the content of a file. If the file does not exist, an empty string is returned.
     *
     * @param path     - The path to the file.
     * @param encoding - The encoding of the file.
     * @returns The content of the file with the given encoding.
     */
    static getFileContent(path: string, encoding: BufferEncoding): string;
    /**
     * Creates a new `TextFile` instance from a path.
     *
     * @param path - The path to the file.
     * @returns A new `TextFile` instance.
     */
    static fromPath(path: string): TextFile;
    /**
     * Parses a file from a given set of properties.
     *
     * @param properties - The properties of the file.
     * @returns A new `TextFile` instance.
     */
    static parse(properties: FileProperties<string>): TextFile;
    private constructor();
    /**
     * Creates a new `TextFile` instance with the encoding and content of the current file.
     * Useful for cloning a file into another location.
     *
     * @param to
     * @returns
     */
    clone(to: string): TextFile;
    /**
     * Returns the properties of the file as a plain object.
     */
    toJSON(): FileProperties<string>;
    /**
     * Writes the content of the file to the given path or to the current path if no path is given.
     */
    write(to?: string): void;
    /**
     * Returns a preview of the content of the file. Basically, it returns the truncated content of the file.
     */
    getContentPreview(): string;
}

/**
 * Represents a function that receives a path and returns whether to include the path in the results.
 *
 * @param path - The path to check.
 * @returns `true` if the path should be included, `false` otherwise.
 */
type FilterPath = (path: string) => boolean;

/**
 * Options for the `readdir` function.
 */
type ReaddirOptions = {
    /**
     * The maximum depth of the directory tree to read. If `0`, only the files in the current directory will be returned.
     *
     * @default 0
     */
    depth: number;
    /**
     * A filter function that is called for each file path in the directory.
     *
     * @default utils.includePath
     * @see {@linkcode utils.includePath}
     */
    filter: FilterPath;
    /**
     * The number of directories to skip before starting to read the directory.
     * If `0`, the directory will be read from the beginning.
     *
     * @default 0
     */
    skip: number;
};
/**
 * Reads the contents of a directory.
 *
 * @param path    - The path to the directory to read.
 * @param options - The options to use. @see {@linkcode  ReaddirOptions}
 * @returns An array of files. @see {@linkcode TextFile}
 */
declare function readdir(path: string, options?: Partial<ReaddirOptions>): TextFile[];

export { type ReaddirOptions, TextFile, readdir };
