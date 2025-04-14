var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idLogin, gerente, email, fkEmpresa as empresaId, fkFuncionario as funcionarioID FROM login WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function verificarDadosExistentes(email, celular, cpf) {
    const instrucaoSql = `
        SELECT * FROM login l
        JOIN funcionario f ON l.fkFuncionario = f.idFuncionario
        WHERE l.email = '${email}'
           OR f.celular = '${celular}'
           OR f.cpf = '${cpf}';
    `;
    return database.executar(instrucaoSql);
}

async function cadastrar(idEmpresa, nome, cpf, celular, email, senha, gerente) {
    console.log("ACESSEI O FUNCIONARIO MODEL\nFunção cadastrar():", idEmpresa, email, senha);

    const inserirFuncionario = `
        INSERT INTO funcionario (nome, cpf, celular, fkEmpresa)
        VALUES ('${nome}', '${cpf}', '${celular}', ${idEmpresa});
    `;

    console.log("Executando a instrução SQL:\n" + inserirFuncionario);

    const resultadoFuncionario = await database.executar(inserirFuncionario);
    const idFuncionarioInserido = resultadoFuncionario.insertId;

    const inserirLogin = `
        INSERT INTO login (email, senha, gerente, fkFuncionario, fkEmpresa)
        VALUES ('${email}', '${senha}', '${gerente}', ${idFuncionarioInserido}, ${idEmpresa});
    `;

    console.log("Executando a instrução SQL:\n" + inserirLogin);

    return database.executar(inserirLogin);
}

function cadastrarLogin(idFuncionario, idEmpresa, email, senha) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarLogin():", idFuncionario, idEmpresa, email, senha);
    var instrucaoSql = `
        INSERT INTO login (fkFuncionario, fkEmpresa, gerente, email, senha)
            VALUES (${idFuncionario}, ${idEmpresa}, true, '${email}', '${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function carregarPerfil(idUsuario) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function carregarPerfil(): ", idUsuario)
    var instrucaoSql = `
        SELECT f.fkEmpresa,f.nome, f.cpf, f.celular, l.gerente, l.email, l.senha
        FROM funcionario as f
        JOIN login as l
        ON f.idFuncionario = l.fkFuncionario
        WHERE idFuncionario = ${idUsuario};    
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarFuncionarios(idEmpresa) {
    console.log("ACESSEI O FUNCIONARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function carregarPerfil(): ", idEmpresa)
    var instrucaoSql = `
        SELECT f.idFuncionario, l.idLogin, f.fkEmpresa,f.nome, f.cpf, f.celular, l.gerente, l.email, l.senha
        FROM funcionario as f
        JOIN login as l
        ON f.idFuncionario = l.fkFuncionario
        WHERE f.fkEmpresa = ${idEmpresa};     
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function atualizar(idUsuario, nome, cpf, celular, email, senha, gerente) {
    console.log("ACESSEI O FUNCIONARIO MODEL - atualizar()");

    const atualizarFuncionario = `UPDATE funcionario SET nome = '${nome}', cpf = '${cpf}', celular = '${celular}' WHERE idFuncionario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + atualizarFuncionario);
    const atualizarLogin = `UPDATE login SET email = '${email}', senha = '${senha}', gerente = ${gerente} WHERE fkFuncionario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + atualizarLogin);
   
    await database.executar(atualizarFuncionario);
    return database.executar(atualizarLogin);
}

async function deletarFuncionario(idFuncionario) {
    console.log("ACESSEI O FUNCIONARIO MODEL - deletarFuncionario()");

    const deletarLogin = `
        DELETE FROM login WHERE fkFuncionario = ${idFuncionario};
    `;
    console.log("Executando a instrução SQL: \n" + deletarLogin);
    await database.executar(deletarLogin);

    const deletarFuncionario = `
        DELETE FROM funcionario WHERE idFuncionario = ${idFuncionario};
    `;
    console.log("Executando a instrução SQL: \n" + deletarFuncionario);
    return database.executar(deletarFuncionario);
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarLogin,
    carregarPerfil,
    atualizar,
    listarFuncionarios,
    deletarFuncionario,
    verificarDadosExistentes
};