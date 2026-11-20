# rook/ (agent git/gh identity)

`bin/git` and `bin/gh` are shims. When git or gh runs inside a coding agent (pi, Claude Code, Cursor, jcode, Codex), they switch to the Rook machine user (`rook-bao`): commits are authored as Rook and pushes and `gh` calls use Rook's key and token. Human shells pass straight through.

## HOW IT'S WIRED

- Not a stow package. `~/.bashrc` on the PC puts `~/.dotfiles/rook/bin` first on `PATH` (twice: once early, once after `mise activate`). `~/.local/bin/git` and `~/.local/bin/gh` also link here.
- On the Mac the original shims still live in `~/.local/bin`.
- Identity comes from `~/.config/rook/identity.env` (name, noreply email, SSH key path, gh token) and `~/.ssh/rook_bot`. Neither is in this repo.
- Each shim execs the next `git`/`gh` on `PATH`, so the same file works on both machines.

## ADDING AN AGENT

Find an environment variable the agent sets on every tool subprocess, then add it to the detection test in **both** `bin/git` and `bin/gh`, and to the comment above it.

## ANTI-PATTERNS

- Setting `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `--author` or `GH_TOKEN`. A set `GIT_AUTHOR_NAME` turns the git shim into a passthrough and commits as Dan.
- Calling `/usr/bin/git` or `/opt/homebrew/bin/git` directly.
- Running `git config user.name` or `user.email`.
- Moving this directory: `~/.bashrc` and the `~/.local/bin/git` and `gh` links name `~/.dotfiles/rook/bin`.
