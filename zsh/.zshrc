# {{{ Initial setups
export ZSH=$HOME/.oh-my-zsh
source $ZSH/oh-my-zsh.sh
export PATH="/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin"
# }}}
# {{{ Add postgres.app to the path
PATH="/Applications/Postgres.app/Contents/Versions/9.4/bin:$PATH"
export PATH=$PATH:~/Workspace/scripts/src/bin
# }}}
# {{{ Virtualenvwrapper
export WORKON_HOME=~/Envs
source /usr/local/bin/virtualenvwrapper.sh
# }}}
# {{{ Let's get the aliases
source $HOME/.aliases
# }}}
# {{{ Let's get our custom functions
source $HOME/.dotfiles/zsh/.zshrcFunctions
# }}}
# {{{ Git stuffs
# Replace git alias with hub (It's totally safe!)
eval "$(hub alias -s)"
# }}}
# {{{ Antigen - A zsh plugin manager
source $HOME/.antigen/antigen.zsh

# Use oh-my-zsh's library
antigen use oh-my-zsh

antigen bundle command-not-found
antigen bundle git
antigen bundle node
antigen bundle npm
antigen bundle osx
antigen bundle pip
antigen bundle python
antigen bundle virtualenv

antigen bundle zsh-users/zsh-syntax-highlighting
antigen bundle sindresorhus/pure
antigen bundle sharat87/autoenv
antigen bundle djui/alias-tips
antigen bundle unixorn/autoupdate-antigen.zshplugin
antigen bundle walesmd/caniuse.plugin.zsh

antigen apply
# }}}
# vim:foldmethod=marker:foldlevel=0
