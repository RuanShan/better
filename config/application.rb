require_relative 'boot'

require 'csv'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Better
  class Application < Rails::Application
    #config.cache_store = :redis_store, "redis://localhost:6379/1/cache", { expires_in: 90.minutes }

    config.generators do |g|
      g.test_framework :rspec,
        fixtures: true,
        view_specs: false,
        helper_specs: false,
        routing_specs: false,
        controller_specs: false,
        request_specs: false
      g.fixture_replacement :factory_girl, dir: "spec/factories"
    end

    config.autoload_paths << Rails.root.join('lib')

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.time_zone = 'Beijing'

    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]

    config.i18n.default_locale = :"zh-CN"

    config.active_record.time_zone_aware_types = [:datetime, :time]

    config.action_dispatch.default_headers = {    'X-Frame-Options' => 'ALLOWALL'}
  end
end
