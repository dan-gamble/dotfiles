return {
  'renerocksai/telekasten.nvim',
  dependencies = {
    {
      'nvim-telescope/telescope.nvim',
      config = function ()
	require('telescope').load_extension('media_files')
      end
    },
    'nvim-telescope/telescope.nvim',
    'renerocksai/calendar-vim',
    'nvim-lua/popup.nvim',
    'nvim-lua/plenary.nvim',
    'nvim-telescope/telescope-media-files.nvim',
  },
  config = function()
	  require('telekasten').setup({
		  home = vim.fn.expand("~/Notes"), -- Put the name of your notes directory here
	  })
  end
}
