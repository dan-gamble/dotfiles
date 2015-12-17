# {{{ Initial setups
export PATH="/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin"
# }}}
# {{{ Add postgres.app to the path
PATH="/Applications/Postgres.app/Contents/Versions/9.4/bin:$PATH"
export PATH="~/Workspace/scripts/src/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"
# }}}
# {{{ Virtualenvwrapper
export WORKON_HOME=~/Envs
source /usr/local/bin/virtualenvwrapper.sh
# }}}
# {{{ Random options
unsetopt inc_append_history
unsetopt share_history
# }}}
# {{{ Let's get the aliases
source $HOME/.aliases
# }}}
# {{{ Let's get our custom functions
source $HOME/.dotfiles/zsh/.zshrcFunctions
# }}}
# {{{ Let's get our env variables
source $HOME/.env
# }}}
# {{{ Git stuffs
# Replace git alias with hub (It's totally safe!)
eval "$(hub alias -s)"
# }}}
# {{{ Composer
export PATH="$PATH:$HOME/.composer/vendor/bin"
# }}}
# {{{ Antigen - A zsh plugin manager
source $HOME/antigen.zsh

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
antigen bundle mafredri/zsh-async
antigen bundle sindresorhus/pure
antigen bundle tarruda/zsh-autosuggestions

antigen apply
# }}}
# vim:foldmethod=marker:foldlevel=0
