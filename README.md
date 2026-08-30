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
| `nvim/` | `~/.config/nvim` |
| `starship/`, `starship.toml` | `~/.config/starship.toml` |

`.zshrc` expects these installed: zinit, zoxide, fzf, mise, atuin, starship.

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

## Setup

Symlinks are currently created by hand, e.g.:

```sh
ln -s ~/.dotfiles/zsh/.zshrc ~/.zshrc
ln -s ~/.dotfiles/git/.gitconfig ~/.gitconfig
ln -s ~/.dotfiles/mise ~/.config/mise
```

TODO: replace with GNU stow (works identically on macOS and Arch): https://medium.com/@protiumx/bash-gnu-stow-take-a-walk-while-your-new-macbook-is-being-set-up-351a6f2f9225
