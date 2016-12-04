source 'https://gems.ruby-china.org/'
#if Gem.win_platform?
#  ruby '2.3.1'
#else
#  ruby '2.2.4'
#end
gem 'rails', '~> 5.0.0', '>= 5.0.0.1'
gem 'sqlite3'
gem 'puma', '~> 3.0'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'jquery-rails'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'

if Gem.win_platform?
  gem 'coffee-script-source', '1.8.0'
  gem 'wdm', '>= 0.1.0'
  gem 'bcrypt-ruby', '3.1.1.rc1', :require => 'bcrypt'
end

group :development, :test do
  gem 'byebug', platform: :mri
end
group :development do
  gem 'web-console'
  gem 'listen', '~> 3.0.5'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'bootstrap-sass'
gem "font-awesome-rails"
# 文件处理
gem "paperclip", "~> 5.0.0"

# 时间js
gem 'momentjs-rails', '>= 2.9.0'
gem 'bootstrap3-datetimepicker-rails', '~> 4.17.42'

# select2
gem "select2-rails"

#https://github.com/plataformatec/devise
gem 'devise'
gem 'devise_invitable'
#gem 'devise-i18n'
gem 'high_voltage'
#https://github.com/plataformatec/simple_form
gem 'simple_form'
#https://github.com/activerecord-hackery/ransack

gem 'friendly_id', '~> 5.1.0'

# 分页
gem 'will_paginate', '~> 3.1.0'

# 状态机功能
gem 'state_machines-activerecord'

# 支付宝接口
gem 'alipay'

# 货币及显示格式定义
gem 'monetize'

# 代理树形结构
gem 'awesome_nested_set'
#gem 'paranoid'

# send sms
gem 'alidayu-ruby', require: 'alidayu'

# 计划任务定义
gem 'whenever', :require => false

gem 'country_select', path: "./country_select"

group :development do
  gem 'better_errors'
  gem 'capistrano', '~> 3.0.1'
  gem 'capistrano-bundler'
  gem 'capistrano-rails', '~> 1.1.0'
  gem 'capistrano-rails-console'
  gem 'capistrano-rvm', '~> 0.1.1'
  gem 'foreman'
  gem 'hub', :require=>nil
  gem 'rails_layout'
  gem 'spring-commands-rspec'
end

# for staging
gem 'factory_girl_rails'
group :development, :test do
  gem 'faker'
  gem 'pry-rails'
  gem 'pry-rescue'
  gem 'rspec-rails'
  gem 'rubocop'
end
group :test do
  gem 'capybara'
  gem 'database_cleaner'
  gem 'launchy'
  gem 'selenium-webdriver'
end
