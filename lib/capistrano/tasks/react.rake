namespace :react do
    desc 'RUN YARN BUILD'
      task :build do
        on roles(:app) do
          execute "sh -c \"cd #{deploy_to}/current && #{fetch(:build_command)}\""
        end
    end
end