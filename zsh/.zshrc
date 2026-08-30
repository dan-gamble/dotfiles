# Add deno completions to search path
if [[ ":$FPATH:" != *":/Users/dangamble/.zsh/completions:"* ]]; then export FPATH="/Users/dangamble/.zsh/completions:$FPATH"; fi
# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

export EDITOR=nvim

# Secrets live in ~/.zshrc.local, never in this repo
[ -f ~/.zshrc.local ] && source ~/.zshrc.local

# Set the directory we want to store zinit and plugins
ZINIT_HOME="${XDG_DATA_HOME:-${HOME}/.local/share}/zinit/zinit.git"

# Download Zinit, if it's not there yet
if [ ! -d "$ZINIT_HOME" ]; then
   mkdir -p "$(dirname $ZINIT_HOME)"
   git clone https://github.com/zdharma-continuum/zinit.git "$ZINIT_HOME"
fi

# Source/Load zinit
source "${ZINIT_HOME}/zinit.zsh"

# Add in Powerlevel10k
zinit ice depth=1; zinit light romkatv/powerlevel10k

# Add in zsh plugins
zinit light zsh-users/zsh-syntax-highlighting
zinit light zsh-users/zsh-completions
zinit light zsh-users/zsh-autosuggestions
zinit light Aloxaf/fzf-tab

# Add in snippets
zinit snippet OMZP::git
zinit snippet OMZP::sudo
zinit snippet OMZP::command-not-found

# Load completions
autoload -Uz compinit && compinit

zinit cdreplay -q

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Enable auto_cd for directory navigation without cd command
setopt auto_cd

# Command history improvements
HISTSIZE=5000
HISTFILE=~/.zsh_history
SAVEHIST=$HISTSIZE
HISTDUP=erase
setopt appendhistory
setopt hist_ignore_dups       # Don't save duplicate commands
setopt hist_ignore_space      # Don't save commands that start with space
setopt share_history          # Share history between sessions
setopt extended_history       # Save timestamp and duration

# Directory navigation and completion
setopt auto_pushd             # Push directories to the stack
setopt pushd_ignore_dups      # Don't push duplicate directories
setopt pushd_minus            # Make cd -1, cd -2 work
setopt auto_list              # Automatically list choices
setopt auto_menu              # Show menu for completion
setopt complete_in_word       # Complete from both ends of words

# Autocorrection and glob patterns
setopt correct                # Correct command spelling
setopt glob_dots              # Include hidden files in globbing

# Keybindings
bindkey -e
bindkey '^p' history-search-backward
bindkey '^n' history-search-forward
bindkey '^[w' kill-region

# Completion styling
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
zstyle ':completion:*' menu no
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'ls --color $realpath'
zstyle ':fzf-tab:complete:__zoxide_z:*' fzf-preview 'ls --color $realpath'

# Aliases
source $HOME/.aliases
source $HOME/.zshrcFunctions

alias ls='ls --color'
alias vim='nvim'
alias c='clear'
alias l="eza -l --icons --git -a"
alias lt="eza --tree --level=2 --long --icons --git"

# Deno
export PATH="/Users/dangamble/.deno/bin:$PATH"

export PATH="/Users/dangamble/.bin:$PATH"

# MYSQL
export PATH="/opt/homebrew/opt/mysql@8.4/bin:$PATH"

# Shell integrations
eval "$(zoxide init zsh)"

# pnpm
export PNPM_HOME="/Users/dangamble/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# eval "$(zellij setup --generate-auto-start zsh)"
eval "$(~/.local/bin/mise activate zsh)"
. "/Users/dangamble/.deno/env"
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/opt/homebrew/Caskroom/miniforge/base/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/opt/homebrew/Caskroom/miniforge/base/etc/profile.d/conda.sh" ]; then
        . "/opt/homebrew/Caskroom/miniforge/base/etc/profile.d/conda.sh"
    else
        export PATH="/opt/homebrew/Caskroom/miniforge/base/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

. "$HOME/.cargo/env"

function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
		builtin cd -- "$cwd"
	fi
	rm -f -- "$tmp"
}

export PATH="/Users/dangamble/.bun/bin:$PATH"

# Shopify Hydrogen alias to local projects
alias h2='$(npm prefix -s)/node_modules/.bin/shopify hydrogen'

# Added by LM Studio CLI (lms)
export PATH="$PATH:/Users/dangamble/.lmstudio/bin"
# End of LM Studio CLI section

# Opencode
export OPENCODE_DISABLE_PRUNE=true
export OPENCODE_DISABLE_AUTOCOMPACT=true

[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path zsh)"

# Claude scripts
export PATH="$HOME/Code/claude-scripts:$PATH"

# Docket nudge: print due summary before launching Claude Code
claude() {
  [[ -x "$HOME/.claude/skills/docket/bin/session-hook.sh" ]] && \
    "$HOME/.claude/skills/docket/bin/session-hook.sh"
  command claude "$@"
}


# nub
export PATH="$HOME/.nub/bin:$PATH"

# Self-heal terminal tty mode (fixes line-staircase in zellij panes after resize/sleep)
autoload -Uz add-zsh-hook
_fix_tty() { stty sane 2>/dev/null }
add-zsh-hook precmd _fix_tty

# bun completions
[ -s "/Users/dangamble/.bun/_bun" ] && source "/Users/dangamble/.bun/_bun"

. "$HOME/.atuin/bin/env"

eval "$(atuin init zsh)"


# Added by jcode installer
export PATH="/Users/dangamble/.local/bin:$PATH"
