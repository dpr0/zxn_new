# frozen_string_literal: true

# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

task 'db:schema:dump': 'strong_migrations:alphabetize_columns'

task :faster_migrations do
  ActiveRecord::Base.dump_schema_after_migration = Rails.env.development? &&
                                                   `git status db/migrate/ --porcelain`.present?
end

task 'db:migrate': 'faster_migrations'
