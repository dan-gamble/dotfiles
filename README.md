# dotfiles

Configs for two machines: a Mac and an Omarchy (Arch + Hyprland) PC. Everything cross-platform gets linked on both, the Mac-only stuff stays on the Mac.

## Cross-platform (link on both machines)

| Dir | Links to |
|---|---|
| `zsh/` | `~/.zshrc`, `~/.zshrcFunctions` |
| `git/` | `~/.gitconfig`, `~/.gitignore_global` |
| `aliases/` | `~/.aliases` |
| `mise/` | `~/.config/mise` |
| `yazi/` | `~/.config/yazi` |
| `zellij/` | `~/.config/zellij/config.kdl` |
| `tmux/` | `~/.config/tmux` |
| `herdr/` | `~/.config/herdr/config.toml` (PC config; the Mac still has its own, see below) |
| `rook/bin/` | prepended to `PATH` in `.bashrc` (not linked) |
| `nvim/` | `~/.config/nvim` |
| `starship/`, `starship.toml` | `~/.config/starship.toml` |
| `claude/` | `~/.claude/statusline.sh` (Claude Code status line; needs `jq`, and `statusLine.command` pointed at it in `~/.claude/settings.json`) |

`.zshrc` expects these installed: zinit, zoxide, fzf, mise, atuin, starship.

`claude/statusline.sh` is one script for both machines: it reads the OAuth token from the Keychain on macOS and from `~/.claude/.credentials.json` on Linux, and branches on `uname` for BSD vs GNU `date`. `settings.json` itself is not tracked, since Claude Code rewrites it and most of it is machine-specific.

## Rook agent identity

`rook/bin/git` and `rook/bin/gh` are shims that swap in the Rook machine user (`rook-bao`) whenever git or gh runs inside a coding agent (Claude Code, pi, Cursor). Human shells pass straight through. They read `~/.config/rook/identity.env` (name, noreply email, SSH key path, gh token) which is **not** in this repo; copy it and `~/.ssh/rook_bot` from a machine that has them. The shims exec the next `git`/`gh` on `PATH`, so the same files work on the Mac and on Arch. On the Mac the original shims still live in `~/.local/bin`.

## Mac only

- `Brewfile` / `brew.sh` — packages and casks, `brew bundle`
- `.osx` — macOS defaults
- `cursor/` — Cursor settings and keybindings
- `iTerm/`, `sublime/` — app settings
- `dang.bttpreset` — BetterTouchTool
- `Velja Rules.velja-rules` — Velja link routing

None of this gets linked on Omarchy. The Arch equivalent of the Brewfile is a pacman/AUR list, which doesn't live here yet.

## Omarchy notes

- Omarchy manages its own Hyprland, waybar and theming config through its update mechanism. Don't link over those; keep any PC-only overrides out of this repo or in a dedicated dir that only the PC links.
- Terminal: iTerm config here is Mac-only. Ghostty is the cross-platform choice if a shared terminal config gets added.
- herdr: `herdr/config.toml` is the Omarchy config (tmux-mirror keymap on `ctrl+space`, `terminal` theme so it follows the Omarchy theme). The Mac runs a separate hand-tuned config with Mac-specific `[[keys.command]]` paths; converge them before linking it there.

## Setup

Symlinks are currently created by hand, e.g.:

```sh
ln -s ~/.dotfiles/zsh/.zshrc ~/.zshrc
ln -s ~/.dotfiles/git/.gitconfig ~/.gitconfig
ln -s ~/.dotfiles/mise ~/.config/mise
```

TODO: replace with GNU stow (works identically on macOS and Arch): https://medium.com/@protiumx/bash-gnu-stow-take-a-walk-while-your-new-macbook-is-being-set-up-351a6f2f9225
