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

function totalOperacoes() {
    console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function totalOperacoes()");

    var instrucaoSql = `
        SELECT 
            setor_cnae, 
            SUM(valor_operacao) AS total_valor
        FROM 
            historico
        WHERE 
            YEAR(data_contratacao) >= 2014
            AND MONTH(data_contratacao) >= 1 AND MONTH(data_contratacao) <= 12
        GROUP BY 
            setor_cnae
        ORDER BY 
            total_valor DESC
        LIMIT 3;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function jurosMedioSetor() {
    console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function totalOperacoes()");

    var instrucaoSql = `
        SELECT setor_cnae, ROUND(AVG(juros), 2) AS media
        FROM historico
        WHERE 
        YEAR(data_contratacao) >= 2014
        AND MONTH(data_contratacao) >= 1 AND MONTH(data_contratacao) <= 6
        GROUP BY setor_cnae
        LIMIT 3;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function prazoAmortizacaoMes() {
    console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function totalOperacoes()");

    var instrucaoSql = `
        WITH medias AS (
        SELECT
            YEAR(h.data_contratacao) AS ano,
            MONTH(h.data_contratacao) AS mes,
            h.setor_cnae,
            ROUND(AVG(h.prazo_amortizacao), 2) AS media_prazo,
            RANK() OVER (
                PARTITION BY YEAR(h.data_contratacao), MONTH(h.data_contratacao)
                ORDER BY AVG(h.prazo_amortizacao) DESC
            ) AS ranking
        FROM
            historico h
        WHERE 
        YEAR(data_contratacao) >= 2014
        AND MONTH(data_contratacao) >= 1 AND MONTH(data_contratacao) <= 6
        GROUP BY
            YEAR(h.data_contratacao),
            MONTH(h.data_contratacao),
            h.setor_cnae
            limit 12
        )
        SELECT ano, mes, setor_cnae, media_prazo
        FROM medias
        WHERE ranking <= 3
        ORDER BY ano, mes, media_prazo DESC;

    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

function valorOperacoesMes() {
    console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function totalOperacoes()");

    var instrucaoSql = `
            WITH setores_top4 AS (
            SELECT
                setor_cnae
            FROM
                historico
            GROUP BY
                setor_cnae
            ORDER BY
                COUNT(*) DESC
            LIMIT 4
        ),
        media_setores AS (
            SELECT
                YEAR(h.data_contratacao) AS ano,
                MONTH(h.data_contratacao) AS mes,
                h.setor_cnae,
                AVG(h.valor_operacao) AS media_valor_operacao
            FROM
                historico h
            INNER JOIN setores_top4 s ON h.setor_cnae = s.setor_cnae
        WHERE 
        YEAR(data_contratacao) >= 2014
        AND MONTH(data_contratacao) >= 1 AND MONTH(data_contratacao) <= 12
            GROUP BY
                YEAR(h.data_contratacao),
                MONTH(h.data_contratacao),
                h.setor_cnae
        )
        SELECT
            ano,
            mes,
            setor_cnae,
            media_valor_operacao
        FROM
            media_setores
        ORDER BY
            ano,
            mes,
            setor_cnae;


    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}
module.exports = {
    preencherSetores,
    totalOperacoes,
    jurosMedioSetor,
    prazoAmortizacaoMes,
    valorOperacoesMes,
    exibirKpiDash
}