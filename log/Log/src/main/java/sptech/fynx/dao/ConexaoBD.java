package sptech.fynx.dao;

import javax.sql.DataSource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


public class ConexaoBD {

    //DataSource --> interface pro H2 --> como vai se conctar com o banco atraves de um driver
    private DataSource conexaoBD;

    public ConexaoBD() {

        // DriverManagerDataSource --> vai ensinar o jdbc como se conectar com o banco
        DriverManagerDataSource driver = new DriverManagerDataSource();

        driver.setUsername("sa");
        driver.setPassword("");
        driver.setUrl("jdbc:h2:file:./banco-de-dados");
        driver.setDriverClassName("org.h2.Driver");

        this.conexaoBD = driver;
    }

    public DataSource getConexaoBD(){
        return this.conexaoBD;
    }
}

