#!/usr/bin/env python3
"""PreToolUse guard: keep filesystem searches inside $HOME.

Blocks find/bfs/fd/rg/grep -r/ag/ack (Bash) and the Grep/Glob tools when they
would search a directory outside the home directory, such as `find /`.
Claude's own scratch dirs are allowed.

Override: Dan has to ask for it explicitly. Claude then prefixes the command
with CLAUDE_SEARCH_OUTSIDE_HOME=1, and the hook asks Dan to confirm instead of
denying.

Fails open: if anything goes wrong while parsing, the call goes through.
"""
import json
import os
import re
import shlex
import sys

OVERRIDE = "CLAUDE_SEARCH_OUTSIDE_HOME"
HOME = os.path.realpath(os.path.expanduser("~"))
WRAPPERS = {"sudo", "env", "nice", "ionice", "time", "command", "exec", "nohup", "stdbuf", "doas"}
SEPARATORS = {";", "&", "&&", "|", "||", "|&", "(", ")", ";;"}
REDIRECTS = {"<", ">", ">>", "<<", "<<<", ">&", "<&", "&>", "&>>", ">|"}

# Options that take a separate value argument, per tool.
FIND_PRE_VALUE = {"-D", "-S", "-j", "-regextype"}  # find -D, bfs -S/-j, bfs -regextype
FD_VALUE = {"-e", "--extension", "-t", "--type", "-E", "--exclude", "-d", "--max-depth",
            "--min-depth", "--exact-depth", "-j", "--threads", "-S", "--size",
            "--changed-within", "--changed-before", "--newer", "--older", "-o", "--owner",
            "-c", "--color", "--max-results", "--ignore-file", "--format",
            "--path-separator", "--batch-size", "--strip-cwd-prefix"}
RG_VALUE = {"-e", "--regexp", "-f", "--file", "-g", "--glob", "--iglob", "-t", "--type",
            "-T", "--type-not", "-A", "--after-context", "-B", "--before-context", "-C",
            "--context", "-m", "--max-count", "-M", "--max-columns", "-j", "--threads",
            "-d", "--max-depth", "--max-filesize", "-E", "--encoding", "--type-add",
            "--type-clear", "-r", "--replace", "--sort", "--sortr", "--color", "--colors",
            "--context-separator", "--field-match-separator", "--field-context-separator",
            "--path-separator", "--pre", "--pre-glob", "--ignore-file", "--engine",
            "--dfa-size-limit", "--regex-size-limit", "-V", "--hostname-bin", "--hyperlink-format"}
GREP_VALUE = {"-e", "--regexp", "-f", "--file", "-m", "--max-count", "-A", "--after-context",
              "-B", "--before-context", "-C", "--context", "--include", "--exclude",
              "--exclude-dir", "--exclude-from", "-d", "--directories", "-D", "--devices",
              "--label", "--binary-files", "--color", "--colour", "--group-separator"}
AG_VALUE = {"-G", "--file-search-regex", "--ignore", "--ignore-dir", "-A", "--after", "-B",
            "--before", "-C", "--context", "-m", "--max-count", "--depth", "-g", "--pager",
            "--type-set", "--type-add", "--match", "--ignore-file"}


def allowed_roots(data):
    roots = [HOME, f"/tmp/claude-{os.getuid()}"]
    if data.get("scratchpad_dir"):
        roots.append(os.path.normpath(data["scratchpad_dir"]))
    return roots


def inside(path, roots):
    return any(path == r or path.startswith(r.rstrip("/") + "/") for r in roots)


def resolve(arg, cwd):
    """Turn a path argument into an absolute path, or None if it can't be known."""
    arg = re.sub(r"^\$\{?HOME\}?(?=/|$)", HOME, arg)
    arg = os.path.expanduser(arg)
    if "$" in arg or "`" in arg:
        return None  # depends on a variable we can't see
    m = re.search(r"[*?\[{]", arg)
    if m:  # glob: only the static prefix is a known directory
        arg = os.path.dirname(arg[: m.start()]) or ("/" if arg.startswith("/") else ".")
    return os.path.normpath(os.path.join(cwd, arg))


