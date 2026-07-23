import { resolvePath } from "../filesystem.js";
import { parseMode, applyMode } from "../permissions.js";

export function chmod(shell, ast) {
  const [modeArg, pathArg] = ast.args;
  if (!modeArg || !pathArg) {
    return { stdout: [], stderr: ["chmod: missing operand"] };
  }

  const mode = parseMode(modeArg);
  if (!mode) {
    return { stdout: [], stderr: [`chmod: invalid mode: '${modeArg}'`] };
  }

  const node = resolvePath(shell, pathArg);
  if (!node) {
    return { stdout: [], stderr: [`chmod: cannot access '${pathArg}': No such file or directory`] };
  }

  applyMode(node, mode);

  const stateChanges = {};
  if (node.name === "birthday.exe") {
    stateChanges.birthdayUnlocked = node.executable;
  }

  return { stdout: [], stderr: [], stateChanges };
}
