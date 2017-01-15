# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w(new/santi1.js new/santi2.js new/santi3.js my.css my.mobile.css my.js my.mobile.js agent.css  agent.js admin.css  admin.js  jquery.qrcode.min.js  new/main.js  new/photo-info.js)
