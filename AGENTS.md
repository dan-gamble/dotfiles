# DOTFILES

Dan's dotfiles for two machines: a Mac and an Omarchy (Arch + Hyprland) PC. GNU Stow links them into `$HOME`, driven by `./dot`.

## STRUCTURE

```
.dotfiles/
├── dot             # CLI: stow / unstow / doctor / machine
├── home/           # Stow package, linked on both machines (AGENTS.md)
│   ├── .pi/        # pi config + extension workspace (AGENTS.md)
│   └── .agents/    # Shared agent skills (AGENTS.md)
├── mac/            # Stow package, linked on the Mac only (AGENTS.md)
├── omarchy/        # Stow package, linked on the PC only (AGENTS.md)
├── private/        # Gitignored: a clone of dan-gamble/dotfiles-private, stowed when present (its own AGENTS.md)
├── rook/           # Agent-identity git/gh shims, put on PATH, never stowed (AGENTS.md)
├── packages/       # Brewfile, brew.sh (Arch package list doesn't exist yet)
├── macos/          # Mac app exports imported by hand: iTerm, Sublime, BTT, Velja, .osx, JetBrains
└── archive/        # Configs no machine uses any more, kept for reference
```

A stow package mirrors `$HOME`: `home/.config/herdr/config.toml` is linked to `~/.config/herdr/config.toml`.

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Shell aliases (both machines) | `home/.aliases` |
| Git config | `home/.gitconfig`, `home/.gitignore_global` |
| Starship prompt | `home/.config/starship.toml` |
| herdr config and scripts | `home/.config/herdr/` (AGENTS.md), `home/.local/bin/herdr-*` |
| yazi, zellij | `home/.config/yazi/`, `home/.config/zellij/` |
| Claude Code status line | `home/.claude/statusline.sh` |
| Claude Code: writing rules, agents, search hook | `home/.claude/` |
| Claude Code: per-machine section of CLAUDE.md | `mac/.claude/CLAUDE.machine.md`, `omarchy/.claude/CLAUDE.machine.md` |
| Claude Code: global CLAUDE.md, VOICE_PROFILE.md, client-facing skills | `private/.claude/` (private repo) |
| pi: global instructions, extensions, models | `home/.pi/` (AGENTS.md) |
| pi: PC-only instructions | `omarchy/.pi/agent/APPEND_SYSTEM.md` |
| Agent skills (pi, Claude Code) | `home/.agents/skills/` (AGENTS.md) |
| zsh, nvim, tmux, mise, zed, Ghostty (Mac) | `mac/` (AGENTS.md) |
| Git/gh identity for agents | `rook/` (AGENTS.md) |
| Mac packages | `packages/Brewfile` |

## CONVENTIONS

- Edit files in the repo. A linked file in `~` is the same file, so either path works, but new files always start in the repo.
- New config: put it in the package that matches where it's used, at the path it has under `~`, then run `./dot stow`.
- Shared by both machines → `home/`. One machine only → `mac/` or `omarchy/`.
- This repo is public. Anything that names a client, holds client data, or describes how BAO works internally → `private/`, which is its own repo: commit and push it from `~/.dotfiles/private`. If `private/` isn't cloned, say so and stop rather than putting it in `home/`.
- Each package's root `AGENTS.md` stays in the repo (`.stow-local-ignore`); linked to `~/AGENTS.md` it would apply to every project. A nested one, like `home/.config/herdr/AGENTS.md`, is linked next to its config.
- Run `./dot doctor` after moving or adding anything. It reports conflicts, broken links into the repo, and links still made by hand.

## ANTI-PATTERNS

- Linking by hand with `ln -s`. Use `./dot stow`.
- `stow --adopt`. It overwrites the repo copy with whatever is in `~`.
- Linking over Omarchy-managed config: `~/.config/hypr`, `~/.config/waybar`, `~/.config/omarchy`, Ghostty on the PC, and the PC's own nvim/tmux/mise (Omarchy defaults, not the Mac's).
- Committing secrets: tokens belong in `~/.zshrc.local`, `~/.config/rook/identity.env` and app auth stores, none of which are tracked.
- Setting `GIT_AUTHOR_*`, `--author` or `GH_TOKEN` to get around the Rook shims.

## COMMANDS

```sh
./dot stow     # link home/ plus this machine's package; replaces old hand-made links
./dot unstow   # remove those links
./dot doctor   # check links; exits non-zero on problems
./dot machine  # mac or omarchy
```

Stow itself: `brew install stow` on the Mac, `sudo pacman -S stow` on the PC.

## NOTES

- Commits from an agent are authored as `rook-bao` (see `rook/`). That account can't push to this repo, so leave pushing to Dan.
- The Mac half of the stow layout was written on the PC. If `./dot doctor` on the Mac reports conflicts, fix the package rather than the Mac.
- Stow links `home/.agents/skills/*` into `~/.agents/skills` (pi); `./dot stow` then links each into `~/.claude/skills` (Claude Code).

## IF YOU NOTICE DRIFT, FIX IT

- A tracked skill (`home/.agents/skills/<name>`) that is a real directory in `~/.agents/skills` or `~/.claude/skills`: fold any newer content into the repo copy, delete the live directory, re-run `./dot stow`.
- A linked file that became a real file (an app rewrote it): diff it with the repo copy, keep what matters, then restore the link with `./dot stow`.
- Don't restore files Dan deleted from the repo.
