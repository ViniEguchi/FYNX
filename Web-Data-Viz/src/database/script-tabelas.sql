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

CREATE TABLE IF NOT EXISTS log (
	idLog INT PRIMARY KEY AUTO_INCREMENT,
	data_hora_inico DATETIME,
	data_hora_fim DATETIME,
	nome VARCHAR(50),
	status_log BOOLEAN,
	erro VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS dados (
	idDados INT PRIMARY KEY AUTO_INCREMENT,
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
	email_representante VARCHAR(45),
	tel_representate CHAR(11),
	mensagem VARCHAR(300)
);

/*
	SINTAXES

ADICIONAR COLUNA EM UMA TABELA
	ALTER TABLE <tabela>
	ADD <coluna> <tipo do dado>;

DELETAR UMA COLUNA
	ALTER TABLE <tabela>
	DROP COLUMN <coluna>;

ALTERAR O NOME DE UMA COLUNA
	ALTER TABLE <tabela>
	RENAME COLUMN <nome antigo> to <nome novo>;

ALTERAR O TIPO DE UMA COLUNA
	ALTER TABLE <tabela>
	MODIFY COLUMN <coluna> <tipo do dado>;

ADIÇÃO DE CHECK
	ALTER TABLE <tabela>
	ADD CONSTRAINT <nome check> CHECK (Age>=18 AND City='Sandnes');

ADIÇÃO DE FOREING KEY
	ALTER TABLE <tabela>
	ADD CONSTRAINT <nome foreing key>
	FOREIGN KEY (<foreing key>) REFERENCES <Tabela referencia>(<id Referencia>);

CRIAR USUÁRIO E CONSEDER PRIVILÉGIOS
	CREATE USER 'novo_usuário'@'localhost' IDENTIFIED BY 'senha';

	GRANT ALL PRIVILEGES ON <Base de Dados> . <Tabela> TO 'novo_usuario'@'localhost';
		- É possivel substituir ALL PRIVILEGES pelo tipo especifico de privilégio (CREATE, SELECT, etc)
		- No campo de <Base de Dados> e <Tabela> é possivel usar "*" para todas bases ou tabelas

	FLUSH PRIVILEGES;

RETIRAR PRIVILÉGIOS DE UM USUÁRIO
	REVOKE ALL PRIVILEGES ON nome_do_banco_de_dados.nome_da_tabela FROM 'nome_do_usuário'@'localhost';

EXCLUIR UM USUÁRIO
	DROP USER 'nome_do_usuário'@'localhost';
*/