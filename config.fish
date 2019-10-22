posix-source ~/.env

# Alias
alias g="git"
alias gl="git pull"
alias gp="git push"
alias ga="git add"
alias h="history"
alias l="ls -lF $colorflag"
alias ls="command ls $colorflag"
alias ips="ifconfig -a | grep -o 'inet6\? \(addr:\)\?\s\?\(\(\([0-9]\+\.\)\{3\}[0-9]\+\)\|[a-fA-F0-9:]\+\)' | awk '{ sub(/inet6? (addr:)? ?/, \"\"); print }'"
alias clean_ds="find . -type f -name '*.DS_Store' -ls -delete"
alias clean_pyc="find . -type f -name '*.pyc' -ls -delete"
alias afk="/System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend"
alias cat="bat"
alias ping='prettyping --nolegend'

set HOMEBREW_CASK_OPTS "--appdir=~/Applications --fontdir=/Library/Fonts"
# set CPPFLAGS -I(brew --prefix openssl)/include
# set LDFLAGS -L(brew --prefix openssl)/lib

set SPACEFISH_TIME_SHOW true
