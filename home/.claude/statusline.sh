#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')

CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; RESET='\033[0m'
TOP_C='\033[38;5;245m'
BOT_C='\033[38;5;240m'

if [ "$PCT" -ge 90 ]; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

FILLED=$((PCT / 10)); EMPTY=$((10 - FILLED))
# Build the bar with a loop: GNU tr is byte-based and mangles multibyte block chars
BAR=""
for ((i=0; i<FILLED; i++)); do BAR+="█"; done
for ((i=0; i<EMPTY; i++)); do BAR+="░"; done

MINS=$((DURATION_MS / 60000)); SECS=$(((DURATION_MS % 60000) / 1000))
COST_FMT=$(printf '$%.2f' "$COST")

# All rate-limit data comes from the usage endpoint (the stdin JSON lacks the
# Fable bucket), fetched with the OAuth token (macOS Keychain, or ~/.claude/.credentials.json on Linux) and cached for 60s.
# Token stays in memory only. Omit the whole segment on any failure.
USAGE_CACHE="$HOME/.claude/statusline-usage-cache.json"
if [ ! -f "$USAGE_CACHE" ] || [ -n "$(find "$USAGE_CACHE" -mmin +1 2>/dev/null)" ]; then
    if [ "$(uname)" = "Darwin" ]; then
        TOKEN=$(security find-generic-password -s "Claude Code-credentials" -w 2>/dev/null | jq -r '.claudeAiOauth.accessToken // empty')
    else
        TOKEN=$(jq -r '.claudeAiOauth.accessToken // empty' "$HOME/.claude/.credentials.json" 2>/dev/null)
    fi
    if [ -n "$TOKEN" ]; then
        USAGE=$(curl -s --max-time 2 https://api.anthropic.com/api/oauth/usage \
            -H "Authorization: Bearer $TOKEN" \
            -H "anthropic-beta: oauth-2025-04-20" 2>/dev/null)
        echo "$USAGE" | jq -e '.limits' >/dev/null 2>&1 && printf '%s' "$USAGE" > "$USAGE_CACHE"
    fi
fi

FIVE_H=""; SEVEN_D=""; FABLE=""
if [ -f "$USAGE_CACHE" ]; then
    FIVE_H=$(jq -r '.limits[]? | select(.kind=="session") | .percent // empty' "$USAGE_CACHE" 2>/dev/null)
    SEVEN_D=$(jq -r '.limits[]? | select(.kind=="weekly_all") | .percent // empty' "$USAGE_CACHE" 2>/dev/null)
    FABLE=$(jq -r '.limits[]? | select(.kind=="weekly_scoped" and .scope.model.display_name=="Fable") | .percent // empty' "$USAGE_CACHE" 2>/dev/null)
fi

RATE=""
[ -n "$FIVE_H" ] && RATE="5h ${FIVE_H%.*}%"
if [ -n "$SEVEN_D" ]; then
    [ -n "$RATE" ] && RATE="${RATE} | "
    RATE="${RATE}7d ${SEVEN_D%.*}%"
fi
if [ -n "$FABLE" ]; then
    [ -n "$RATE" ] && RATE="${RATE} | "
    RATE="${RATE}fable ${FABLE%.*}%"
fi
RATE_SEG=""
RATE_DISPLAY=""
if [ -n "$RATE" ]; then
    RATE_SEG=" | ${RATE}"
    RATE_DISPLAY=" ${BOT_C}│${RESET} ${RATE}"
fi

BRANCH=""
BRANCH_EMOJI_EXTRA=0
if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=" | 🌿 $(git branch --show-current 2>/dev/null)"
    BRANCH_EMOJI_EXTRA=1
fi

# Time of last user/assistant message, converted from transcript UTC to local HH:MM.
# Omit the whole segment on any failure (missing transcript, no timestamp, bad date parse).
LAST_MSG_TIME=""
CLOCK_EMOJI_EXTRA=0
TRANSCRIPT=$(echo "$input" | jq -r '.transcript_path // empty')
if [ -n "$TRANSCRIPT" ] && [ -f "$TRANSCRIPT" ]; then
    LAST_TS=$(tail -n 50 "$TRANSCRIPT" | jq -r 'select(.type=="user" or .type=="assistant") | .timestamp // empty' 2>/dev/null | tail -1)
    if [ -n "$LAST_TS" ]; then
        if [ "$(uname)" = "Darwin" ]; then
            EPOCH=$(date -j -u -f '%Y-%m-%dT%H:%M:%S' "${LAST_TS%.*}" '+%s' 2>/dev/null)
            [ -n "$EPOCH" ] && LAST_MSG_TIME=$(date -j -f '%s' "$EPOCH" '+%H:%M' 2>/dev/null)
        else
            LAST_MSG_TIME=$(date -d "$LAST_TS" '+%H:%M' 2>/dev/null)
        fi
    fi
