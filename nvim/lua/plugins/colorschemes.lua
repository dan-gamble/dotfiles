return {
  {
    'sainnhe/gruvbox-material',
    enabled = true,
    priority = 1000,
    config = function()
      vim.o.background = "dark"
      vim.g.gruvbox_material_background = "medium"
      vim.g.gruvbox_material_foreground = "mix"
      vim.g.gruvbox_material_transparent_background = 1
      vim.cmd.colorscheme 'gruvbox-material'
    end,
  },
}
