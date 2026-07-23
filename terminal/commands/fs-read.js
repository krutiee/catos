import { resolvePath } from "../filesystem.js";
import { CAT_NO_ARG_LINES } from "../content.js";

export function hasFlag(ast, letter) {
  return ast.flags.some((f) => f.replace(/^-+/, "").includes(letter));
}

function formatLongEntry(name, node) {
  const date = new Date(node.modified).toDateString();
  return `${node.permissions}  ${node.owner}  ${date}  ${name}`;
}

export function pwd(shell) {
  return { stdout: [shell.cwd], stderr: [] };
}

export function ls(shell, ast) {
  const pathArg = ast.args.find((a) => !a.startsWith("-")) ?? ".";
  const node = resolvePath(shell, pathArg);

  if (!node) {
    return { stdout: [], stderr: [`ls: cannot access '${pathArg}': No such file or directory`] };
  }

  if (node.type === "file") {
    return { stdout: [node.name], stderr: [] };
  }

  const long = hasFlag(ast, "l");
  const all = hasFlag(ast, "a");
  const names = Object.keys(node.children);

  if (!long) {
    const entries = all ? [".", "..", ...names] : names;
    return { stdout: [entries.join("  ")], stderr: [] };
  }

  const rows = [];
  if (all) {
    rows.push(formatLongEntry(".", node));
    rows.push(formatLongEntry("..", node));
  }
  for (const name of names) {
    rows.push(formatLongEntry(name, node.children[name]));
  }
  return { stdout: rows, stderr: [] };
}

export function cat(shell, ast) {
  const pathArg = ast.args[0];
  if (!pathArg) {
    return { stdout: CAT_NO_ARG_LINES, stderr: [] };
  }

  const node = resolvePath(shell, pathArg);
  if (!node) {
    return { stdout: [], stderr: [`cat: ${pathArg}: No such file or directory`] };
  }
  if (node.type === "dir") {
    return { stdout: [], stderr: [`cat: ${pathArg}: Is a directory`] };
  }
  return { stdout: [node.content], stderr: [] };
}
