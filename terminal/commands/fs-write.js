import { resolvePath, createDir, createFile, removeNode } from "../filesystem.js";

export function mkdir(shell, ast) {
  const name = ast.args[0];
  if (!name) {
    return { stdout: [], stderr: ["mkdir: missing operand"] };
  }
  if (resolvePath(shell, name)) {
    return { stdout: [], stderr: [`mkdir: cannot create directory '${name}': File exists`] };
  }
  const created = createDir(shell, name);
  if (!created) {
    return { stdout: [], stderr: [`mkdir: cannot create directory '${name}': No such file or directory`] };
  }
  return { stdout: [], stderr: [] };
}

export function touch(shell, ast) {
  const name = ast.args[0];
  if (!name) {
    return { stdout: [], stderr: ["touch: missing operand"] };
  }
  const existing = resolvePath(shell, name);
  if (existing) {
    existing.modified = Date.now();
    return { stdout: [], stderr: [] };
  }
  const created = createFile(shell, name, "");
  if (!created) {
    return { stdout: [], stderr: [`touch: cannot touch '${name}': No such file or directory`] };
  }
  return { stdout: [], stderr: [] };
}

export function rm(shell, ast) {
  const name = ast.args[0];
  if (!name) {
    return { stdout: [], stderr: ["rm: missing operand"] };
  }
  const node = resolvePath(shell, name);
  if (!node) {
    return { stdout: [], stderr: [`rm: cannot remove '${name}': No such file or directory`] };
  }
  if (node.type === "dir") {
    return { stdout: [], stderr: [`rm: cannot remove '${name}': Is a directory`] };
  }
  removeNode(shell, name);
  return { stdout: [], stderr: [] };
}
