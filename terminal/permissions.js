const VALID_MODE = /^([+-])([rwx])$/;

export function parseMode(modeStr) {
  const match = VALID_MODE.exec(modeStr ?? "");
  if (!match) return null;
  const [, op, perm] = match;
  return { op, perm };
}

export function applyMode(node, mode) {
  const chars = node.permissions.split("");
  const positions = mode.perm === "r" ? [0, 3, 6] : mode.perm === "w" ? [1, 4, 7] : [2, 5, 8];
  const value = mode.op === "+" ? mode.perm : "-";
  for (const pos of positions) {
    chars[pos] = value;
  }
  node.permissions = chars.join("");
  if (mode.perm === "x") {
    node.executable = mode.op === "+";
  }
  node.modified = Date.now();
}
