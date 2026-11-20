# cursor-agent/ (Cursor CLI agent config)

The machine-independent half of `~/.cursor` for the Cursor agent, plus the link script for Dan's own skills.

## CONTENTS

| File | Links to |
|------|----------|
| `cli-config.json` | `~/.cursor/cli-config.json` (zen display, allowlist approvals, attribution) |
| `mcp.json` | `~/.cursor/mcp.json` (Linear, Shopify dev, Cloudflare docs, browser tools) |
| `rules/git-rook-persona.mdc` | `~/.cursor/rules/`: never override the Rook git/gh shims |
| `rules/pstack-models.mdc` | `~/.cursor/rules/`: per-role model picks |
| `install.sh` | Makes the links above, and links each `agents/skills/<name>` into `~/.cursor/skills` and `~/.claude/skills` |

## CONVENTIONS

- Not a stow package: on the Mac `~/.cursor` is `mac/.cursor/` itself, so stowing these into it would put links inside the repo.
- Run `./cursor-agent/install.sh` after adding a rule or a skill. It's safe to re-run; it backs up real files as `.bak`.
- Vendored Cloudflare skills, plugins, project state and transcripts are never tracked. Fetch them per machine.
