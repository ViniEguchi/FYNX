#!/bin/bash

echo "Iniciando configuração do ambiente..."

# Atualizar só uma vez no começo
sudo apt update

# === Instalações ===
if ! command -v java &> /dev/null; then
  read -p "Java não está instalado. Deseja instalar? [s/n]: " opt
  [ "$opt" = "s" ] && sudo apt install -y openjdk-17-jre
fi

if ! command -v docker &> /dev/null; then
  read -p "Docker não está instalado. Deseja instalar? [s/n]: " opt
  [ "$opt" = "s" ] && sudo apt install -y docker.io 
fi

if ! command -v docker-compose &> /dev/null; then
  read -p "Docker-compose não está instalado. Deseja instalar? [s/n]: " opt
  [ "$opt" = "s" ]  && sudo apt install -y docker-compose
fi

if ! command -v node &> /dev/null; then
  read -p "Node.js não está instalado. Deseja instalar? [s/n]: " opt
  [ "$opt" = "s" ] && curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs
fi

# === Estrutura do projeto ===
mkdir -p db-init node-app java-app

# .env
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

# Java App
JAVA_PORT=8080

# AWS (Exemplo de credenciais fictícias)
AWS_ACCESS_KEY_ID=AKIAXXXXX
AWS_SECRET_ACCESS_KEY=abc123secretkey
EOF
  echo "Criado: .env"
fi

# init.sql
if [ ! -f db-init/init.sql ]; then
  cat <<'EOF' > db-init/init.sql
CREATE DATABASE IF NOT EXISTS FYNX;
USE FYNX;

CREATE TABLE IF NOT EXISTS empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nome_fantasia VARCHAR(45),
    razao_social VARCHAR(45),
    representante_legal VARCHAR(45),
    cnpj CHAR(18)
);

INSERT INTO empresa VALUES
    (default, 'Empresa 1', 'Empresa 1', 'Nicolas', '51.821.2610001-03'),
    (default, 'Empresa 2', 'Empresa 2', 'Vinicius', '69.764.0760001-90'),
    (default, 'Empresa 3', 'Empresa 3', 'Guilherme', '72.397.0130001-57'),
    (default, 'Empresa 4', 'Empresa 4', 'Giovanna', '18.145.2410001-94');

CREATE TABLE IF NOT EXISTS endereco (
    idEndereco INT AUTO_INCREMENT,
    fkEmpresa INT,
    cep CHAR(9),
    logradouro VARCHAR(45),
    numero CHAR(5),
    complemento VARCHAR(45),
    
    CONSTRAINT PRIMARY KEY (idEndereco, fkEmpresa),
    CONSTRAINT fk_endereco_empresa FOREIGN KEY (fkEmpresa)
        REFERENCES empresa (idEmpresa)
);

INSERT INTO endereco VALUES
    (default, 1, '05017040', 'Rua algum lugar', '220', 'Andar 7'),
    (default, 1, '05017040', 'Rua algum lugar', '220', 'Andar 3'),
    (default, 1, '05017052', 'Rua exemplo', '1000', 'Andar 2'),
    (default, 1, '05017157', 'Rua Alto', '551', 'Andar 25');

CREATE TABLE IF NOT EXISTS funcionario (
    idFuncionario INT AUTO_INCREMENT,
    fkEmpresa INT,
    nome VARCHAR(45),
    cpf CHAR(11),
    celular CHAR(11),

    CONSTRAINT PRIMARY KEY (idFuncionario, fkEmpresa),
    CONSTRAINT fk_funcionario_empresa FOREIGN KEY (fkEmpresa)
        REFERENCES empresa(idEmpresa)
);

INSERT INTO funcionario VALUES
    (default, 1, 'Francis', '12345678912', '11912345678'),
    (default, 1, 'Nick', '12345678912', '11912345678'),
    (default, 1, 'Lucas', '12345678912', '11912345678'),
    (default, 2, 'Rodrigo', '12345678912', '11912345678'),
    (default, 2, 'Maria', '12345678912', '11912345678'),
    (default, 3, 'Roberto', '12345678912', '11912345678'),
    (default, 3, 'Caio', '12345678912', '11912345678'),
    (default, 3, 'Breno', '12345678912', '11912345678'),
    (default, 4, 'Vitoria', '12345678912', '11912345678'),
    (default, 4, 'Marcela', '12345678912', '11912345678'),
    (default, 4, 'Thiago', '12345678912', '11912345678'),
    (default, 4, 'Shirley', '12345678912', '11912345678');

