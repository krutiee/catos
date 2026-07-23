const QUOTE_CHARS = ['"', "'"];

function tokenize(raw) {
  const tokens = [];
  let i = 0;
  const n = raw.length;

  while (i < n) {
    const ch = raw[i];

    if (ch === " " || ch === "\t") {
      i++;
      continue;
    }

    if (QUOTE_CHARS.includes(ch)) {
      const quote = ch;
      let value = "";
      i++;
      while (i < n && raw[i] !== quote) {
        value += raw[i];
        i++;
      }
      i++; // consume closing quote (or run off the end on an unclosed quote)
      tokens.push({ value, quoted: true });
      continue;
    }

    if (ch === "|") {
      tokens.push({ value: "|", quoted: false, op: true });
      i++;
      continue;
    }

    if (ch === ">") {
      if (raw[i + 1] === ">") {
        tokens.push({ value: ">>", quoted: false, op: true });
        i += 2;
      } else {
        tokens.push({ value: ">", quoted: false, op: true });
        i++;
      }
      continue;
    }

    let value = "";
    while (i < n && !" \t|>\"'".includes(raw[i])) {
      value += raw[i];
      i++;
    }
    tokens.push({ value, quoted: false });
  }

  return tokens;
}

function splitOnPipes(tokens) {
  const stages = [[]];
  for (const tok of tokens) {
    if (tok.op && tok.value === "|") {
      stages.push([]);
    } else {
      stages[stages.length - 1].push(tok);
    }
  }
  return stages;
}

function buildStageAst(tokens, raw) {
  const redirects = [];
  const words = [];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.op && (tok.value === ">" || tok.value === ">>")) {
      const targetTok = tokens[i + 1];
      redirects.push({ type: tok.value, target: targetTok ? targetTok.value : "" });
      i++; // consume target token
    } else {
      words.push(tok.value);
    }
  }

  const [cmd = "", ...args] = words;
  const flags = args.filter((a) => a.startsWith("-"));

  return { cmd, args, flags, redirects, pipeTo: null, raw };
}

export function parse(raw) {
  const tokens = tokenize(raw);
  if (tokens.length === 0) {
    return { cmd: "", args: [], flags: [], redirects: [], pipeTo: null, raw };
  }

  const stages = splitOnPipes(tokens);
  const asts = stages.map((stageTokens) => buildStageAst(stageTokens, raw));

  for (let i = 0; i < asts.length - 1; i++) {
    asts[i].pipeTo = asts[i + 1];
  }

  return asts[0];
}
