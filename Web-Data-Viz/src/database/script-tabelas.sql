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
	(default, "Empresa 1", "Empresa 1", "Nicolas", "51.821.261/0001-03"),
	(default, "Empresa 2", "Empresa 2", "Vinicius", "69.764.076/0001-90"),
	(default, "Empresa 3", "Empresa 3", "Guilherme", "72.397.013/0001-57"),
	(default, "Empresa 4", "Empresa 4", "Giovanna", "18.145.241/0001-94");

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

INSERT INTO endereco VALUES
	(default, 1, "05017040", "Rua algum lugar", "220", "Andar 7"),
	(default, 1, "05017040", "Rua algum lugar", "220", "Andar 3"),
	(default, 1, "05017052", "Rua exemplo", "1000", "Andar 2"),
	(default, 1, "05017157", "Rua Alto", "551", "Andar 25");

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

INSERT INTO funcionario VALUES
	(default, 1, "Francis", "12345678912", "11912345678"),
	(default, 1, "Nick", "12345678912", "11912345678"),
	(default, 1, "Lucas", "12345678912", "11912345678"),
	(default, 2, "Rodrigo", "12345678912", "11912345678"),
	(default, 2, "Maria", "12345678912", "11912345678"),
	(default, 3, "Roberto", "12345678912", "11912345678"),
	(default, 3, "Caio", "12345678912", "11912345678"),
	(default, 3, "Breno", "12345678912", "11912345678"),
	(default, 4, "Vitoria", "12345678912", "11912345678"),
	(default, 4, "Marcela", "12345678912", "11912345678"),
	(default, 4, "Thiago", "12345678912", "11912345678"),
	(default, 4, "Shirley", "12345678912", "11912345678");

CREATE TABLE IF NOT EXISTS login (
	idLogin INT AUTO_INCREMENT,
	fkFuncionario INT,
	fkEmpresa INT,
	gerente BOOLEAN DEFAULT TRUE,
	email VARCHAR(100),
	senha VARCHAR(50),

	CONSTRAINT PRIMARY KEY (idLogin, fkFuncionario, fkEmpresa),

	CONSTRAINT fk_login_funcionario
	FOREIGN KEY (fkFuncionario)
		REFERENCES funcionario(idFuncionario)
);

INSERT INTO login VALUES
	(default, 1, 1, true, "Francis@email.com", "Abc1234@"),
	(default, 2, 1, false, "Nick@email.com", "Abc1234@"),
	(default, 3, 1, false, "Lucas@email.com", "Abc1234@"),
	(default, 4, 2, false, "Rodrigo@email.com", "Abc1234@"),
	(default, 5, 2, true, "Maria@email.com", "Abc1234@"),
	(default, 6, 3, false, "Roberto@email.com", "Abc1234@"),
	(default, 7, 3, false, "Caio@email.com", "Abc1234@"),
	(default, 8, 3, true, "Breno@email.com", "Abc1234@"),
	(default, 9, 4, true, "Vitoria@email.com", "Abc1234@"),
	(default, 10, 4, false, "Marcela@email.com", "Abc1234@"),
	(default, 11, 4, false, "Thiago@email.com", "Abc1234@"),
	(default, 12, 4, true, "Shirley@email.com", "Abc1234@");

CREATE TABLE IF NOT EXISTS log (
	idLog INT PRIMARY KEY AUTO_INCREMENT,
	data_hora_inicio DATETIME,
	data_hora_fim DATETIME,
	descricao VARCHAR(100),
	status_log BOOLEAN,
	erro VARCHAR(50)
);

ALTER TABLE log MODIFY erro VARCHAR(250);

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
	mensagem VARCHAR(300),
	dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
	dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	fkFuncionario INT,
	fkEmpresa INT,

	CONSTRAINT fk_formulario_funcionario
	FOREIGN KEY (fkFuncionario)
		REFERENCES funcionario(idFuncionario),
	CONSTRAINT fk_formulario_empresa
	FOREIGN KEY (fkEmpresa)
		REFERENCES empresa(idEmpresa)
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