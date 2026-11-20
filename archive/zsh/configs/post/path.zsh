# ensure dotfiles bin directory is loaded first
PATH="$HOME/.bin:/usr/local/sbin:$PATH"
PATH="/Applications/Postgres.app/Contents/Versions/11/bin:$PATH"

PATH=$(brew --prefix)/share/python:$(brew --prefix)/share/python/bin:$(brew --prefix)/share/python/sbin:$PATH
PATH=$PATH:/usr/local/opt/go/libexec/bin # Go
PATH="$PATH:$HOME/.yarn/bin"
PATH="/usr/local/opt/openssl/bin:$PATH"

# mkdir .git/safe in the root of repositories you trust
PATH=".git/safe/../../bin:$PATH"
PATH="$PATH:$HOME/.rvm/bin"

export CPPFLAGS=-I$(brew --prefix openssl)/include
export LDFLAGS=-L$(brew --prefix openssl)/lib

export -U PATH
