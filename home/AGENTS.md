# home/ (stow package, both machines)

Linked into `$HOME` on the Mac and the Omarchy PC by `./dot stow`. Only put things here that read the same on both machines; anything that needs `/Users` vs `/home`, Homebrew, or Omarchy paths goes in `mac/` or `omarchy/`.

## CONTENTS

| File | Notes |
|------|-------|
| `.aliases` | Sourced by `~/.zshrc` on the Mac. Linked on the PC but `~/.bashrc` doesn't source it yet |
| `.gitconfig`, `.gitignore_global` | Git identity is Dan's; agent identity comes from `rook/`, not here |
| `.config/starship.toml` | Prompt on both machines |
| `.config/herdr/` | One herdr config for both machines (AGENTS.md) |
| `.config/yazi/`, `.config/zellij/config.kdl` | Linked as a whole directory / single file |
| `.local/bin/herdr-scroll`, `.local/bin/herdr-worker` | Called by the herdr config and by agents. Must stay executable |
| `.claude/statusline.sh` | Claude Code status line. Branches on `uname` for Keychain vs `~/.claude/.credentials.json` |

## CONVENTIONS

- Use `~` or `$HOME` in paths, never `/Users/dangamble` or `/home/dangamble`.
- A script that differs per OS branches on `uname` inside the script (see `statusline.sh`) instead of living in two packages.
- After adding a file, run `./dot stow`. If `./dot doctor` reports a conflict, a real file already sits at that path in `~`: compare it with the repo copy and move the differences in by hand, then delete it.
