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
            AVG(valor_operacao * (1 + juros)) AS mediaOperacoes,
            SUM(valor_operacao * (1 + (juros / 100))) AS somaCredito,
            MAX(valor_operacao * (1 + (juros / 100))) AS maximo, 
            MIN(valor_operacao * (1 + (juros / 100))) AS minimo,
        FROM historico 
            WHERE data_contratacao >= DATE_SUB('2024-11-24', INTERVAL ${periodo} MONTH) 
            AND subsetor_cnae = ${setor});
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    preencherSetores,
    exibirKpiDash
}