fi
CLOCK_SEG=""
if [ -n "$LAST_MSG_TIME" ]; then
    CLOCK_SEG="🕐 ${LAST_MSG_TIME}"
    CLOCK_EMOJI_EXTRA=1
fi

# Measure visible widths + emoji compensation (emojis are 2 cols but ${#} counts 1)
TOP_PLAIN=" [$MODEL] 📁 ${DIR##*/}${BRANCH}"
if [ -n "$CLOCK_SEG" ]; then
    TOP_PLAIN="${TOP_PLAIN} ${CLOCK_SEG} "
else
    TOP_PLAIN="${TOP_PLAIN} "
fi
TOP_LEN=$(( ${#TOP_PLAIN} + 1 + BRANCH_EMOJI_EXTRA + CLOCK_EMOJI_EXTRA ))

BOT_PLAIN=" ${BAR} ${PCT}% | ${COST_FMT} | ⏱️ ${MINS}m ${SECS}s${RATE_SEG} "
BOT_LEN=${#BOT_PLAIN}

EXTRA=$((TOP_LEN - BOT_LEN - 1))

if [ "$EXTRA" -gt 0 ]; then
    # Top is wider: step-down layout
    TOP_BORDER=$(printf '─%.0s' $(seq 1 "$TOP_LEN"))
    BOT_BORDER=$(printf '─%.0s' $(seq 1 "$BOT_LEN"))
    MID_LEFT=$(printf '─%.0s' $(seq 1 "$BOT_LEN"))
    MID_RIGHT=$(printf '─%.0s' $(seq 1 "$EXTRA"))

    echo -e "${TOP_C}╭${TOP_BORDER}╮${RESET}"
    echo -e "${TOP_C}│${RESET} ${CYAN}[$MODEL]${RESET} 📁 ${DIR##*/}${BRANCH}${CLOCK_SEG:+ ${CLOCK_SEG}} ${TOP_C}│${RESET}"
    echo -e "${TOP_C}├${MID_LEFT}┬${MID_RIGHT}╯${RESET}"
    echo -e "${BOT_C}│${RESET} ${BAR_COLOR}${BAR}${RESET} ${PCT}% ${BOT_C}│${RESET} ${YELLOW}${COST_FMT}${RESET} ${BOT_C}│${RESET} ⏱️ ${MINS}m ${SECS}s${RATE_DISPLAY} ${BOT_C}│${RESET}"
    echo -e "${BOT_C}╰${BOT_BORDER}╯${RESET}"
else
    # Bottom is wider or equal: unified width box, pad top content
    WIDTH=$BOT_LEN
    BORDER=$(printf '─%.0s' $(seq 1 "$WIDTH"))
    TOP_PAD=$((WIDTH - TOP_LEN))
    [ "$TOP_PAD" -lt 0 ] && TOP_PAD=0
    PADDING=$(printf "%${TOP_PAD}s" "")

    echo -e "${TOP_C}╭${BORDER}╮${RESET}"
    echo -e "${TOP_C}│${RESET} ${CYAN}[$MODEL]${RESET} 📁 ${DIR##*/}${BRANCH}${PADDING}${CLOCK_SEG:+ ${CLOCK_SEG}} ${TOP_C}│${RESET}"
    echo -e "${TOP_C}├${BORDER}┤${RESET}"
    echo -e "${BOT_C}│${RESET} ${BAR_COLOR}${BAR}${RESET} ${PCT}% ${BOT_C}│${RESET} ${YELLOW}${COST_FMT}${RESET} ${BOT_C}│${RESET} ⏱️ ${MINS}m ${SECS}s${RATE_DISPLAY} ${BOT_C}│${RESET}"
    echo -e "${BOT_C}╰${BORDER}╯${RESET}"
fi
