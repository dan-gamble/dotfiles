local options = {
  incsearch = true,
  backup = false,
  clipboard = "unnamedplus",
  cmdheight = 1,
  completeopt = { "menuone", "noselect" },
  conceallevel = 0,
  fileencoding = "utf-8",
  hlsearch = true,
  ignorecase = true,
  mouse = "a",
  pumheight = 10,
  showmode = false,
  showtabline = 0,
  smartcase = true,
  smartindent = true,
  splitbelow = true,
  splitright = true,
  swapfile = false,
  undofile = true,
  updatetime = 100,
  writebackup = false,
  cursorline = true,
  number = true,
  relativenumber = true,
  signcolumn = 'yes',
	expandtab = true,
	shiftwidth = 2,
	tabstop = 2,
  scrolloff = 8,
  sidescrolloff = 8,
  colorcolumn = '80,120',
  laststatus = 0,
  showcmd = false,
  title = true,
}

vim.g.mapleader = ' '
vim.g.maplocalleader = ' '
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

for k, v in pairs(options) do
  vim.opt[k] = v
end
