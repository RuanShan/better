module EnvironmentVariables
  class Application < Rails::Application
    config.before_configuration do
      env_file = Rails.root.join('.env').to_s

      YAML.load(File.open(env_file)).each do |key, value|
        ENV[key.to_s] = value
      end if File.exists?(env_file)
    end # end config.before_configuration
  end # end class
end # end module
