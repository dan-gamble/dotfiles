" Base {{{
set nocompatible
filetype plugin on
set autoread " update file with external system changes
set autochdir " change directory based on open file
set splitbelow "open vertical splits below always
set splitright "open horizontal splits to the right always
set clipboard=unnamed "use system clipboard
set undofile "keep track of file history even after closing, like PyCharm
set showmode "show the mode we are in
set wildmenu
set wildmode=list:longest
set wildignore+=.hg,.git,.svn
set wildignore+=.jpg,*.bmp,*.gif,*.png,*.jpeg
set wildignore+=*.DS_STORE
set wildignore+=*.pyc
set wildignore+=*.sass-cache
set ttyfast "speed up redrawing
set lazyredraw "redraw less
set ruler "show the position of the cursor
set backspace=indent,eol,start
set laststatus=2 "always show the status bar
set wrap "set word wrapping without line breaks
set textwidth=79 "set word wrap column
set formatoptions=qrn1
set colorcolumn=80 "ruler location
set list "show whitespace
set listchars=tab:▸\ ,extends:❯,precedes:❮ " what non spaced characters should look like
set expandtab " converts tabs to spaces in insert mode
set tabstop=2 " how many spaces a tab should be
set shiftwidth=2
let mapleader = ','
set softtabstop=2
set autoindent

let g:netrw_list_hide= '.*\.pyc$'

" stop vim exiting if there are no files open
cabbrev q <c-r>=(getcmdtype()==':' && getcmdpos()==1 ? 'close' : 'q')<CR>

" Mappings {{{
nnoremap ; :
nnoremap : ;

" file navigation
nnoremap <leader>ev :vsp $MYVIMRC<CR>
nnoremap <leader>ez :vsp ~/.zshrc<CR>
nnoremap <leader>sv :source $MYVIMRC<CR>

" save
nnoremap <Leader>w :w<CR>
nnoremap <Leader>o :CtrlP<CR>

" splits
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>

" movement
nnoremap <up> <nop>
nnoremap <down> <nop>
nnoremap <left> <nop>
nnoremap <right> <nop>
inoremap <up> <nop>
inoremap <down> <nop>
inoremap <left> <nop>
inoremap <right> <nop>
nnoremap j gj
nnoremap k gk
" }}}

"disable auto commenting
augroup auto_comment
  au!
  au FileType * setlocal formatoptions-=c formatoptions-=r formatoptions-=o
augroup END

" trim trailing whitespace on file save
fun! <SID>StripTrailingWhitespaces()
    let l = line(".")
    let c = col(".")
    %s/\s\+$//e
    call cursor(l, c)
endfun
autocmd BufWritePre * :call <SID>StripTrailingWhitespaces()

"open on line that was last edited
augroup line_return
  au!

  au BufReadPost *
        \ if line("'\"") > 9 && line("'\"") <= line("$") |
        \     execute 'normal! g`"zvzz' |
        \ endif
augroup END

" }}}
" Plugins {{{
call plug#begin('~/.vim/plugged')

Plug 'bling/vim-airline'
Plug 'altercation/vim-colors-solarized'
Plug 'SirVer/ultisnips'
Plug 'honza/vim-snippets'
Plug 'rstacruz/vim-hyperstyle'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'nvie/vim-flake8'
Plug 'scrooloose/syntastic'
Plug 'tpope/vim-fugitive'
Plug 'tmhedberg/SimpylFold'
Plug 'vim-scripts/indentpython.vim'
Plug 'marijnh/tern_for_vim'
Plug 'hail2u/vim-css3-syntax'
Plug 'terryma/vim-expand-region'
Plug 'vim-scripts/gitignore'
Plug 'rking/ag.vim'
Plug 'sjl/gundo.vim'
Plug 'airblade/vim-gitgutter'
Plug 'Yggdroot/indentLine'
Plug 'othree/html5.vim'
Plug 'othree/yajs.vim'
Plug 'valloric/MatchTagAlways'
Plug 'cakebaker/scss-syntax.vim'
Plug 'wellle/targets.vim'
Plug 'vim-scripts/YankRing.vim'
Plug 'morhetz/gruvbox'
Plug 'posva/vim-vue'
Plug 'wellle/targets.vim'

call plug#end()

