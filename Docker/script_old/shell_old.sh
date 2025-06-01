#!/bin/bash

# Verifica se o Java está instalado
java -version
if [ $? = 0 ]; then
  echo "Java está instalado"
else
  echo "Java não está instalado"
  echo "Gostaria de instalar o Java? [s/n]"
  read get
  if [ "$get" == "s" ]; then
    sudo apt install openjdk-17-jre -y
  fi
fi

# Verifica se o Docker está instalado
docker --version
if [ $? = 0 ]; then
  echo "Docker está instalado"
else
  echo "Docker não está instalado"
  echo "Gostaria de instalar o Docker? [s/n]"
  read get
  if [ "$get" == "s" ]; then
    sudo apt install docker.io -y
    sudo usermod -aG docker $USER
    echo "Usuário adicionado ao grupo 'docker'. É necessário reiniciar a sessão para usar Docker sem sudo."
  fi
fi

# Espera confirmação para continuar com os containers
echo "Deseja iniciar os containers do projeto agora? [s/n]"
read continuar

if [ "$continuar" == "s" ]; then

  echo "Iniciando containers..."

  # Carrega as variáveis do .env
  set -a
  source .env
  set +a

  # Cria a rede Docker (ignora erro se já existir)
  sudo docker network create meu-projeto-net || true

  #Builda  o container mysql
  sudo docker build -t minha-image-banco -f dockerMySql .

  # Inicia o container do MySQL
  sudo docker run -d \
  --name mysql \
  --env-file .env \
  --network meu-projeto-net \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  minha-image-banco


  # Builda e executa o container Java

#  sudo docker build -f Dockerfile.java -t java-app .
#  sudo docker run -d \
#    --name java-app \
#    --network meu-projeto-net \
#   --env-file .env \
#    java-app

  # Builda e executa o container do site
  sudo docker build -t minha-image-site -f dockerNode .

  sudo docker run -d \
    --name site \
    --network meu-projeto-net \
    --env-file .env \
    -p 3333:3333 \
     minha-image-site

  echo "Todos os containers foram iniciados com sucesso!"
fi
