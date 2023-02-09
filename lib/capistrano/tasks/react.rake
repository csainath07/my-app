namespace :react do
    desc 'RUN YARN BUILD'
      task :build do
        on roles(:all) do
          execute "sh -c \"cd #{fetch(:deploy_to)}/current && #{fetch(:build_command)}\""
        end
    end
end