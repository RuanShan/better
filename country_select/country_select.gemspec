# -*- encoding: utf-8 -*-
# stub: country_select 2.5.2 ruby lib

Gem::Specification.new do |s|
  s.name = "country_select"
  s.version = "2.5.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Stefan Penner"]
  s.date = "2016-11-14"
  s.description = "Provides a simple helper to get an HTML select list of countries.  The list of countries comes from the ISO 3166 standard.  While it is a relatively neutral source of country names, it will still offend some users."
  s.email = ["stefan.penner@gmail.com"]
  s.homepage = "https://github.com/stefanpenner/country_select"
  s.licenses = ["MIT"]
  s.rubyforge_project = "country_select"
  s.rubygems_version = "2.4.8"
  s.summary = "Country Select Plugin"
  s.test_files = ["spec/country_select_spec.rb", "spec/spec_helper.rb"]

  s.add_dependency "sort_alphabetical"

end
