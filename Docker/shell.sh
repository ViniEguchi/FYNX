  GNU nano 7.2                                                                    shell.sh                                                                              if [ "$continuar" == "s" ]; then

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
  sudo docker run -d --name mysql --network meu-projeto-net -p 3306:3306 minha-image-banco

  # Builda e executa o container Java

  sudo docker build -f Dockerfile.java -t java-app .
  sudo docker run -d \
    --name java-app \
    --network meu-projeto-net \
    --env-file .env \
    java-app

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
