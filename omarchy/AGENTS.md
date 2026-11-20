# omarchy/ (stow package, Omarchy PC only)

Linked into `$HOME` on the Omarchy PC by `./dot stow`. Never linked on the Mac.

## CONTENTS

| Path | Notes |
|------|-------|
| `.pi/agent/APPEND_SYSTEM.md` | PC-only pi instructions: Dan works and takes calls here, so never load the machine |

## CONVENTIONS

- Only PC-specific overrides belong here. Omarchy owns `~/.config/hypr`, `~/.config/waybar`, `~/.config/omarchy`, Ghostty, nvim and tmux; don't link over them.
- `~/.bashrc` is still a real file (Omarchy writes its own defaults into it). Moving it here is a separate decision.
