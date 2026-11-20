# Global instructions

Machine-specific instructions are in `~/.pi/agent/APPEND_SYSTEM.md` (from `omarchy/` or `mac/` in `~/.dotfiles`).

## Worktrees

- If the repo has its own worktree command (unisian-next: `pnpm worktree <branch>`), use it.
- Otherwise create a git worktree through herdr, never with `git worktree add`: `herdr worktree create --cwd <repo> --branch <branch> --no-focus`. It checks out to `~/.herdr/worktrees/<repo>/<branch-slug>` and groups the workspace under the repo in herdr's sidebar, so Dan can see it's a worktree. A sibling folder such as `~/Code/<repo>-<topic>` reads as a separate repo.
- Open an existing worktree with `herdr worktree open --cwd <repo> --branch <branch>`. Remove it with `herdr worktree remove --workspace <id>`, which keeps the branch.
- A brief or handoff that names a worktree path gives the herdr path.
