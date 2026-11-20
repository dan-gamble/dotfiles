# herdr config

One `config.toml` for the Mac and the PC. herdr is the terminal workspace manager on both: workspaces, tabs and panes, with coding agents recognised in the sidebar.

## SHAPE

- Mirrors Omarchy's tmux config: tmux session → herdr workspace, window → tab, pane → pane.
- Prefix is `ctrl+space`. Reload the config with `prefix+q`.
- Theme `terminal`, so herdr follows the terminal's (Omarchy's) palette. `panel_bg = "black"` keeps the active tab readable.
- New splits, tabs and workspaces follow the current pane's directory (`new_cwd = "follow"`).
- Keyboard scrolling calls `~/.local/bin/herdr-scroll` (`[[keys.command]]` blocks at the bottom), because herdr has no scroll action of its own.

## RELATED FILES

| File | Purpose |
|------|---------|
| `home/.local/bin/herdr-scroll` | Scrolls the focused pane through herdr's socket API (`pane.get`, `pane.scroll`) |
| `home/.local/bin/herdr-worker` | Starts Claude Code workers in a separate `workers` herdr session so Dan's sidebar shows only his own sessions. `herdr-worker --help` |

## CONVENTIONS

- Paths in the config use `~/.local/bin/...`, never `/Users` or `/home`, so the same file works on both machines.
- Check the installed herdr's syntax with `herdr --help` and the command groups (`herdr pane`, `herdr agent`, …). Don't run bare `herdr`: it opens the TUI.
- Mac-only key handling (Option as Alt) lives in the Ghostty config under `mac/`, not here.
