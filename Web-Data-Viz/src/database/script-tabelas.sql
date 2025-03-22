CREATE DATABASE IF NOT EXISTS FYNX;

USE FYNX;

CREATE TABLE IF NOT EXISTS empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nome_fantasia VARCHAR(45),
    razao_social VARCHAR(45),
    representante_legal VARCHAR(45),
    cnpj CHAR(18)
);

CREATE TABLE IF NOT EXISTS endereco (
    idEndereco INT AUTO_INCREMENT,
    fkEmpresa INT,
    cep CHAR(9),
    logradouro VARCHAR(45),
    numero CHAR(5),
    complemento VARCHAR(45),
    
    CONSTRAINT PRIMARY KEY (idEndereco , fkEmpresa),
    
    CONSTRAINT fk_endereco_empresa FOREIGN KEY (fkEmpresa)
        REFERENCES empresa (idEmpresa)
);

CREATE TABLE IF NOT EXISTS funcionario (
	idFuncionario INT AUTO_INCREMENT,
	fkEmpresa INT,
	nome VARCHAR(45),
	cpf CHAR(11),
	celular CHAR(11),

	CONSTRAINT PRIMARY KEY (idFuncionario, fkEmpresa),

	CONSTRAINT fk_funcionario_empresa
	FOREIGN KEY (fkEmpresa)
		REFERENCES empresa(idEmpresa)
);

CREATE TABLE IF NOT EXISTS login (
	idLogin INT AUTO_INCREMENT,
	fkFuncionario INT,
	fkEmpresa INT,
	gerente BOOLEAN,
	email VARCHAR(100),
	senha VARCHAR(50),

	CONSTRAINT PRIMARY KEY (idLogin, fkFuncionario, fkEmpresa),

	CONSTRAINT fk_login_funcionario
	FOREIGN KEY (fkFuncionario)
		REFERENCES funcionario(idFuncionario)
);