package dao;

import org.springframework.jdbc.core.JdbcTemplate;

public class Main {
    public static void main(String[] args) {

        ConexaoBD conexaoBD = new ConexaoBD();

        JdbcTemplate template = new JdbcTemplate(conexaoBD.getConexaoBD());

        //void --> executa a querry
        template.execute("DROP TABLE IF EXISTS funcionario;\n");
        template.execute("DROP TABLE IF EXISTS endereco;\n");
        template.execute("DROP TABLE IF EXISTS empresa;\n");

        template.execute("CREATE TABLE IF NOT EXISTS empresa (\n" +
                "    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,\n" +
                "    nome_fantasia VARCHAR(45),\n" +
                "    razao_social VARCHAR(45),\n" +
                "    representante_legal VARCHAR(45),\n" +
                "    cnpj CHAR(18)\n" +
                ");");


        template.execute("CREATE TABLE IF NOT EXISTS endereco (\n" +
                "    idEndereco INT AUTO_INCREMENT PRIMARY KEY,\n" +
                "    fkEmpresa INT,\n" +
                "    cep CHAR(9),\n" +
                "    logradouro VARCHAR(45),\n" +
                "    numero CHAR(5),\n" +
                "    complemento VARCHAR(45),\n" +
                "\n" +
                "    CONSTRAINT fk_endereco_empresa FOREIGN KEY (fkEmpresa)\n" +
                "        REFERENCES empresa (idEmpresa)\n" +
                ");\n");


        template.execute("CREATE TABLE IF NOT EXISTS funcionario (\n" +
                "    idFuncionario INT AUTO_INCREMENT PRIMARY KEY,\n" +
                "    fkEmpresa INT,\n" +
                "    nome VARCHAR(45),\n" +
                "    cpf CHAR(11),\n" +
                "    celular CHAR(11),\n" +
                "\n" +
                "    CONSTRAINT fk_funcionario_empresa\n" +
                "    FOREIGN KEY (fkEmpresa)\n" +
                "        REFERENCES empresa(idEmpresa)\n" +
                ");\n");


        template.execute("CREATE TABLE IF NOT EXISTS login (\n" +
                "    idLogin INT AUTO_INCREMENT,\n" +
                "    fkFuncionario INT,\n" +
                "    fkEmpresa INT,\n" +
                "    gerente BOOLEAN,\n" +
                "    email VARCHAR(100),\n" +
                "    senha VARCHAR(50),\n" +
                "\n" +
                "    PRIMARY KEY (idLogin, fkFuncionario, fkEmpresa),\n" +
                "\n" +
                "    CONSTRAINT fk_login_funcionario\n" +
                "    FOREIGN KEY (fkFuncionario)\n" +
                "        REFERENCES funcionario(idFuncionario),\n" +
                "\n" +
                "    CONSTRAINT fk_login_empresa\n" +
                "    FOREIGN KEY (fkEmpresa)\n" +
                "        REFERENCES empresa(idEmpresa)\n" +
                ");\n");

    }
}
