# mac/ (stow package, Mac only)

Linked into `$HOME` on the Mac by `./dot stow`. Never linked on the PC.

## CONTENTS

| Path | Links to | Notes |
|------|----------|-------|
| `.zshrc`, `.zshrcFunctions` | `~/` | zsh is the Mac's shell. Tokens live in `~/.zshrc.local`, which is not tracked. The PC runs bash, with bits of this ported into its own `~/.bashrc` |
| `.config/nvim/` | `~/.config/nvim` | The Mac's Neovim. The PC uses Omarchy's LazyVim config instead |
| `.config/tmux/` | `~/.config/tmux` | `plugins/*` are gitlinks (empty submodules); TPM fills them in |
| `.config/mise/config.toml` | `~/.config/mise/config.toml` | The PC keeps its own, different mise config |
| `.config/zed/` | `~/.config/zed` | Local state is gitignored at the repo root |
| `.cursor/` | `~/.cursor` | Cursor's own `.gitignore` inside it keeps agent transcripts and state out of the repo. Don't delete it |
| `Library/Application Support/com.mitchellh.ghostty/config` | same path under `~` | Left Option is Alt for herdr's `alt+` binds; right Option still types `#` on the British layout |

## NOTES

- This layout was written from the PC. The first `./dot stow` on the Mac replaces the old hand-made links; anything `./dot doctor` still reports needs fixing here.
- If nvim, tmux or mise should become shared, move them to `home/` and settle the PC's differences first; the PC's versions are Omarchy-managed.
