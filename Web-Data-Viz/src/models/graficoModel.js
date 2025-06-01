var database = require("../database/config");

const { format } = require('date-fns');
// Função para montar datas no formato 'YYYY-MM-DD'
function montarIntervalo(ano, mesInicial, mesFinal) {
    const dataInicial = new Date(ano, mesInicial - 1, 1);
    const dataFinal = new Date(ano, mesFinal, 0); // último dia do mês final

    const dataInicialStr = format(dataInicial, 'yyyy-MM-dd');  // Usando date-fns para formatar
    const dataFinalStr = format(dataFinal, 'yyyy-MM-dd');

    return { dataInicialStr, dataFinalStr };
}

function preencherSetores() {
    const instrucaoSql = `SELECT DISTINCT subsetor_cnae FROM historico;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function exibirKpiDash(ano, mesInicial, mesFinal, setor) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        SELECT 
            ROUND(AVG(valor_operacao * (1 + (juros / 100))),2) AS mediaOperacoes,
            ROUND(SUM(valor_operacao * (1 + (juros / 100))),2) AS somaCredito,
            ROUND(MAX(valor_operacao * (1 + (juros / 100))),2) AS maximo, 
            ROUND(MIN(valor_operacao * (1 + (juros / 100))),2) AS minimo
        FROM historico 
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        AND subsetor_cnae = '${setor}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function totalOperacoes(ano, mesInicial, mesFinal) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        SELECT 
            setor_cnae, 
            SUM(valor_operacao) AS total_valor
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        GROUP BY setor_cnae
        ORDER BY total_valor DESC
        LIMIT 3;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function jurosMedioSetor(ano, mesInicial, mesFinal) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        SELECT setor_cnae, ROUND(AVG(juros), 2) AS media
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        GROUP BY setor_cnae
        LIMIT 3;
    `;

    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function prazoAmortizacaoMes(ano, mesInicial, mesFinal) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
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
            FROM historico h
            WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
            GROUP BY YEAR(h.data_contratacao), MONTH(h.data_contratacao), h.setor_cnae
            LIMIT 12
        )
        SELECT ano, mes, setor_cnae, media_prazo
        FROM medias
        WHERE ranking <= 3
        ORDER BY ano, mes, media_prazo DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function valorOperacoesMes(ano, mesInicial, mesFinal) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        WITH setores_top4 AS (
            SELECT setor_cnae
            FROM historico
            GROUP BY setor_cnae
            ORDER BY COUNT(*) DESC
            LIMIT 4
        ),
        media_setores AS (
            SELECT
                YEAR(h.data_contratacao) AS ano,
                MONTH(h.data_contratacao) AS mes,
                h.setor_cnae,
                AVG(h.valor_operacao) AS media_valor_operacao
            FROM historico h
            INNER JOIN setores_top4 s ON h.setor_cnae = s.setor_cnae
            WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
            GROUP BY YEAR(h.data_contratacao), MONTH(h.data_contratacao), h.setor_cnae
        )
        SELECT ano, mes, setor_cnae, media_valor_operacao
        FROM media_setores
        ORDER BY ano, mes, setor_cnae;
<<<<<<< HEAD
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function valorMedioOperacoesMes(ano, mesInicial, mesFinal, sub_setor) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        SELECT 
            YEAR(data_contratacao) AS ano,
            MONTH(data_contratacao) AS mes,
            ROUND(SUM(valor_operacao), 2) AS total_mes,
            ROUND(AVG(valor_operacao), 2) AS media_valores_mes
        FROM 
            historico
        WHERE 
            subsetor_cnae = '${sub_setor}'
            AND data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        GROUP BY 
            YEAR(data_contratacao), MONTH(data_contratacao)
        ORDER BY 
            mes;

<<<<<<< HEAD
=======
=======
>>>>>>> main
>>>>>>> homolog
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function creditoConcedido(ano, mesInicial, mesFinal, sub_setor) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        SELECT
            YEAR(data_contratacao) AS ano,
            MONTH(data_contratacao) AS mes,
            ROUND(SUM(valor_desenbolsado), 2) AS total_mes
        FROM
            historico
        WHERE
            subsetor_cnae = '${sub_setor}'
            AND data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        GROUP BY
            YEAR(data_contratacao),
            MONTH(data_contratacao)
        ORDER BY
            mes;

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
    exibirKpiDash,
    valorMedioOperacoesMes,
    creditoConcedido
}
