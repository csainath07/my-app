namespace :react do
    desc 'RUN YARN BUILD'
      task :next_build do
        on roles(:all) do
          execute "sh -c \"cd #{fetch(:deploy_to)}/current && #{fetch(:build_command)}\""
        end
    end

    desc 'COPY UPDATED PM2 DEPLOY SCRIPT TO SHARED FOLDER'
      task :copy_pm2_deploy_script do
        on roles(:all) do
          execute "sh -c \"yes | cp -rf #{fetch(:deploy_to)}/current/deploy.json #{fetch(:deploy_to)}/shared\""
        end
    end

    desc 'FREE PORT 80'
      task :free_port_80 do
        on roles(:all) do
          execute "sh -c \"if sudo lsof -t -i:3001; then sudo kill -9 $(sudo lsof -t -i:3001); fi\""
        end
    end

    desc 'START PM2 PROCESS'
      task :start_pm2 do
        on roles(:all) do
          execute :pm2, :kill
          execute :pm2, :startOrRestart, "#{fetch(:deploy_to)}/shared/deploy.json"
        end
    end
end