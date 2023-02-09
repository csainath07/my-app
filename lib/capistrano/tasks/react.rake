set :build_command, 'yarn build && forever restartall'

namespace :react do
    desc 'RUN YARN BUILD'
      task :build do
        on roles(:app) do
          execute "sh -c \"cd #{deploy_to}/current && #{fetch(:build_command)}\""
        end
    end

    task :deploy do
      on roles(:all) do
        within fetch(:yarn_target_path, release_path) do
          execute "cd #{deploy_to}/current && #{fetch(:build_command)}"
        end
      end
    end
end