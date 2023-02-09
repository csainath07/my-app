# config valid only for current version of Capistrano
lock '3.17.1'

set :application, 'my-app'
set :repo_url, 'git@github.com:csainath07/my-app.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/var/www/my-app'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')
# set :linked_files, ".env"

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
# set :linked_dirs, "node_modules"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5
append :linked_dirs, "node_modules"
set :nvm_type, :user
set :nvm_node, 'v18.14.0'
set :ssh_options, { :forward_agent => true }
set :yarn_flags, %w(--silent --no-progress)
set :nvm_map_bins, %w{node npm yarn}

namespace :deploy do

  desc 'Restart application'
    task :restart do
      invoke 'react:build'
    end  

end

after 'deploy:publishing', 'deploy:restart'