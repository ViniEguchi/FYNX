package sptech.fynx.dao;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class ConexaoBD {

    private DataSource conexaoBD;

    public ConexaoBD() {
        // Cria uma nova instância de DriverManagerDataSource (classe que configura o banco de dados)

        DriverManagerDataSource driver = new DriverManagerDataSource();

        String host = "localhost";  // Host fixo
        String port = System.getenv("DB_PORT");
        String database = System.getenv("DB_DATABASE");
        String user = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");

        if (host == null || port == null || database == null || user == null || password == null) {
            throw new IllegalArgumentException("Alguma variável de ambiente do banco de dados não está definida");
        }

        // Monta a URL de conexão com o banco de dados MySQL usando as variáveis

        //allowPublicKeyRetrieval=true
        // characterEncoding=UTF-8 - Define o conjunto de caracteres para UTF-8.
        String url = String.format(
                "jdbc:mysql://%s:%s/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8",
                host, port, database
        );

        driver.setUrl(url);
        driver.setUsername(user);
        driver.setPassword(password);

        // Define o driver JDBC do MySQL que será usado para conexão
        driver.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // Atribui a fonte de dados configurada ao atributo da classe
        this.conexaoBD = driver;
    }

    //DataSource: o getter vai retornar a conexão a partir da classe DataSource
    public DataSource getConexaoBD() {
        return this.conexaoBD;
    }
}
