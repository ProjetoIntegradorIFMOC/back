#!/bin/bash

echo "=== Iniciando provisionamento: Instalando Ferramentas (Otimizado) ==="
export DEBIAN_FRONTEND=noninteractive

  # 1. ATUALIZAR E INSTALAR BÁSICOS
  apt update -y
  apt upgrade -y
  apt install -y \
      curl \
      git \
      zip \
      unzip \
      software-properties-common \
      libpq-dev \
      postgresql-client

  # 2. INSTALAR DOCKER E DOCKER COMPOSE
  echo "Instalando Docker e Docker Compose..."
  if ! command -v docker &> /dev/null; then
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
      apt update
      apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      usermod -aG docker vagrant
      echo "Usuário 'vagrant' adicionado ao grupo 'docker'."
  else
      echo "Docker já está instalado."
  fi

  # 3. INSTALAR PILHA PHP (Mínima e Correta)
  echo "Instalando PHP 8.4 (Mínimo, com driver Postgres)..."
  add-apt-repository ppa:ondrej/php -y
  apt update
      sudo apt install php8.4 php8.4-cli php8.4-fpm \
        php8.4-pgsql \
        php8.4-zip \
        php8.4-xml \
        php8.4-curl \
        php8.4-mbstring \
        php8.4-bcmath \
        php8.4-intl \
        -y

  # 4. INSTALAR COMPOSER
  echo "Instalando Composer..."
  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

  # 5. INSTALAR PILHA NODE.JS (E ATUALIZAR NPM)
  echo "Instalando Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
  
  echo "Atualizando NPM para a versão mais recente..."
  npm install -g npm@latest

  # 6. CONFIGURAR GRUB (REQUISITO PARA JUDGE0/ISOLATE)
  echo "Configurando GRUB para Judge0..."
  if ! grep -q "systemd.unified_cgroup_hierarchy=0" /etc/default/grub; then
      cp /etc/default/grub /etc/default/grub.backup
      sed -i 's/GRUB_CMDLINE_LINUX=""/GRUB_CMDLINE_LINUX="systemd.unified_cgroup_hierarchy=0"/' /etc/default/grub
      update-grub
    echo "GRUB configurado. Um 'vagrant reload' é necessário para aplicar."
  else
    echo "Configuração do GRUB já aplicada."
  fi

echo "=== PROVISIONAMENTO DE FERRAMENTAS CONCLUÍDO ==="