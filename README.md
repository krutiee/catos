# CatOS Birthday Terminal

A single-page, terminal-emulator birthday gift. No backend, no build step, no
dependencies — open `index.html` directly in a browser.

## Running it

Open `index.html` in a browser (double-click it, or `open index.html` on macOS).

## Architecture

```
Input -> Parser (AST) -> Command Dispatcher -> Filesystem -> Renderer
```

- `terminal/renderer.js` is the only module that touches the DOM.
- `terminal/filesystem.js` is an in-memory tree; nothing renders directly from it.
- `terminal/parser.js` tokenizes raw input into an AST (`{cmd, args, flags, redirects, pipeTo}`).
  Redirects and pipes are parsed structurally but not executed yet — this is
  intentional, so a future pass can wire up `>`, `>>`, and `|` without
  rewriting the parser.
- `terminal/commands.js` is the registry + dispatcher; individual commands
  live in `terminal/commands/*.js` and never call the renderer directly.
- `terminal/birthday.js` is the `birthday.exe` sequence, gated by
  `chmod +x birthday.exe` (see `terminal/commands/fs-perm.js`).

## Personalizing the content

All user-facing prose (the heartfelt birthday message, README flavor text,
ASCII art, loading-step jokes) is centralized in `terminal/content.js`, each
marked with a `// PLACEHOLDER:` comment. That's the one file to edit before
sending this to Hitanshu — nothing else should need touching.

## Current scope (MVP)

Implemented: `pwd`, `ls` (+ `-la`), `cd`, `cat`, `mkdir`, `touch`, `rm`,
`chmod`, `whoami`, `clear`, `help`, `echo`, and the `birthday.exe` sequence.

Deliberately not yet implemented (planned as a fast-follow): tab
autocomplete, real redirection/pipe execution, CatOS custom commands
(`inspect`, `fortune`, `catsay`, etc.), easter eggs, audio, and a visual
polish pass.