CREATE TABLE IF NOT EXISTS login (
    idLogin INT AUTO_INCREMENT,
    fkFuncionario INT,
    fkEmpresa INT,
    gerente BOOLEAN,
    email VARCHAR(100),
    senha VARCHAR(50),

    CONSTRAINT PRIMARY KEY (idLogin),
    CONSTRAINT fk_login_funcionario FOREIGN KEY (fkFuncionario, fkEmpresa)
        REFERENCES funcionario(idFuncionario, fkEmpresa)
);

INSERT INTO login VALUES
    (default, 1, 1, true, 'Francis@email.com', 'Abc1234@'),
    (default, 2, 1, false, 'Nick@email.com', 'Abc1234@'),
    (default, 3, 1, false, 'guilherme-lira@outlook.com.br', 'Gui@2030'),
    (default, 4, 2, false, 'Rodrigo@email.com', 'Abc1234@'),
    (default, 5, 2, true, 'Maria@email.com', 'Abc1234@'),
    (default, 6, 3, false, 'Roberto@email.com', 'Abc1234@'),
    (default, 7, 3, false, 'Caio@email.com', 'Abc1234@'),
    (default, 8, 3, true, 'Breno@email.com', 'Abc1234@'),
    (default, 9, 4, true, 'Vitoria@email.com', 'Abc1234@'),
    (default, 10, 4, false, 'Marcela@email.com', 'Abc1234@'),
    (default, 11, 4, false, 'Thiago@email.com', 'Abc1234@'),
    (default, 12, 4, true, 'Shirley@email.com', 'Abc1234@');

CREATE TABLE IF NOT EXISTS log (
    idLog INT PRIMARY KEY AUTO_INCREMENT,
    data_hora_inicio DATETIME,
    data_hora_fim DATETIME,
    descricao VARCHAR(100),
    status_log BOOLEAN,
    erro VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_contratacao DATE,
    valor_operacao DOUBLE,
    valor_desenbolsado DOUBLE,
    fonte_recurso VARCHAR(50),
    custo_financeiro VARCHAR(50),
    juros FLOAT,
    prazo_carencia INT,
    prazo_amortizacao INT,
    produto VARCHAR(50),
    setor_cnae VARCHAR(50),
    subsetor_cnae VARCHAR(50),
    cnae CHAR(7),
    situacao_operacao VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS formulario (
    idFormulario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    email VARCHAR(50),
    mensagem VARCHAR(300)
);

EOF
  echo "Criado: db-init/init.sql"
fi

# Dockerfile
if [ ! -f node-app/Dockerfile ]; then
  cat <<EOF > node-app/Dockerfile
FROM node:18

RUN git clone https://github.com/ViniEguchi/FYNX.git

WORKDIR /FYNX/Web-Data-Viz

RUN npm install

EXPOSE 3333

CMD ["npm", "start"]
EOF
  echo "Criado: node-app/Dockerfile"
fi

# === Dockerfile Java ===
if [ ! -f java-app/Dockerfile ]; then
cat <<EOF > java-app/Dockerfile
FROM openjdk:21-jdk-slim

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/ViniEguchi/FYNX.git

WORKDIR /FYNX/log

EXPOSE 8080

CMD ["java", "-jar", "Backend-java-1.0-SNAPSHOT-jar-with-dependencies.jar"]
EOF
echo "Criado: java-app/log/Dockerfile"
fi

# === docker-compose.yml ===
if [ ! -f docker-compose.yml ]; then
cat <<EOF > docker-compose.yml
version: '3.8'
services:
  mysql:
    container_name: mysql_container
    image: mysql:5.7
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
    build: ./node-app
    ports:
      - "3333:3333"
    depends_on:
      - mysql

  java:
    container_name: java_container  
    env_file:
      - .env
    restart: always
    build: ./java-app
    ports:
      - "8080:8080"
    depends_on:
      - mysql

volumes:
  mysql_data:
EOF
echo "Criado: docker-compose.yml"
fi

# === Iniciar containers ===
echo "Subindo containers com docker-compose..."
docker-compose up -d

echo "Ambiente configurado com sucesso!"
