#!/bin/bash
# init-backend-db.sh

echo "=========================================================="
echo "--- [init-backend-db.sh]: EXECUTANDO SCRIPT..."
echo "--- [init-backend-db.sh]: Tentando criar o banco '$POSTGRES_DB_BACKEND' com o usuário '$POSTGRES_USER'..."
echo "=========================================================="

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "$POSTGRES_DB_BACKEND" OWNER "$POSTGRES_USER";
EOSQL

echo "=========================================================="
echo "--- [init-backend-db.sh]: BANCO '$POSTGRES_DB_BACKEND' CRIADO COM SUCESSO."
echo "=========================================================="