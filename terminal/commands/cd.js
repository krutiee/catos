import { absolutePathSegments, getNodeAtSegments, segmentsToPath } from "../filesystem.js";

export function cd(shell, ast) {
  const target = ast.args[0] ?? shell.env.HOME;
  const segments = absolutePathSegments(shell.cwd, target);
  const node = getNodeAtSegments(shell.filesystem, segments);

  if (!node) {
    return { stdout: [], stderr: [`cd: ${target}: No such file or directory`] };
  }
  if (node.type !== "dir") {
    return { stdout: [], stderr: [`cd: ${target}: Not a directory`] };
  }

  const newCwd = segmentsToPath(segments);
  return {
    stdout: [],
    stderr: [],
    stateChanges: { cwd: newCwd, env: { ...shell.env, PWD: newCwd } },
  };
}
