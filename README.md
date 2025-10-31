# Guia de Setup do Ambiente de Desenvolvimento

Este guia explica como configurar e executar o sistema (Backend Laravel, Frontend React e API Judge0) localmente para desenvolvimento.

## Arquitetura do Ambiente

Nosso ambiente de desenvolvimento é flexível e separa a **criação da máquina** da **configuração das ferramentas**.

1.  **A Máquina (Ubuntu 22.04):** Você precisa de um ambiente Ubuntu 22.04. O método recomendado e automatizado é usar o `Vagrantfile` deste repositório, que sobe uma VM pré-configurada.
2.  **As Ferramentas (O Script):** O arquivo `provision-tools.sh` instala o PHP, Node, Docker e todas as dependências corretas.

**O ponto principal:** Se você não quiser usar o Vagrant (por exemplo, se preferir usar WSL2 no Windows ou uma VM manual), você pode. Basta pular o "Passo 1 (Opção A)" e, em vez disso, garantir que você execute o `provision-tools.sh` (Passo 2) dentro do seu próprio ambiente Ubuntu 22.04.

---

## ⚠️ Nota Importante para Usuários de Windows

Para que este ambiente funcione corretamente no Windows, duas configurações são essenciais **antes** de começar.

### 1. Rsync (Obrigatório para Sincronização)

Nosso `Vagrantfile` usa `rsync` para sincronização de arquivos. Ele é muito mais rápido que o padrão e resolve erros de `symlink` com o `npm install`.

O `rsync` não vem com o Windows, mas está incluído no **Git for Windows (Git Bash)**.

