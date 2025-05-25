var database = require("../database/config")

function preencherSetores() {
    console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarPorId()");

    var instrucaoSql = `SELECT DISTINCT subsetor_cnae FROM historico;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function exibirKpiDash(periodo, setor) {
    var instrucaoSql = `
        SELECT
        (SELECT AVG(valor_operacao * (1 + juros)) FROM historico WHERE data_contratacao >= DATE_SUB('2024-11-24', INTERVAL ${periodo} MONTH) AND WHERE subsetor_cnae = ${setor}) AS mediaOperacoes,
        (SELECT SUM(valor_operacao * (1 + (juros / 100))) FROM historico WHERE data_contratacao >= DATE_SUB('2024-11-24', INTERVAL ${periodo} MONTH) AND WHERE subsetor_cnae = ${setor}) AS somaCredito,
        (SELECT * FROM historico WHERE data_contratacao >= DATE_SUB('2024-11-24', INTERVAL ${periodo} MONTH) AND WHERE subsetor_cnae = ${setor}) AS variacaoCredito,
        FROM historico;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    preencherSetores,
    exibirKpiDash
}