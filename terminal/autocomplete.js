import { COMMAND_NAMES } from "./command-names.js";
import { absolutePathSegments, getNodeAtSegments } from "./filesystem.js";

function splitLastWord(buffer) {
  const idx = buffer.lastIndexOf(" ");
  if (idx === -1) return { prefix: "", word: buffer };
  return { prefix: buffer.slice(0, idx + 1), word: buffer.slice(idx + 1) };
}

function isPathLike(word) {
  return word.startsWith("./") || word.startsWith("../") || word.startsWith("/");
}

function completePath(shell, word) {
  const lastSlash = word.lastIndexOf("/");
  const dirPart = lastSlash === -1 ? "" : word.slice(0, lastSlash + 1);
  const namePrefix = lastSlash === -1 ? word : word.slice(lastSlash + 1);

  const segments = absolutePathSegments(shell.cwd, dirPart === "" ? "." : dirPart);
  const dirNode = getNodeAtSegments(shell.filesystem, segments);
  if (!dirNode || dirNode.type !== "dir") return { dirPart, dirNode: null, matches: [] };

  const matches = Object.keys(dirNode.children).filter((n) => n.startsWith(namePrefix));
  return { dirPart, dirNode, matches };
}

function apply(renderer, prefix, matches, { dirPart, dirNode } = {}) {
  if (matches.length === 0) return;
  if (matches.length > 1) {
    renderer.print(matches.join("  "));
    return;
  }
  const matchName = matches[0];
  const isPath = dirPart !== undefined;
  const reconstructed = isPath ? dirPart + matchName : matchName;
  const trailingChar = isPath && dirNode.children[matchName].type === "dir" ? "/" : " ";
  renderer.setInputValue(prefix + reconstructed + trailingChar);
}

export function handleTab(shell, renderer) {
  const buffer = renderer.getInputValue();
  const { prefix, word } = splitLastWord(buffer);
  const isFirstWord = prefix.trim() === "";

  if (isFirstWord && !isPathLike(word)) {
    const matches = COMMAND_NAMES.filter((n) => n.startsWith(word));
    apply(renderer, prefix, matches);
    return;
  }

  const { dirPart, dirNode, matches } = completePath(shell, word);
  apply(renderer, prefix, matches, { dirPart, dirNode });
}
