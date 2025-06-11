var database = require("../database/config")

function enviar(mensagem, idUsuario,idEmpresa) {
    console.log("ACESSEI O mensagens  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function enviar_mensagem()");

    var instrucaoSql = `INSERT INTO formulario (mensagem, fkFuncionario, fkEmpresa) VALUES 
        ('${mensagem}', '${idUsuario}', '${idEmpresa}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function listar(idUsuario,idEmpresa) {
    console.log("ACESSEI O mensagens  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");

    var instrucaoSql = `SELECT * FROM formulario
            WHERE fkFuncionario = ${idUsuario} AND fkEmpresa = ${idEmpresa}
            ORDER BY dt_criacao ASC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function update(idUsuario,idMensagem,mensagem) {
    console.log("ACESSEI O mensagens  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function update()");

    var instrucaoSql = `UPDATE formulario
            SET mensagem = '${mensagem}', dt_atualizacao = NOW()
            WHERE idFormulario = ${idMensagem} AND fkFuncionario = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function deletar(idMensagem, idUsuario) {
    console.log("ACESSEI O mensagens  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar()");

    var instrucaoSql = ` DELETE FROM formulario
        WHERE idFormulario = ${idMensagem} AND fkFuncionario = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}



module.exports = {
    enviar,
    listar,
    update,
    deletar
}