export PATH="/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin"

PATH="/Applications/Postgres.app/Contents/Versions/9.4/bin:$PATH"
export PATH="~/Workspace/scripts/src/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"

export WORKON_HOME=~/Envs
source /usr/local/bin/virtualenvwrapper.sh

unsetopt inc_append_history
unsetopt share_history

source $HOME/.aliases

source $HOME/.dotfiles/zsh/.zshrcFunctions

# Replace git alias with hub (It's totally safe!)
eval "$(hub alias -s)"

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

