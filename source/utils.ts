import fs from "node:fs";
import np from "node:path";

/**
 * Checks if the given entry is a directory.
 *
 * @param entry - The entry to check.
 * @returns `true` if the entry is a directory, `false` otherwise.
 */
export function isDirectory(entry: fs.Dirent): boolean {
  return entry.isDirectory();
}

/**
 * Checks if the given entry is a file.
 *
 * @param entry - The entry to check.
 * @returns `true` if the entry is a file, `false` otherwise.
 */
export function isFile(entry: fs.Dirent): boolean {
  return entry.isFile();
}

/**
 * Converts a directory entry to a path.
 *
 * @param entry - The directory entry to convert.
 * @returns The path of the entry.
 */
export function toPath(entry: fs.Dirent): string {
  return np.join(entry.parentPath, entry.name);
}

/**
 * Represents a function that receives a path and returns whether to include the path in the results.
 *
 * @param path - The path to check.
 * @returns `true` if the path should be included, `false` otherwise.
 */
export type FilterPath = (path: string) => boolean;

/**
 * Whether to include the path in the results. This is a no-op function.
 *
 * @param _path - The path to check.
 * @returns `true`.
 */
export function includePath(_path: string): boolean {
  return true;
}

/**
 * Reads the contents of a directory.
 *
 * **Note:** This function is not recursive.
 *
 * @param path - The path to the directory to read.
 * @returns An array of directory entries.
 */
export function readDirectory(path: string): fs.Dirent<string>[] {
  return fs.readdirSync(path, {
    encoding: "utf-8",
    recursive: false,
    withFileTypes: true,
  });
}

/**
 * Reads the files in a directory.
 *
 * @param path - The path to the directory to read.
 * @returns An array of file paths.
 */
export function readDirectoryFiles(path: string, filter: FilterPath = includePath): string[] {
  return readDirectory(path).filter(isFile).map(toPath).filter(filter);
}

/**
 * Reads the subdirectories in a directory.
 *
 * @param path - The path to the directory to read.
 * @returns An array of directory paths.
 */
export function readDirectorySubdirectories(path: string, filter: FilterPath = includePath): string[] {
  return readDirectory(path).filter(isDirectory).map(toPath).filter(filter);
}

/**
 * Reads the contents of a text file.
 *
 * @param path - The path to the file to read.
 * @returns The contents of the file.
 */
export function readTextFile(path: string): string {
  return fs.readFileSync(path, { encoding: "utf-8" });
}
