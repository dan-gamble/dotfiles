" don't want compatibility with Vi  
set nocompatible

" Vim {{{

set encoding=utf-8
set modelines=1
set autoread
set clipboard=unnamed
set showcmd
set lazyredraw
set showmatch
set matchtime=3 " match for 3s(?)
set laststatus=2
set smartindent
set splitbelow
set splitright
set colorcolumn=80

set ruler

set so=10

" return to line open before last close
augroup line_return
    au!

    au BufReadPost *
        \ if line("'\"") > 9 && line("'\"") <= line("$") |
        \     execute 'normal! g`"zvzz' |
        \ endif
augroup END

set statusline=
set statusline+=%<\                       " cut at start
set statusline+=%2*[%n%H%M%R%W]%*\        " flags and buf no
set statusline+=%-40f\                    " path
set statusline+=%=%1*%y%*%*\              " file type
set statusline+=%10((%l,%c)%)\            " line and column
set statusline+=%P                        " percentage of file

" Mappings {{{

" set leader to be the comma `,`
let mapleader = ","
" set the local map leader(?)
let maplocalleader = "\\"

" lets get into normal mode
inoremap jk <esc>
inoremap jj <esc>

" unbind F1 help key
noremap <F1> :checktime<cr>
inoremap <F1> <esc>:checktime<cr>

" buffer close
noremap <leader>w :bd<cr>
" buffer open
noremap <leader>q :vert sb 

" }}}

" }}}

" Backups {{{

" enable backups
set backup
" we don't want the swp file
set noswapfile

" set backup directories
set undodir=~/.vim/tmp/undo//
set undofile
set backupdir=~/.vim/tmp/backup//
set directory=~/.vim/tmp/swap//

" lets make the above folders if they don't exist
if !isdirectory(expand(&undodir))
        call mkdir(expand(&undodir), 'p')
endif
if !isdirectory(expand(&backupdir))
        call mkdir(expand(&backupdir), 'p')
endif
if !isdirectory(expand(&directory))
        call mkdir(expand(&directory), 'p')
endif

" }}}
" Completion {{{

set complete=.,w,b,u,t
set completeopt=longest,menuone,preview

" }}}
" Cursorline {{{

augroup cline
    au!
    au WinLeave,InsertEnter * set nocursorline
    au WinEnter,InsertLeave * set cursorline
augroup END

" }}}
" Folding {{{

" we want to be able to fold
set foldenable
" open most folds by default
set foldlevelstart=10
" nested fold max level
set foldnestmax=10
" fold method
set foldmethod=indent

" {{{ Mappings

" open/close folds
nnoremap <leader><space> za
" focus current fold (aka close all others except current)
nnoremap <leader>z zMzvzz

" }}}

" }}}
" Line {{{

" set numbers to be relative to current line
set relativenumber
" turn on line numbers, we do this after relativenumber so the current line
" has it's number
set number
" highlight current line
set cursorline

" }}}
" Movement {{{

" fix vim backspace
set backspace=indent,eol,start

" Mappings {{{

" move vertically by visual line (won't skip wrapped lines)
nnoremap j gj
nnoremap k gk

" move to the beginning and end of line
nnoremap B ^
nnoremap E $
" make sure the old keybinds for these do diddly
nnoremap $ <nop>
nnoremap ^ <nop>

" highlight last inserted text
nnoremap gV `[v`]

" enter normal mode aka do <esc>
inoremap jk <esc>

" delete to end of line
nnoremap D d$

" go to beginning and end of line in insert mode
inoremap <c-a> <esc>I
inoremap <c-e> <esc>A

" easier pane moving
map <c-j> <c-w>j
map <c-k> <c-w>k
map <c-h> <c-w>h
map <c-l> <c-w>l

" }}}

" }}}
" Searching {{{

" search as characters are entered
set incsearch
" highlight matches
set hlsearch
" ignore case sensitivity
set ignorecase
" we want smartcase though
set smartcase
" replace on line by default
set gdefault

" Mappings {{{

" clear search highlights
nnoremap <leader>, :nohlsearch<CR>
" when going forward and back keep the line in the middle of the screen
nnoremap n nzzzv
nnoremap N Nzzzv