def positionals(args, value_opts):
    """Split args into (options, positionals), skipping option values."""
    opts, pos, i, end = [], [], 0, False
    while i < len(args):
        a = args[i]
        if end or not a.startswith("-") or a == "-":
            pos.append(a)
        elif a == "--":
            end = True
        else:
            opts.append(a)
            if "=" not in a and a in value_opts:
                i += 1
                if i < len(args):
                    opts.append(args[i])
        i += 1
    return opts, pos


def search_roots(cmd, args, cwd):
    """Directories a search command would walk, or [] if it isn't a search."""
    if cmd in ("find", "bfs"):
        i = 0
        while i < len(args) and (args[i] in ("-H", "-L", "-P", "-E", "-X", "-d", "-s", "-x")
                                 or re.fullmatch(r"-O\d*", args[i]) or args[i] in FIND_PRE_VALUE):
            i += 2 if args[i] in FIND_PRE_VALUE else 1
        roots = []
        while i < len(args) and not (args[i].startswith("-") or args[i] in ("(", "!", ")", ",")):
            roots.append(args[i])
            i += 1
        return roots or ["."]
    if cmd in ("fd", "fdfind"):
        if "-x" in args or "--exec" in args or "-X" in args or "--exec-batch" in args:
            cut = min(args.index(f) for f in ("-x", "--exec", "-X", "--exec-batch") if f in args)
            args = args[:cut]
        roots, base, rest = [], cwd, []
        i = 0
        while i < len(args):
            if args[i] in ("--search-path", "--base-directory") and i + 1 < len(args):
                if args[i] == "--search-path":
                    roots.append(args[i + 1])
                else:
                    base = resolve(args[i + 1], cwd) or cwd
                i += 2
                continue
            m = re.match(r"--(search-path|base-directory)=(.*)", args[i])
            if m:
                if m.group(1) == "search-path":
                    roots.append(m.group(2))
                else:
                    base = resolve(m.group(2), cwd) or cwd
            else:
                rest.append(args[i])
            i += 1
        _, pos = positionals(rest, FD_VALUE)
        roots += pos[1:]
        return [(r, base) for r in roots] if roots else [(".", base)]
    if cmd == "rg":
        opts, pos = positionals(args, RG_VALUE)
        no_pattern = any(o in ("-e", "--regexp", "-f", "--file", "--files", "--type-list")
                         or o.startswith(("--regexp=", "--file=")) for o in opts)
        paths = pos if no_pattern else pos[1:]
        return paths or ["."]
    if cmd in ("grep", "egrep", "fgrep", "rgrep", "ugrep"):
        opts, pos = positionals(args, GREP_VALUE)
        recursive = cmd == "rgrep" or any(
            o in ("--recursive", "--dereference-recursive", "recurse")
            or o.startswith("--directories=recurse")
            or (re.fullmatch(r"-[a-zA-Z]+", o) and ("r" in o or "R" in o))
            for o in opts)
        if not recursive:
            return []
        no_pattern = any(o in ("-e", "--regexp", "-f", "--file") or o.startswith(("--regexp=", "--file="))
                         for o in opts)
        paths = pos if no_pattern else pos[1:]
        return paths or ["."]
    if cmd in ("ag", "ack"):
        opts, pos = positionals(args, AG_VALUE)
        no_pattern = any(o in ("-g", "-f", "--files") for o in opts)
        paths = pos if no_pattern else pos[1:]
        return paths or ["."]
    return []


def tokenize(command):
    lex = shlex.shlex(command.replace("\n", " ; "), posix=True, punctuation_chars=";&|()<>")
    lex.whitespace_split = True
    lex.commenters = ""
    return list(lex)


