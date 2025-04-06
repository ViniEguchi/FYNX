var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idLogin, gerente, email, fkEmpresa as empresaId, fkFuncionario as funcionarioID FROM login WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(fkEmpresa, nome, cpf, celular) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", fkEmpresa, nome, cpf, celular);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO funcionario (nome, fkEmpresa, cpf, celular)
        VALUES ('${nome}', ${fkEmpresa}, '${cpf}', '${celular}');
    `;
    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarLogin(idFuncionario, idEmpresa, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarLogin():", idFuncionario, idEmpresa, email, senha);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO login (fkFuncionario, fkEmpresa, gerente, email, senha)
            VALUES (${idFuncionario}, ${idEmpresa}, true, '${email}', '${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function carregarPerfil(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function carregarPerfil(): ", idUsuario)
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

async function atualizar(idUsuario, nome, cpf, celular, email, senha, nome_fantasia, razao_social, representante_legal, cnpj, cep, logradouro, numero, complemento) {
    console.log("ACESSEI O USUARIO MODEL - atualizar()");

    const atualizarFuncionario = `UPDATE funcionario SET nome = '${nome}', cpf = '${cpf}', celular = '${celular}' WHERE idFuncionario = ${idUsuario};`;
    const atualizarLogin = `UPDATE login SET email = '${email}', senha = '${senha}' WHERE fkFuncionario = ${idUsuario};`;
    const atualizarEmpresa = `UPDATE empresa SET nome_fantasia = '${nome_fantasia}', razao_social = '${razao_social}', representante_legal = '${representante_legal}', cnpj = '${cnpj}' WHERE idEmpresa = (SELECT fkEmpresa FROM funcionario WHERE idFuncionario = ${idUsuario});`;
    const atualizarEndereco = `UPDATE endereco SET cep = '${cep}', logradouro = '${logradouro}', numero = '${numero}', complemento = '${complemento}' WHERE fkEmpresa = (SELECT fkEmpresa FROM funcionario WHERE idFuncionario = ${idUsuario});`;

    console.log("Executando instruções SQL de atualização...");

    await database.executar(atualizarFuncionario);
    await database.executar(atualizarLogin);
    await database.executar(atualizarEmpresa);
    return database.executar(atualizarEndereco);
}



module.exports = {
    autenticar,
    cadastrar,
    cadastrarLogin,
    carregarPerfil,
    atualizar,
};