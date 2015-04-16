export ZSH=$HOME/.oh-my-zsh

source $ZSH/oh-my-zsh.sh

export PATH="/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin"

if [[ -n $SSH_CONNECTION ]]; then
  export EDITOR='vim'
else
  export EDITOR='mvim'
fi

PATH="/Applications/Postgres.app/Contents/Versions/9.4/bin:$PATH"
export PATH=$PATH:~/Workspace/scripts/src/bin

# Virtualenvwrapper
export WORKON_HOME=~/Envs
source /usr/local/bin/virtualenvwrapper.sh

# Composer
PATH=~/.composer/vendor/bin:$PATH

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting'

# Let's get the aliases
source $HOME/.aliases

# Add the ability to CTRL-Z back to Vim!
fancy-ctrl-z () {
  if [[ $#BUFFER -eq 0 ]]; then
    BUFFER="fg"
    zle accept-line
  else
    zle push-input
    zle clear-screen
  fi
}
zle -N fancy-ctrl-z
bindkey '^Z' fancy-ctrl-z

# Make directory and cd into it
mkcd () {
    mkdir "$1"
    cd "$1"
}

# Replace git alias with hub (It's totally safe!)
eval "$(hub alias -s)"

function chpwd() {
    emulate -L zsh
    la
}

# Antigen - A zsh plugin manager
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

antigen apply