" Airline {{{
let g:airline_theme='bubblegum'
let g:airline_left_sep=''
let g:airline_right_sep=''
" }}}
" Ag {{{
nnoremap <Leader>a :Ag
" }}}
" CtrlP {{{
let g:ctrlp_user_command =
      \ 'ag %s --files-with-matches -g "" --ignore "\.git$\|\.hg$\|\.svn$"'
let g:ctrlp_use_caching = 0
if executable('ag')
  set grepprg=ag\ --nogroup\ --nocolor

  let g:ctrlp_user_command = 'ag %s -l --nocolor -g ""'
else
  let g:ctrlp_user_command = ['.git', 'cd %s && git ls-files . -co --exclude-standard', 'find %s -type f']
  let g:ctrlp_prompt_mappings = {
        \ 'AcceptSelection("e")': ['<space>', '<cr>', '<2-LeftMouse>'],
        \ }
endif
let g:ctrlp_match_window = 'bottom,order:ttb'
let g:ctrlp_switch_buffer = 0
let g:ctrlp_working_path_mode = 0
let g:ctrlp_user_command = 'ag %s -l --nocolor --hidden -g ""'
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'
" }}}
" Expand region {{{
vmap v <Plug>(expand_region_expand)
vmap <C-v> <Plug>(expand_region_shrink)
" }}}
" Gundo {{{
nnoremap <leader>u :GundoToggle<CR>
" }}}
" Ultisnips {{{
let g:UltiSnipsExpandTrigger='<tab>'
let g:UltiSnipsJumpForwardTrigger='<tab>'
let g:UltiSnipsJumpBackwardTrigger='<s-tab>'

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"
" }}}
" Yankring {{{
nnoremap <silent> <leader>p :YRShow<cr>

let g:yankring_replace_n_pkey = ''
let g:yankring_replace_n_nkey = ''
" }}}
" }}}
" Syntax / Layout {{{
syntax enable
set background=dark
colorscheme gruvbox
set number
set relativenumber
set showcmd
set cursorline

set guifont=Menlo:h14
set linespace=6
 " }}}
" Backups {{{
set backup
set backupdir=~/.vim-tmp,~/.tmp,~/tmp,/var/tmp,/tmp
set backupskip=/tmp/*,/private/tmp/*
set directory=~/.vim-tmp,~/.tmp,~/tmp,/var/tmp,/tmp
set writebackup
" }}}
" Status line {{{
set statusline=
set statusline+=%<\                       " cut at start
set statusline+=%2*[%n%H%M%R%W]%*\        " flags and buf no
set statusline+=%-40f\                    " path
set statusline+=%=%1*%y%*%*\              " file type
set statusline+=%10((%l,%c)%)\            " line and column
set statusline+=%P                        " percentage of file
" }}}
" Searching {{{
set ignorecase
set smartcase
set gdefault
set incsearch
set showmatch
set hlsearch
nnoremap <leader>, :nohlsearch<cr>
vnoremap <silent> s //e<C-r>=&selection=='exclusive'?'+1':''<CR><CR>
    \:<C-u>call histdel('search',-1)<Bar>let @/=histget('search',-1)<CR>gv
omap s :normal vs<CR>
" }}}
" Folding {{{
filetype indent on
set foldmethod=indent
set foldlevel=99

nnoremap <leader><space> za
" }}}
" File Specific {{{
" CSS {{{
augroup ft_css
  au!

  au BufNewFile,BufRead *.less setlocal filetype=less
  au BufNewFile,BufRead *.scss setlocal filetype=scss

  au Filetype less,scss,css setlocal foldmethod=marker
  au Filetype less,scss,css setlocal foldmarker={,}
  au FileType less,scss,css setlocal omnifunc=csscomplete#CompleteCSS
  inoremap <buffer> {<cr> {}<left><cr><space><space>.<cr><esc>kA<bs>
  " }
augroup ENDV
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
" HTML / Django / Jinja {{{
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
au BufNewFile,BufRead *.py
    \ set tabstop=4 |
    \ set softtabstop=4 |
    \ set shiftwidth=4 |
    \ set textwidth=79 |
    \ set expandtab |
    \ set autoindent |
    \ set fileformat=unix |

let python_highlight_all=1
" }}}
" }}}

set modeline
set modelines=1
" specifics to .vimrc
" #-- Make sure foldings are markers and are all collapsed by default
" vim:foldmethod=marker:foldlevel=0