def check_bash(command, cwd, roots, depth=0):
    """Return (offending_command, offending_root) list for a shell command string."""
    hits = []
    if depth > 3:
        return hits
    try:
        tokens = tokenize(command)
    except ValueError:
        # Unbalanced quotes: fall back to a crude check for a search rooted at /.
        if re.search(r"\b(find|bfs|fd|fdfind|rg|ag|ack)\s+(-\S+\s+)*/(\s|$)", command):
            hits.append(("search", "/"))
        return hits

    # Nested $(...) inside quoted strings.
    for t in tokens:
        for inner in re.findall(r"\$\(([^()]*)\)", t):
            hits += check_bash(inner, cwd, roots, depth + 1)

    segments, seg, skip_next = [], [], False
    for t in tokens:
        if skip_next:
            skip_next = False
            continue
        if t in REDIRECTS or re.fullmatch(r"\d?[<>]+&?", t):
            skip_next = True
            continue
        if t in SEPARATORS or set(t) <= set(";&|()"):
            if seg:
                segments.append(seg)
            seg = []
            continue
        seg.append(t)
    if seg:
        segments.append(seg)

    for seg in segments:
        while seg and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*=.*", seg[0]):
            seg = seg[1:]
        while seg and (os.path.basename(seg[0]) in WRAPPERS or seg[0] in ("timeout", "xargs")):
            head = os.path.basename(seg[0])
            seg = seg[1:]
            while seg and (seg[0].startswith("-") or re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*=.*", seg[0])):
                seg = seg[1:]
            if head == "timeout" and seg:
                seg = seg[1:]  # duration
        if not seg:
            continue
        cmd, args = os.path.basename(seg[0]), seg[1:]

        if cmd in ("cd", "pushd"):
            target = args[0] if args and args[0] != "-" else ("~" if not args else None)
            if target:
                cwd = resolve(target, cwd) or cwd
            continue
        if cmd in ("bash", "sh", "zsh", "dash") and "-c" in args:
            i = args.index("-c")
            if i + 1 < len(args):
                hits += check_bash(args[i + 1], cwd, roots, depth + 1)
            continue
        if cmd == "eval":
            hits += check_bash(" ".join(args), cwd, roots, depth + 1)
            continue

        for r in search_roots(cmd, args, cwd):
            arg, base = r if isinstance(r, tuple) else (r, cwd)
            path = resolve(arg, base)
            if path is not None and not inside(path, roots):
                hits.append((cmd, path))
    return hits


def decide(data):
    tool = data.get("tool_name")
    ti = data.get("tool_input") or {}
    cwd = data.get("cwd") or os.getcwd()
    roots = allowed_roots(data)

    if tool in ("Bash", "Monitor"):
        command = ti.get("command") or ""
        hits = check_bash(command, cwd, roots)
        override = re.search(rf"(^|[\s;&|(]){OVERRIDE}=1\b", command) is not None
        what = command
    elif tool in ("Grep", "Glob"):
        base = ti.get("path") or cwd
        path = resolve(base, cwd) or base
        hits = [] if inside(path, roots) else [(tool, path)]
        pattern = ti.get("pattern") or ""
        if tool == "Glob" and pattern.startswith(("/", "~")):
            p = resolve(pattern, cwd)
            if p is not None and not inside(p, roots):
                hits.append((tool, p))
        override = False
        what = f"{tool} {json.dumps(ti)}"
    else:
        return None

    if not hits:
        return None
    where = ", ".join(sorted({p for _, p in hits}))

    if override:
        return {
            "permissionDecision": "ask",
            "permissionDecisionReason": f"Search outside ~ ({where}). Allow only if you asked for this.",
        }
    return {
        "permissionDecision": "deny",
        "permissionDecisionReason": (
            f"Blocked: this searches outside the home directory ({where}). Dan's rule: filesystem "
            f"searches stay inside {HOME} unless he explicitly asks otherwise. A search rooted at / "
            "walks the whole disk and locks up the machine. Narrow it instead: search the project "
            "(node_modules, .agent_sources), a specific repo under ~/Code, or fetch the source with "
            "gh / npm pack. If you need a system path, ask Dan in chat and wait for his answer. "
            f"Only after he has explicitly said yes, rerun the Bash command prefixed with "
            f"{OVERRIDE}=1 so he can confirm it."
        ),
    }


def main():
    try:
        data = json.load(sys.stdin)
        result = decide(data)
    except Exception:
        return 0  # fail open
    if result:
        print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", **result}}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