* **Ação:** Instale o [Git for Windows](https://git-scm.com/download/win). Durante a instalação, certifique-se de que o Git seja adicionado ao seu `PATH` (selecione a opção "Git from the command line and also from 3rd-party software"). O Vagrant o encontrará automaticamente.

### 2. Performance (Hypervisor)

O Vagrant (VirtualBox) pode ser lento no Windows. A performance melhora drasticamente se você habilitar as ferramentas de virtualização nativas do Windows.

* **Ação:**
    1.  Vá em "Ativar ou desativar recursos do Windows" no Painel de Controle.
    2.  Certifique-se de que as seguintes caixas estejam **marcadas**:
        * `Plataforma de Hipervisor do Windows`
    3.  Reinicie o seu computador.

---

## Passo 1: Subindo a Máquina (Ambiente)

Escolha **uma** das opções abaixo.

### Opção A: O Caminho Recomendado (Vagrant)

1.  Abra seu terminal na raiz deste projeto.
2.  Execute `vagrant up` para criar e provisionar a VM. Isso só precisa ser feito uma vez e pode demorar.
    ```bash
    vagrant up
    ```

> **Dica de Troubleshooting:** Se a máquina não subir ou apresentar erros de tela preta, descomente a linha `vb.gui = true` no `Vagrantfile`. Isso abrirá uma janela do VirtualBox, permitindo que você veja o que está acontecendo dentro da VM.


3.  O script de provisionamento exigirá um `reload` para aplicar as configurações de GRUB e Docker.
    ```bash
    vagrant reload
    ```

### Opção B: O Caminho Manual

Para usuários avançados que preferem não usar Vagrant.

1.  Instale e configure um ambiente Ubuntu 22.04.
2.  Clone este repositório para dentro desse ambiente.
3.  Continue para o **Passo 2**.

---

## Passo 2: Configurando as Ferramentas

Se você usou a **Opção A (Vagrant)**, este passo **já foi feito automaticamente** pelo `vagrant up`.

Se você usou a **Opção B (Manual)**, você deve executar o script de provisionamento agora para instalar todas as ferramentas:

```bash
# Apenas para usuários da Opção B (Manual)
cd /caminho/para/o/projeto
sudo ./provision-tools.sh

```

## Passo 3: Executando os Componentes (Fluxo Diário)

Este é o fluxo que você usará todos os dias para programar.

### Ação #1: Iniciar a Sincronização (Obrigatório)

Como usamos `rsync`, a sincronização de arquivos do seu PC (Host) para a VM (Guest) não é instantânea. Você **deve** iniciar o "observador" (`rsync-auto`).

* Abra um **novo terminal (no seu PC Host)**, navegue até a pasta do projeto e execute:
    ```bash
    vagrant rsync-auto
    ```
> **Deixe este terminal aberto o tempo todo** enquanto estiver programando. Ele copiará seus arquivos para a VM assim que você salvar.

### Ação #2: Ligar a Infraestrutura (DB e Judge0)

Usaremos o Docker *dentro* da VM para rodar o banco de dados, o Redis e o Judge0.

1.  Acesse a máquina virtual:
    ```bash
    vagrant ssh
    ```
    
2.  Navegue até a pasta do projeto (que está em `/vagrant`):
    ```bash
    cd /vagrant
    ```
    Se você estiver no Windows, certifique-se de que seus arquivos de configuração não possuem o caractere `\r` nos fins de linha
    ```bash
    sed 's/\r$//' judge0.conf && sed 's/\r$//' init-backend-db.sh
    ```
3.  Inicie os containers do (BD/Redis) e `judge0`:
    ```bash
    docker compose up -d
    ```
    *Obs: Deixe este terminal aberto ou saia com `exit`.*

### Ação #3: Ligar o Backend (Laravel)

1.  Abra um **segundo terminal** e acesse a VM:
    ```bash
    vagrant ssh
    ```
2.  Navegue até a pasta do backend:
    ```bash
    cd /vagrant/back/src
    ```

3.  **Configuração (Primeira Vez):**
    * Instale as dependências:
    ```bash
    composer install
    ```
    * Copie o arquivo de ambiente:
    ```bash
    `cp .env.example .env`
    ```

    * **Obtenha a Senha do Banco de Dados:**
      (Ainda na VM) Precisamos da senha do Postgres que foi gerada e salva no `judge0.conf`.
        ```bash
        # Exibe o conteúdo do judge0.conf para você copiar a senha
        cat /vagrant/judge0.conf
        ```
      Procure pela linha `POSTGRES_PASSWORD=` e copie o valor.

    * **Edite o `.env`:**
      Agora, edite o arquivo `.env` do backend (`nano .env`) e garanta que as seguintes variáveis estejam configuradas corretamente:
        ```ini
        # Edite estas linhas em /vagrant/back/.env
        APP_DEBUG=true
        APP_URL=http://localhost:8000
        
        # Cole a senha que você copiou do judge0.conf
        DB_PASSWORD=SUA_SENHA_DO_JUDGE0_CONF_VAI_AQUI 
        
        # Garanta que o resto das configurações do BD estão corretas
        DB_CONNECTION=pgsql
        DB_HOST=127.0.0.1
        DB_PORT=5432
        DB_DATABASE=ifcodes
        DB_USERNAME=integrador
        
        # Configuração do Sanctum para o frontend
        SANCTUM_STATEFUL_DOMAINS=localhost:5173
        SESSION_DOMAIN=localhost
        ```

    * Gere a chave do app: `php artisan key:generate`
    * Limpe o cache: `php artisan config:cache`
    * Rode as migrações: `php artisan migrate --seed`

4.  **Execute o servidor:**
    ```bash
    php artisan serve --host=0.0.0.0
    ```
    *Deixe este terminal rodando.*

### Ação #4: Ligar o Frontend (React)

1.  Abra um **terceiro terminal** e acesse a VM:
    ```bash
    vagrant ssh
    ```
2.  Navegue até a pasta do frontend:
    ```bash
    cd /vagrant/front
    ```

3.  **Configuração (Primeira Vez):**
    * Instale as dependências: `npm install`
    * Copie o arquivo de ambiente: `cp .env.example .env`

4.  **Execute o servidor:**
    ```bash
    npm run dev -- --host 0.0.0.0
    ```
    *Deixe este terminal rodando.*

---

## Resumo dos Acessos

Com tudo rodando, você pode acessar os serviços no seu navegador (no PC Host):

* **Frontend (React):** `http://localhost:5173`
* **Backend (Laravel):** `http://localhost:8000`
* **API (Judge0):** `http://localhost:2358`
* **Banco de Dados (Host):** `localhost` na porta `5433`

### Acessando os Bancos de Dados (via DBeaver, etc.)

Ambas as aplicações usam a mesma instância do PostgreSQL, mas bancos de dados separados.

**Banco de Dados do Judge0:**
* **Host/URL:** `localhost`
* **Porta:** `5433`
* **Base de Dados:** `judge0`
* **Usuário:** `integrador`
* **Senha:** A senha do postgres do arquivo `judge0.conf`.

**Banco de Dados do Backend:**
* **Host/URL:** `localhost`
* **Porta:** `5433`
* **Base de Dados:** `ifcodes`
* **Usuário:** `integrador`
* **Senha:** A senha do postgres do arquivo `judge0.conf`.

---
