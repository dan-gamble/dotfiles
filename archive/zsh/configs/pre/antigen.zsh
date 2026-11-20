source $HOME/antigen.zsh

if (( ! ${fpath[(I)/usr/local/share/zsh/site-functions]} )); then
  FPATH=/usr/local/share/zsh/site-functions:$FPATH
fi

antigen use oh-my-zsh

antigen bundle django
antigen bundle dotenv
antigen bundle git
antigen bundle git-flow
antigen bundle github
antigen bundle heroku
antigen bundle npm
antigen bundle nvm
antigen bundle osx
antigen bundle pip
antigen bundle python
antigen bundle rails
antigen bundle virtualenv

antigen bundle zsh-users/zsh-syntax-highlighting
antigen bundle mafredri/zsh-async
antigen bundle tarruda/zsh-autosuggestions
antigen bundle djui/alias-tips
# antigen bundle lukechilds/zsh-nvm

antigen theme denysdovhan/spaceship-prompt

antigen apply
