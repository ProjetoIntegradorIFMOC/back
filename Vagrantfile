Vagrant.configure("2") do |config|
  config.vm.boot_timeout = 600
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "dev-vm"

  # Recursos da VM (Ajuste conforme necessário)
  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--memory", "2048"]
    vb.cpus = 4
    vb.name = "ambiente-ifcodes-ubuntu22"
    # vb.gui = true
  end

  # --- Pastas Sincronizadas ---
  config.vm.synced_folder ".", "/vagrant" , type: "rsync",
    rsync__exclude: [
      ".git/",
      ".vagrant/",
      "back/src/vendor/",
      "front/node_modules/"
    ]

  # --- Mapeamento de Portas ---
  # (Os serviços precisam ser iniciados manualmente na VM)
  config.vm.network "forwarded_port", guest: 2358, host: 2358 # Judge0 API
  config.vm.network "forwarded_port", guest: 5432, host: 5433 # DB Postgres
  config.vm.network "forwarded_port", guest: 8000, host: 8000 # Laravel (Nginx ou 'artisan serve')
  config.vm.network "forwarded_port", guest: 5173, host: 5173 # React ('npm run dev')

  # --- Provisionamento ---
  # Chama o script que instala as ferramentas
  config.vm.provision "shell", path: "provision-main.sh", name: "Instalar Ferramentas"
end