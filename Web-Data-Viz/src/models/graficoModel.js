var database = require("../database/config")

function preencherSetores(nome, email, mensagem) {
    console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarPorId()");

    var instrucaoSql = `SELECT DISTINCT subsetor_cnae FROM historico;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    preencherSetores
}