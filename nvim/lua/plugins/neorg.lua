return {
  "nvim-neorg/neorg",
  build = ":Neorg sync-parsers",
  dependencies = { "nvim-lua/plenary.nvim" },
  config = function()
    require("neorg").setup {
      -- configuration here
      load = {
        ["core.defaults"] = {},  -- Loads default behaviour
        ["core.concealer"] = {}, -- Adds pretty icons to your documents
        ["core.summary"] = {},
        ["core.dirman"] = {      -- Manages Neorg workspaces
          config = {
            workspaces = {
              home = "~/Notes/home",
              work = "~/Notes/work",
            },
          },
        },
      },
    }
  end,
}
