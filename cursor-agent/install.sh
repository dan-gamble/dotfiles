#!/usr/bin/env bash
# Link the tracked Cursor-agent config and personal skills into ~/.cursor and ~/.claude.
# Safe to re-run. Existing non-symlink files are backed up with a .bak suffix.
set -euo pipefail

DOTFILES="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

link() {
  src="$1" dest="$2"
  mkdir -p "$(dirname "$dest")"
  if [ -L "$dest" ]; then rm "$dest"
  elif [ -e "$dest" ]; then mv "$dest" "$dest.bak"; fi
  ln -s "$src" "$dest"
  echo "linked $dest -> $src"
}

# Cursor CLI config + MCP servers + always-apply rules
link "$DOTFILES/cursor-agent/cli-config.json" "$HOME/.cursor/cli-config.json"
link "$DOTFILES/cursor-agent/mcp.json" "$HOME/.cursor/mcp.json"
for f in "$DOTFILES/cursor-agent/rules/"*.mdc; do
  link "$f" "$HOME/.cursor/rules/$(basename "$f")"
done

# Personal skills, shared by every agent that reads a skills dir
for s in "$DOTFILES/agents/skills/"*/; do
  name="$(basename "$s")"
  link "${s%/}" "$HOME/.cursor/skills/$name"
  link "${s%/}" "$HOME/.claude/skills/$name"
done
