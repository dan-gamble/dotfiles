export PATH="/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin"

PATH="/Applications/Postgres.app/Contents/Versions/9.5/bin:$PATH"
export PATH="~/Workspace/scripts/src/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"

export WORKON_HOME=~/Envs
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
# export GOPATH=$HOME/.go # Go
export EDITOR=vim

# Twitter API Keys
export CONSUMER_KEY='z89gIl9ySV8RsxHgKqzwwAHlk'
export CONSUMER_SECRET='N7EvNCJ81Tt0K6gr2x4lS6t9Fq0YzkwS9gNipMRYq9fS8QmvpW'
export ACCESS_TOKEN='234554298-IhNGEy9JINMqR1nV7j9NNGzPHeYZqC3K3Tr8YIf8'
export ACCESS_TOKEN_SECRET='99mbLjydqvFayQsSqtVnLhYKoL1jypXyqtdOoGxYOBfR9'

# List of folders to look into for `git` commits, comma separated.
export TTC_REPOS='~/Workspace'

# Location/zip code to check the weather for. Both 90210 and "San Francisco, CA"
# should be ok. It's using weather.service.msn.com behind the curtains.
export TTC_WEATHER='CB12LG'

# fzf
# --files: List files that would be searched but do not search
# --no-ignore: Do not respect .gitignore, etc...
# --hidden: Search hidden files and folders
# --follow: Follow symlinks
# --glob: Additional conditions for search (in this case ignore everything in the .git/ folder)
# export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow --glob "!.git/*"'
export GITHUB_TOKEN='4bf92f1876a0fa56a965bacabb5911765fbf8a7f'
export HOMEBREW_GITHUB_API_TOKEN=91daefea93ce4c14ab11e4d105bfce9f41a60dfc

source $HOME/antigen.zsh
source /usr/local/Cellar/z/1.9
export NVM_DIR="/Users/dangamble/.nvm"
export NVM_LAZY_LOAD=true
export NVM_NO_USE=true
export NVM_AUTO_USE=true
# [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

autoload -U zmv

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
antigen bundle djui/alias-tips
antigen bundle lukechilds/zsh-nvm

antigen apply

# Autoload .nvmrc file if it exists
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  fi
}
add-zsh-hook chpwd load-nvmrc

. `brew --prefix`/etc/profile.d/z.sh

compctl -g '~/.itermocil/*(:t:r)' itermocil

# [ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export PATH="/usr/local/opt/openssl/bin:$PATH"
