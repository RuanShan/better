namespace :better do
  desc "load sample"
  task :load_sample  => :environment do
    load File.join(Rails.root,'db/sample/seeds.rb')
  end
end
