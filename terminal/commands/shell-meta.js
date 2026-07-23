import { HELP_TEXT, WHOAMI_RESPONSE } from "../content.js";
import { COMMAND_NAMES } from "../command-names.js";

export function whoami() {
  return { stdout: [WHOAMI_RESPONSE], stderr: [] };
}

export function clear() {
  return { stdout: [], stderr: [], clearScreen: true };
}

export function echo(shell, ast) {
  return { stdout: [ast.args.join(" ")], stderr: [] };
}

export function help() {
  const lines = [
    HELP_TEXT,
    "",
    "Available commands:",
    COMMAND_NAMES.join("  "),
    "",
    "There might be more out there than what's listed here.",
  ];
  return { stdout: lines, stderr: [] };
}
