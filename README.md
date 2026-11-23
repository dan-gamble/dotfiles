# dotfiles

Configs for two machines: a Mac and an Omarchy (Arch + Hyprland) PC. [GNU Stow](https://www.gnu.org/software/stow/) links them into `$HOME`; `./dot` wraps it.

## Setup

```sh
git clone git@github.com:dan-gamble/dotfiles.git ~/.dotfiles
git clone git@github.com:dan-gamble/dotfiles-private.git ~/.dotfiles/private   # optional, see Private package
brew install stow          # Mac
sudo pacman -S stow        # Omarchy
~/.dotfiles/dot stow
~/.dotfiles/dot doctor
```

Then, for pi: `cd ~/.pi && npm install` (extension types), and set `~/.pi/agent/settings.json` from `home/.pi/AGENTS.md`.

`dot stow` links `home/`, the machine's own package, and `private/` when it's cloned. Links made by hand before the move to Stow are replaced; real files are never overwritten, and show up as conflicts in `dot doctor`.

## Layout

A Stow package mirrors `$HOME`: `home/.config/herdr/config.toml` is linked to `~/.config/herdr/config.toml`.

| Dir | What it is |
|---|---|
| `home/` | Linked on both machines: aliases, git, starship, herdr (+ `herdr-scroll`, `herdr-worker`), yazi, zellij, Claude Code status line, pi config (`.pi/`), agent skills (`.agents/skills/`, also linked into `~/.claude/skills`) |
| `mac/` | Linked on the Mac only: zsh, nvim, tmux, mise, zed, Ghostty |
| `omarchy/` | Linked on the PC only: PC-specific pi instructions, the PC's `~/.claude/CLAUDE.machine.md` |
| `private/` | Not in this repo. A clone of the private `dotfiles-private` repo, gitignored here, linked on every machine that has it |
| `rook/` | Agent git/gh identity shims, on `PATH` via `~/.bashrc`; not stowed |
| `packages/` | `Brewfile`, `brew.sh`. The Arch equivalent doesn't live here yet |
| `macos/` | Mac app settings imported by hand: iTerm, Sublime, BetterTouchTool, Velja, `.osx`, JetBrains |
| `archive/` | Configs no machine uses any more (fish, vim, virtualenvwrapper, old zsh, gh, git template) |

Each area has an `AGENTS.md` describing it for coding agents; start at the root one.

## Private package

Config that names clients or describes how BAO works lives in [`dan-gamble/dotfiles-private`](https://github.com/dan-gamble/dotfiles-private), not here: Claude Code's global `CLAUDE.md`, `VOICE_PROFILE.md`, and skills with client examples. It's cloned into `~/.dotfiles/private/` (gitignored by this repo) and works like any other package, so `private/.claude/CLAUDE.md` is linked to `~/.claude/CLAUDE.md`. Without the clone, `dot` skips it.

Putting it on a machine that already has these files as real files:

```sh
git clone git@github.com:dan-gamble/dotfiles-private.git ~/.dotfiles/private
~/.dotfiles/dot doctor     # lists each real file in the way as a conflict
mkdir -p ~/.claude/backups/pre-dotfiles
mv ~/.claude/CLAUDE.md ~/.claude/VOICE_PROFILE.md ~/.claude/backups/pre-dotfiles/   # and anything else doctor listed
~/.dotfiles/dot stow
~/.dotfiles/dot doctor     # should end on "all good"
```

Editing: change the file through either path, then commit and push from `~/.dotfiles/private`. It's its own repo, so this repo never shows it as changed.

## Rook agent identity

`rook/bin/git` and `rook/bin/gh` swap in the Rook machine user (`rook-bao`) whenever git or gh runs inside a coding agent (Claude Code, pi, Cursor, jcode, Codex). Human shells pass straight through. They read `~/.config/rook/identity.env` and `~/.ssh/rook_bot`, which are **not** in this repo; copy them from a machine that has them. See `rook/AGENTS.md`.

## Omarchy notes

- Omarchy manages its own Hyprland, waybar, theming, Ghostty, nvim (LazyVim) and tmux config. Don't link over those; PC-only overrides go in `omarchy/`.
- herdr: one config for both machines (tmux-mirror keymap on `ctrl+space`, `terminal` theme so it follows the Omarchy theme).
