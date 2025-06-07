export { TextFile } from "./file.ts";
import { TextFile } from "./file.ts";
import * as utils from "./utils.ts";

/**
 * Options for the `readdir` function.
 */
export type ReaddirOptions = {
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
  filter: utils.FilterPath;
  /**
   * The number of directories to skip before starting to read the directory.
   * If `0`, the directory will be read from the beginning.
   *
   * @default 0
   */
  skip: number;
};

const defaultOpts: ReaddirOptions = { depth: 0, filter: utils.includePath, skip: 0 };

/**
 * Reads the contents of a directory.
 *
 * @param path    - The path to the directory to read.
 * @param options - The options to use. @see {@linkcode  ReaddirOptions}
 * @returns An array of files. @see {@linkcode TextFile}
 */
export function readdir(path: string, options: Partial<ReaddirOptions> = {}): TextFile[] {
  const opts = { ...defaultOpts, ...options };

  if (opts.skip > opts.depth) {
    opts.depth = opts.skip;
  }

  return readDirContent(path, opts, 0);
}

function readDirContent(path: string, { depth, filter, skip }: ReaddirOptions, index: number): TextFile[] {
  const files: TextFile[] = [];

  /**
   * If the `index` is greater or equal to `skip`, read the files in the directory.
   */
  if (index >= skip) {
    files.push(...utils.readDirectoryFiles(path, filter).map(TextFile.fromPath));
  }

  /**
   * If the `depth` is less or equal to `0`, return the files.
   */
  if (depth <= 0) return files;

  /**
   * If the `depth` is more than `0`, read the subdirectories in the current directory.
   */
  const subdirectories = utils.readDirectorySubdirectories(path);

  for (const subdir of subdirectories) {
    files.push(...readDirContent(subdir, { depth: depth - 1, filter, skip }, index + 1));
  }

  return files;
}
