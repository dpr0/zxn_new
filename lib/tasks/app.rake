# frozen_string_literal: true

namespace :app do
  namespace :npm do
    desc 'Install NPM packages'
    task :install do
      system 'npm install'
    end
  end
end

Rake::Task['assets:precompile'].enhance ['app:npm:install'] if Rake::Task.task_defined?('assets:precompile')