" open Quickfix window for the last search
nnoremap <silent> <leader>/ :execute 'vimgrep /'.@/.'/g %'<CR>:copen<CR>

" able to repeat change after search:
" search as usual /foo?bar!
" hit cs to change the first word
" hit n.n.n.n.n. to change as many as we need to
vnoremap <silent> s //e<C-r>=&selection=='exclusive'?'+1':''<CR><CR>
    \:<C-u>call histdel('search',-1)<Bar>let @/=histget('search',-1)<CR>gv
omap s :normal vs<CR>

" }}}

" }}}
" System + Shortcuts to common files i.e .vimrc, .zshrc {{{

" Mappings {{{ 

" .vimrc
nnoremap <leader>ev :e $MYVIMRC<CR>
" .zshrc
nnoremap <leader>ez :e ~/.zshrc<CR>
" source vimrc
nnoremap <leader>sv :source $MYVIMRC<CR>
" stop accidentally closing VIM
cabbrev q <c-r>=(getcmdtype()==':' && getcmdpos()==1 ? 'bdelete' : 'q')<CR>

" }}}

" }}}
" {{{ Tabs

" number of visual spaces per tab
set tabstop=4
" number of spaces in tab when editing
set softtabstop=4
" come on now, tabs are spaces..
set expandtab
" set indent to use multiple of shiftwidth
set shiftwidth=4
set shiftround

" }}}
" Terminal specific settings {{{

" time out on key codes but not mappinhs
set notimeout
set ttimeout
set timeoutlen=10

" }}}
" Wildmenu {{{

" visual autocomplete for command menu
set wildmenu
set wildmode=list:longest
" add some things to ignore
set wildignore+=.hg,.git,.svn
set wildignore+=.jpg,*.bmp,*.gif,*.png,*.jpeg
set wildignore+=*.DS_STORE
set wildignore+=*.pyc
set wildignore+=*.sass-cache

let g:netrw_list_hide= '.*\.pyc$'

" }}}
" Whitespace {{{

" show white space
set list
set listchars=tab:▸\ ,extends:❯,precedes:❮

" only show whitespace when not in insert mode
augroup trailing
    au!
    au InsertEnter * :set listchars-=trail:⌴
    au InsertLeave * :set listchars+=trail:⌴
augroup END

" }}}

" File specific {{{

" CSS {{{

