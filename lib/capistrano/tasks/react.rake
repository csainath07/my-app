namespace :react do
    desc 'RUN YARN BUILD'
      task :build do
        on roles(:all) do
          execute "sh -c \"cd #{fetch(:deploy_to)}/current && #{fetch(:build_command)}\""
          execute "sh -c \"yes | cp -rf #{fetch(:deploy_to)}/current/deploy.json #{fetch(:deploy_to)}/shared\""
          execute "sh -c \"sudo kill -9 $(sudo lsof -t -i:80)\""
          execute :pm2, :kill
          execute :pm2, :startOrRestart, "#{fetch(:deploy_to)}/shared/deploy.json"
        end
    end
end