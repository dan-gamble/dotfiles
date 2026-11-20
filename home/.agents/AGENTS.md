# ~/.agents (shared agent skills)

`skills/<name>/` here is linked as a whole directory to `~/.agents/skills/<name>`, which pi reads directly. `./dot stow` also links each one into `~/.claude/skills` for Claude Code, so both agents see one copy.

## WHAT'S TRACKED

| Skill | Source |
|-------|--------|
| `bao-theme` | Written here |
| `show-me` | humanlayer/skills, kept with local edits (`disable-model-invocation`) |
| `grilling`, `grill-me` | mattpocock/skills |

Every other skill in `~/.agents/skills` is installed per machine (`npx skills add …`) and stays untracked.

## CONVENTIONS

- A new skill: create `skills/<name>/SKILL.md`, then run `./dot stow`.
- Set `disable-model-invocation: true` in the frontmatter for skills that should only run when asked for by name.
- Updating a tracked skill from upstream writes through the link into this repo. Review the diff before committing.

## ANTI-PATTERNS

- A tracked skill copied into `~/.pi/agent/skills/` or `~/.claude/skills/` as a real directory. Those must be links.
- Replacing `~/.agents/skills/<name>` with a real directory.