augroup ft_css
    au!

    au BufNewFile,BufRead *.less setlocal filetype=less
    au BufNewFile,BufRead *.scss setlocal filetype=scss

    au Filetype less,scss,css setlocal foldmethod=marker
    au Filetype less,scss,css setlocal foldmarker={,}
    au FileType less,scss,css setlocal omnifunc=csscomplete#CompleteCSS
    au FileType less,scss,css setlocal iskeyword+=-

    " make the curson position properly when opening braces
    au BufNewFile,BufRead *.less,*.scss,*.css inoremap <buffer> {<cr> {}<left><cr><space><space><space><space>.<cr><esc>kA<bs>
    " }
augroup END

" }}}
" Django {{{

augroup ft_django
    au!

    au BufNewFile,BufRead urls.py         setlocal nowrap
    au BufNewFile,BufRead urls.py         normal! zR
    au BufNewFile,BufRead dashboard.py    normal! zR
    au BufNewFile,BufRead local.py        normal! zR

    au BufNewFile,BufRead admin.py        setlocal filetype=python.django
    au BufNewFile,BufRead urls.py         setlocal filetype=python.django
    au BufNewFile,BufRead models.py       setlocal filetype=python.django
    au BufNewFile,BufRead views.py        setlocal filetype=python.django
    au BufNewFile,BufRead settings.py     setlocal filetype=python.django
    au BufNewFile,BufRead settings.py     setlocal foldmethod=marker
    au BufNewFile,BufRead forms.py        setlocal filetype=python.django
augroup END

" }}}
" HTML, Django, Jinga {{{

augroup ft_html
    au!

    au BufNewFile,BufRead *.html,*.swig,*.twig setlocal filetype=htmldjango

    au FileType html,jinja,htmldjango setlocal foldmethod=manual

    " use localleader to fold current tag
    au FileType html,jinja,htmldjango nnoremap <buffer> <localleader>f Vatzf

    " use localleader to fold the current templatetag
    au FileType html,jinja,htmldjango nmap <buffer> <localleader>t viikojozf

    " indent tag
    au FileType html,jinja,htmldjango nnoremap <buffer> <localleader>= Vat=

    " django variables
    au Filetype jinja,htmldjango inoremap <buffer> {{<space> {{<space><space>}}<left><left><left>
    " }}

    " django tags
    au Filetype jinja,htmldjango inoremap <buffer> {%<space> {%<space><space>%}<left><left><left>
    " }
augroup END

" }}}
" Javascript {{{

augroup ft_javascript
    au!

    au FileType javascript setlocal foldmethod=marker
    au FileType javascript setlocal foldmarker={,}

    " make the curson position properly when opening braces
    au FileType javascript inoremap <buffer> {<cr> {}<left><cr><space><space><space><space>.<cr><esc>kA<bs>
    " }

    " prettyify dat json
    au FileType javascript nnoremap <buffer> <localleader>p Bvg_:!python -m json.tool<cr>
    au FileType javascript vnoremap <buffer> <localleader>p :!python -m jston.tool<cr>

augroup END

" }}}
" Python {{{

augroup ft_python
    au!

    au FileType python if exists('python_space_error_highlight') | unlet python_space_error_highlight | endif
augroup END

" }}}

" }}}

" Plugins (Vundle) {{{

" Before plugins {{{

" required for Vundle
filetype off

" set the runtime path to invlude Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim "requied
call vundle#begin() " required

" let Vundle manage Vundle
Plugin 'gmarik/Vundle.vim' " required

" }}}
" list of other plugins {{{

" ag | vim plugin for the silver searcher {{{

Plugin 'rking/ag.vim'

" Mappings {{{

nnoremap <leader>a :Ag<space>
nnoremap <leader>b :Ag <cword><cr>

" }}}

" }}}
" autoclose | trigger autoclosing for certain characters {{{

Plugin 'Townk/vim-autoclose'

" Mappings {{{

nmap <leader>x <Plug>ToggleAutoCloseMappings

" }}}

" }}}
" bufferline {{{

Plugin 'bling/vim-bufferline'

" }}}
" commentary | lets comment stuff out proper! {{{{{

Plugin 'tpope/vim-commentary'

augroup plugin_commentary
    au!
    au FileType htmldjango setlocal commentstring={#\ %s\ #}
augroup END

" Mappings {{{

nmap <leader>c <Plug>CommentaryLine
xmap <leader>c <Plug>Commentary

" }}}

" }}}
" css3 {{{

Plugin 'hail2u/vim-css3-syntax'

" }}}
" ctrlP | fuzzy search file opening {{{

Plugin 'ctrlpvim/ctrlp.vim'

" always open file in new buffer
let g:ctrlp_split_window = 0
let g:ctrlp_max_height = 20
let g:ctrlp_use_caching = 0
let g:ctrlp_working_path_mode = 'rw'
let g:ctrlp_max_files = 100000000

let g:ctrlp_user_command = ['.git', 'cd %s && git ls-files . -co --exclude-standard', 'find %s -type f']
let g:ctrlp_prompt_mappings = {
            \ 'AcceptSelection("e")': ['<space>', '<cr>', '<2-LeftMouse>'],
            \ }

nnoremap <leader>. :CtrlPTag<cr>
nnoremap <c-P> :CtrlP<cr>

" }}}
" easy align {{{

Plugin 'junegunn/vim-easy-align'

" Mappings {{{

" start interactive EasyAlign in visualmode (e.g vip<Enter>)
vmap <Enter> <Plug>(EasyAlign)
" start interactive EasyAlign for a motion/text object (e.g gaip)
nmap ga <Plug>(EasyAlign)

" }}}

" }}}
" emmet {{{

Plugin 'mattn/emmet-vim'

" let g:user_emmet_leader_key = '<C-e>'

" Mappings {{{

au FileType html,css,sass,scss,less imap <expr>jl emmet#expandAbbrIntelligent("\<tab>")

" }}}

" }}}
" git {{{

Plugin 'tpope/vim-fugitive'

" }}}
" git gutter {{{

Plugin 'airblade/vim-gitgutter'

" }}}
" gundo | sexy undo history {{{

Plugin 'sjl/gundo.vim'

let g:gundo_debug = 1
let g:gundo_preview_bottom = 1
let g:gundo_tree_statusline = "Gundo"
let g:gundo_preview_statusline = "Gundo Preview"

" Mappings {{{

" toggle gundo
nnoremap <leader>u :GundoToggle<CR>

" }}}

" }}}
" indentLine {{{

Plugin 'Yggdroot/indentLine'

" }}}
" HTML5 {{{

Plugin 'othree/html5.vim'

let g:event_handler_attributes_complete = 0
let g:rdfa_attributes_complete = 0
let g:microdata_attributes_complete = 0
let g:atia_attributes_complete = 0

" }}}
" LESS {{{

Plugin 'groenewege/vim-less'

" }}}
" MatchTagAlways | shows what HTML tags we are in {{{

Plugin 'valloric/MatchTagAlways'

" }}}
" python-mode {{{

Plugin 'klen/python-mode'

let g:pymode_doc = 1
let g:pymode_doc_key = 'M'
let g:pydoc = 'pydoc'
let g:pymode_syntax = 1
let g:pymode_syntax_all = 0
let g:pymode_syntax_builtin_objs = 1
let g:pymode_syntax_print_as_function = 0
let g:pymode_syntax_space_errors = 0

let g:pymode_run = 0
let g:pymode_breakpoint = 0

let g:pymode_folding = 0

let g:pymode_options_indent = 0

let g:pymode_rope = 1
let g:pymode_rope_global_prefix = '<localleader>R'
let g:pymode_rope_local_prefix = '<localleader>r'

let g:pymode_rope_goto_definition_bind = '<leader>b'
let g:pymode_rope_complete_on_dot = 0

let g:pymode_rope_autoimport = 0

let g:pymode_lint_ignore = "E501"

" }}}
" Twig / Swig {{{

Plugin 'lepture/vim-jinja'

" }}}
" scss-syntax | proper scss syntax highlighting {{{

Plugin 'cakebaker/scss-syntax.vim'

" }}}
" splitjoin {{{

Plugin 'AndrewRadev/splitjoin.vim'

" }}}
" surround {{{

Plugin 'tpope/vim-surround'

" }}}
" Syntastic {{{

Plugin 'scrooloose/syntastic'

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1

" Mappings {{{

nnoremap <leader>C :SyntasticCheck<cr>

" }}}

" }}}
" targets | ci' to change between ' etc. {{{

Plugin 'wellle/targets.vim'

" }}}
" vim-javascript {{{

Plugin 'pangloss/vim-javascript'

" }}}
" yank ring {{{

Plugin 'vim-scripts/YankRing.vim'

" Mappings {{{

nnoremap <silent> <leader>p :YRShow<cr>

let g:yankring_replace_n_pkey = ''
let g:yankring_replace_n_nkey = ''

" }}}

" }}}
" YouCompleteMe {{{

Plugin 'Valloric/YouCompleteMe'

let g:ycm_filetype_blacklist = {
    \ 'vim': 1
    \}

" }}}

" Colors / themes {{{

Plugin 'whatyouhide/vim-gotham'
Plugin 'morhetz/gruvbox'

" }}}

" }}}
" After plugins {{{

" all plugins must be before this line
call vundle#end() " required
filetype plugin indent on " required

" }}}

" }}}

" {{{ Theme (This after plugins so we can use Plugin themes)

" we want syntax..
syntax enable
" we also prefer dark styles
set background=dark
" my current favourite theme atm
colorscheme gruvbox

set guifont=Menlo:s12

" }}}

" specifics to .vimrc
" #-- Make sure foldings are markers and are all collapsed by default
" vim:foldmethod=marker:foldlevel=0
