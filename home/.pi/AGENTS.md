# ~/.pi (pi agent config)

Global pi config, linked into `~/.pi` from `~/.dotfiles/home/.pi/`. An npm workspace for extensions, TypeScript, ESM only.

## STRUCTURE

```
home/.pi/
├── package.json        # Workspace root: workspaces = ["agent/extensions/*"], `npm run check`
├── tsconfig.json       # Strict, bundler resolution, noEmit; covers agent/extensions/**
└── agent/
    ├── AGENTS.md       # Dan's global instructions for every pi session (both machines)
    ├── models.json     # Extra model definitions (e.g. Claude Fable 5.1)
    └── extensions/     # Linked as a whole directory: anything created here lands in the repo
        └── herdr-agent-state.ts   # Installed by herdr; reports working/blocked/idle to its sidebar
```

PC-only instructions live in `omarchy/.pi/agent/APPEND_SYSTEM.md` (linked to `~/.pi/agent/APPEND_SYSTEM.md`). A Mac one would go in `mac/.pi/agent/APPEND_SYSTEM.md`.

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Global instructions | `agent/AGENTS.md` (shared), `omarchy/.pi/agent/APPEND_SYSTEM.md` (PC) |
| Single-file extension | `agent/extensions/<name>.ts` |
| Extension with its own deps or tests | `agent/extensions/<name>/` with `package.json` and `index.ts` |
| Add a model | `agent/models.json` |
| Skills | `~/.dotfiles/home/.agents/skills/`, never `agent/skills/` |
| Type-check extensions | `npm run check` in `~/.pi` |

## NOT TRACKED

Machine state and secrets stay in `~/.pi/agent` as real files: `auth.json`, `models-store.json`, `trust.json`, `sessions/`, `web-search-cache/`, `npm/`, `git/`.

Also untracked on purpose:

- `settings.json`: pi rewrites it (changelog versions and so on). The settings that matter are listed below; set them by hand on a new machine.
- `themes/omarchy-system.json`: Omarchy generates it from the current theme.
- `claude-bridge.json`, `bin/pi-notes`: hold machine-specific paths.
- `skills/`: Cloudflare skills installed per machine.

## KEY SETTINGS

```jsonc
// ~/.pi/agent/settings.json
{
  "defaultProvider": "anthropic",
  "defaultModel": "claude-opus-5-5",
  "defaultThinkingLevel": "high",
  "defaultTools": ["+codemode"],
  "theme": "omarchy-system",          // PC; Omarchy generates the theme
  "packages": [
    "npm:pi-web-access",
    "npm:pi-atelier",
    "git:github.com/dmmulroy/pi-claude-cli"
  ]
}
```

## CONVENTIONS

- Import types from `@earendil-works/pi-coding-agent`; pi provides it at runtime.
- `npm install` runs in `~/.pi`, so `node_modules/` and `package-lock.json` stay out of the repo. Per-extension `node_modules/` inside `agent/extensions/` are gitignored.
- After changing an extension, `/reload` in pi.
- Read pi's own docs before writing an extension: `$(dirname $(readlink -f $(which pi)))/docs/extensions.md`.

## ANTI-PATTERNS

- Skills under `agent/skills/` that duplicate `~/.agents/skills/`.
- Editing `herdr-agent-state.ts` by hand: herdr overwrites it on update. Commit herdr's changes as they come.
- Committing anything from the NOT TRACKED list.
