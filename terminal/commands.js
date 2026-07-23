import { pwd, ls, cat, hasFlag } from "./commands/fs-read.js";
import { mkdir, touch, rm } from "./commands/fs-write.js";
import { chmod } from "./commands/fs-perm.js";
import { cd } from "./commands/cd.js";
import { whoami, clear, echo, help } from "./commands/shell-meta.js";
import { runSequence } from "./birthday.js";
import { resolvePath } from "./filesystem.js";
import {
  meow,
  purr,
  pspsps,
  catfacts,
  love,
  make_me_happy,
  kruti,
  hitanshu,
  hug,
  smile,
  orange,
} from "./commands/catos-hidden.js";
import { treat, laser, zoomies, kiss } from "./commands/catos-hidden-anim.js";

const REGISTRY = { pwd, ls, cat, mkdir, touch, rm, chmod, cd, whoami, clear, echo, help };

// Undocumented -- deliberately absent from command-names.js, so `help` and
// Tab-autocomplete (which read only COMMAND_NAMES) never surface these.
const HIDDEN = { meow, purr, pspsps, catfacts, love, make_me_happy, kruti, hitanshu, hug, smile, orange };
const HIDDEN_ANIMATED = { treat, laser, zoomies, kiss };

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
const TEXT_EXTENSIONS = [".md", ".txt"];

// Presentation-only classification for colored `ls` output. Never changes
// what ls() computes or returns -- only decides how the renderer paints
// names it already produced.
function classifyNode(name, node) {
  if (!node) return "file";
  if (node.type === "dir") return "dir";
  if (node.executable) return "executable";
  if (name.startsWith(".")) return "hidden";
  const lower = name.toLowerCase();
  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "image";
  if (TEXT_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "text";
  return "file";
}

function childKind(name, target) {
  if (name === "." || name === "..") return "dir";
  return classifyNode(name, target.children[name]);
}

function buildLsRows(shell, ast, stdout) {
  const pathArg = ast.args.find((a) => !a.startsWith("-")) ?? ".";
  const target = resolvePath(shell, pathArg);
  if (!target) return stdout.map((line) => [{ text: line, kind: null }]);

  if (target.type === "file") {
    return [[{ text: target.name, kind: classifyNode(target.name, target) }]];
  }

  if (!hasFlag(ast, "l")) {
    const names = stdout[0].split("  ");
    return [
      names.map((name, i) => ({
        text: i < names.length - 1 ? `${name}  ` : name,
        kind: childKind(name, target),
      })),
    ];
  }

  return stdout.map((row) => {
    const name = row.trim().split(/\s+/).pop();
    const prefix = row.slice(0, row.length - name.length);
    return [
      { text: prefix, kind: null },
      { text: name, kind: childKind(name, target) },
    ];
  });
}

export async function dispatch(shell, ast, renderer, content) {
  if (!ast.cmd) return;

  shell.commandCount++;

  if (ast.cmd === "birthday.exe" || ast.cmd === "./birthday.exe") {
    if (!shell.birthdayUnlocked) {
      renderer.error("bash: ./birthday.exe: Permission denied");
      return;
    }
    await runSequence(shell, renderer, content);
    return;
  }

  if (HIDDEN_ANIMATED[ast.cmd]) {
    await HIDDEN_ANIMATED[ast.cmd](shell, ast, renderer);
    return;
  }

  const fn = REGISTRY[ast.cmd] ?? HIDDEN[ast.cmd];
  if (!fn) {
    renderer.error(`catos: command not found: ${ast.cmd}`);
    return;
  }

  const result = fn(shell, ast) ?? {};
  if (result.stateChanges) Object.assign(shell, result.stateChanges);
  if (result.clearScreen) renderer.clearScreen();

  const stdout = result.stdout ?? [];
  if (ast.cmd === "ls" && stdout.length > 0) {
    renderer.printListing(buildLsRows(shell, ast, stdout));
  } else {
    for (const line of stdout) renderer.print(line);
  }
  for (const line of result.stderr ?? []) renderer.error(line);
}
