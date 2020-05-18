export HOMEBREW_CASK_OPTS="--appdir=~/Applications --fontdir=/Library/Fonts"

export PATH="/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin"
export PATH="/Applications/Postgres.app/Contents/Versions/10/bin:$PATH"
export PATH="~/Workspace/scripts/src/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"

export WORKON_HOME=~/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh

unsetopt inc_append_history
unsetopt share_history

source $HOME/.aliases
# source $HOME/.env

# source $HOME/.dotfiles/zsh/.zshrcFunctions

# Replace git alias with hub (It's totally safe!)
eval "$(hub alias -s)"

export PATH=$(brew --prefix)/share/python:$(brew --prefix)/share/python/bin:$(brew --prefix)/share/python/sbin:$PATH
export PATH=$PATH:/usr/local/opt/go/libexec/bin # Go
export PATH="$PATH:$HOME/.yarn/bin"

# List of folders to look into for `git` commits, comma separated.
export TTC_REPOS='~/Workspace'

source ~/.env

# Location/zip code to check the weather for. Both 90210 and "San Francisco, CA"
# should be ok. It's using weather.service.msn.com behind the curtains.
export TTC_WEATHER='CB12LG'

source $HOME/antigen.zsh
source /usr/local/Cellar/z/1.9
# export NVM_DIR="/Users/dangamble/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
# place this after nvm initialization!
# autoload -U add-zsh-hook
# load-nvmrc() {
#   local node_version="$(nvm version)"
#   local nvmrc_path="$(nvm_find_nvmrc)"
#
#   if [ -n "$nvmrc_path" ]; then
#     local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
#
#     if [ "$nvmrc_node_version" = "N/A" ]; then
#       nvm install
#     elif [ "$nvmrc_node_version" != "$node_version" ]; then
#       nvm use
#     fi
#   elif [ "$node_version" != "$(nvm version default)" ]; then
#     echo "Reverting to nvm default version"
#     nvm use default
#   fi
# }
# add-zsh-hook chpwd load-nvmrc
# load-nvmrc

autoload -U zmv

# Use oh-my-zsh's library
antigen use oh-my-zsh

antigen bundle command-not-found
antigen bundle dotenv
antigen bundle git
antigen bundle node
antigen bundle npm
antigen bundle osx
antigen bundle pip
antigen bundle python
antigen bundle virtualenv

antigen bundle zsh-users/zsh-syntax-highlighting
antigen bundle mafredri/zsh-async
antigen bundle tarruda/zsh-autosuggestions
antigen bundle djui/alias-tips
antigen theme denysdovhan/spaceship-prompt
# antigen bundle lukechilds/zsh-nvm

antigen apply

autoload -U promptinit; promptinit
prompt spaceship

compctl -g '~/.itermocil/*(:t:r)' itermocil

if command -v brew >/dev/null 2>&1; then
    # Load rupa's z if installed
    [ -f $(brew --prefix)/etc/profile.d/z.sh ] && source $(brew --prefix)/etc/profile.d/z.sh
fi

export PATH="/usr/local/opt/openssl/bin:$PATH"

export CPPFLAGS=-I$(brew --prefix openssl)/include
export LDFLAGS=-L$(brew --prefix openssl)/lib
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
eval "$(pipenv --completion)"

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

[ -f "/Users/dangamble/.shopify-app-cli/shopify.sh" ] && source "/Users/dangamble/.shopify-app-cli/shopify.sh"

eval "$(fnm env --multi)"

export PATH=/Users/dangamble/.fnm/current/bin:$PATH
export FNM_MULTISHELL_PATH=/Users/dangamble/.fnm/current
export FNM_DIR=/Users/dangamble/.fnm/
export FNM_NODE_DIST_MIRROR=https://nodejs.org/dist
export FNM_LOGLEVEL=info

autoload -U add-zsh-hook
_fnm_autoload_hook () {
  if [[ -f .node-version && -r .node-version ]]; then
    echo "fnm: Found .node-version"
    fnm use
  elif [[ -f .nvmrc && -r .nvmrc ]]; then
    echo "fnm: Found .nvmrc"
    fnm use
  fi
}

add-zsh-hook chpwd _fnm_autoload_hook && _fnm_autoload_hook

