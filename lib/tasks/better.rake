namespace :better do
  desc "load sample"
  task :load_sample  => :environment do
    load File.join(Rails.root,'db/sample/seeds.rb')
  end

  desc "Integrate reset migration, load seed, load sample tasks"
  task :reload => :environment do
    Rake::Task['db:environment:set'].invoke 
    Rake::Task['db:migrate:reset'].invoke
    Rake::Task['db:seed'].invoke
    Rake::Task['better:load_sample'].invoke
  end
end
