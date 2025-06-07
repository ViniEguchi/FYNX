#!/bin/bash

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Iniciando configuração do ambiente...${NC}"

# === Verificar se é root ===
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Execute como root (use: sudo $0)${NC}"
  exit 1
fi

# === Atualização inicial ===
sudo apt update

# === Instalações necessárias ===
for pkg in git curl; do
  if ! command -v $pkg &> /dev/null; then
    echo -e "${GREEN}Instalando $pkg...${NC}"
    sudo apt install -y $pkg
  fi
done

if ! command -v java &> /dev/null; then
  read -p "Java não está instalado. Deseja instalar? [s/n]: " opt
  [ "$opt" = "s" ] && sudo apt install -y openjdk-17-jre
fi

if ! command -v docker &> /dev/null; then
  read -p "Docker não está instalado. Deseja instalar? [s/n]: " opt
  if [ "$opt" = "s" ]; then
    sudo apt install -y docker.io
    sudo systemctl enable --now docker
  fi
fi

if ! command -v docker-compose &> /dev/null; then
  read -p "Docker Compose não está instalado. Deseja instalar? [s/n]: " opt
  if [ "$opt" = "s" ]; then
    DOCKER_COMPOSE_VERSION="1.29.2"
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    echo -e "${GREEN}Docker Compose instalado na versão ${DOCKER_COMPOSE_VERSION}${NC}"
  fi
fi

# === Clone do repositório ===
if [ ! -d FYNX ]; then
  echo -e "${GREEN}Clonando o repositório FYNX...${NC}"
  git clone https://github.com/ViniEguchi/FYNX.git
else
  echo -e "${GREEN}Repositório FYNX já existe. Pulando clone.${NC}"
fi

# === Estrutura de diretórios ===
mkdir -p db-init node-app java-app

# === Arquivo .env ===
if [ ! -f .env ]; then
  cat <<EOF > .env
# Ambiente
AMBIENTE_PROCESSO=desenvolvimento

# MySQL
DB_HOST=mysql
DB_DATABASE=FYNX
DB_USER=admin
DB_PASSWORD=urubu100
DB_PORT=3306

# Node API
APP_PORT=3333
APP_HOST=localhost

# AWS (Exemplo)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=

BUCKET_NAME=
ARCHIEVE_NAME=
AWS_REGION=us-east-1

SLACK_WEBHOOK_URL

EOF
  echo -e "${GREEN}Criado: .env${NC}"
fi

# === Copiando banco ===
rm -rf db-init/*
cp -r FYNX/Web-Data-Viz/src/database/script-tabelas.sql db-init/init.sql

# === Copiando Node ===
rm -rf node-app/*
cp -r FYNX/Web-Data-Viz/* node-app/


# === Copiando Java ===
rm -rf java-app/*
cp -r FYNX/java/jars/* java-app/

# === Dockerfile Node ===
cat <<EOF > node-app/Dockerfile
FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3333

CMD ["npm", "start"]
EOF

echo -e "${GREEN}Criado: node-app/Dockerfile${NC}"

# === Dockerfile Java ===
cat <<EOF > java-app/Dockerfile
FROM openjdk:21-jdk-slim

WORKDIR /app

COPY . .

CMD ["java", "-jar", "jar-sem-slack-with-dep.jar"]
EOF

echo -e "${GREEN}Criado: java-app/Dockerfile${NC}"

# === docker-compose.yml ===
cat <<EOF > docker-compose.yml
version: '3.8'
services:
  mysql:
    container_name: mysql_container
    image: mysql:8.0
    restart: always
    env_file:
      - .env
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_PASSWORD}
      MYSQL_DATABASE: \${DB_DATABASE}
      MYSQL_USER: \${DB_USER}
      MYSQL_PASSWORD: \${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db-init:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"

  node-site:
    container_name: node_container
    env_file:
      - .env
    restart: always
    build:
        context: ./node-app
        dockerfile: Dockerfile
    ports:
      - "3333:3333"
    depends_on:
      - mysql

  java:
    container_name: java_container
    env_file:
      - .env
    build:
       context: ./java-app
       dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - mysql

volumes:
  mysql_data:
EOF

echo -e "${GREEN}Criado: docker-compose.yml${NC}"

# === Subir containers ===
echo -e "${GREEN}Removendo containers antigos, se houver...${NC}"
docker-compose down --remove-orphans

echo -e "${GREEN}Subindo containers com docker-compose...${NC}"
docker-compose up --build -d

echo -e "${GREEN}Ambiente configurado e rodando com sucesso!${NC}"
