function makeNode({ type, name, permissions, executable = false, content = null, owner = "hitanshu" }) {
  const now = Date.now();
  return {
    type,
    name,
    permissions,
    executable,
    content: type === "file" ? content : null,
    children: type === "dir" ? {} : null,
    owner,
    created: now,
    modified: now,
  };
}

function makeDir(name, children = {}) {
  const node = makeNode({ type: "dir", name, permissions: "rwxr-xr-x", executable: true });
  node.children = children;
  return node;
}

function makeFile(name, content, opts = {}) {
  return makeNode({
    type: "file",
    name,
    permissions: opts.permissions ?? "rw-r--r--",
    executable: opts.executable ?? false,
    content,
  });
}

export function createInitialTree(content) {
  const home = makeDir("hitanshu", {
    "README.md": makeFile("README.md", content.README_CONTENT),
    "birthday.exe": makeFile("birthday.exe", "[binary CatOS birthday executable]", { executable: false }),
    "Pictures": makeDir("Pictures"),
    "Documents": makeDir("Documents"),
  });
  const homeDir = makeDir("home", { hitanshu: home });
  const root = makeDir("/", { home: homeDir });
  root.name = "";
  return root;
}

export function splitPath(pathStr) {
  return pathStr.split("/").filter((seg) => seg.length > 0);
}

export function absolutePathSegments(cwd, pathStr) {
  const segments = pathStr.startsWith("/") ? [] : splitPath(cwd);
  for (const part of splitPath(pathStr)) {
    if (part === ".") continue;
    if (part === "..") {
      segments.pop();
    } else {
      segments.push(part);
    }
  }
  return segments;
}

export function segmentsToPath(segments) {
  return "/" + segments.join("/");
}

export function getNodeAtSegments(root, segments) {
  let node = root;
  for (const seg of segments) {
    if (node.type !== "dir" || !node.children[seg]) return null;
    node = node.children[seg];
  }
  return node;
}

export function resolvePath(shell, pathStr) {
  const segments = absolutePathSegments(shell.cwd, pathStr);
  return getNodeAtSegments(shell.filesystem, segments);
}

export function resolveParent(shell, pathStr) {
  const segments = absolutePathSegments(shell.cwd, pathStr);
  const name = segments.pop();
  const parent = getNodeAtSegments(shell.filesystem, segments);
  return { parent, name, segments };
}

export function createFile(shell, pathStr, content = "", opts = {}) {
  const { parent, name } = resolveParent(shell, pathStr);
  if (!parent || parent.type !== "dir") return null;
  const node = makeFile(name, content, opts);
  parent.children[name] = node;
  parent.modified = Date.now();
  return node;
}

export function createDir(shell, pathStr) {
  const { parent, name } = resolveParent(shell, pathStr);
  if (!parent || parent.type !== "dir") return null;
  const node = makeDir(name);
  parent.children[name] = node;
  parent.modified = Date.now();
  return node;
}

export function removeNode(shell, pathStr) {
  const { parent, name } = resolveParent(shell, pathStr);
  if (!parent || !parent.children[name]) return false;
  delete parent.children[name];
  parent.modified = Date.now();
  return true;
}
