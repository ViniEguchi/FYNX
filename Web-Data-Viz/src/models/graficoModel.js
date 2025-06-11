var database = require("../database/config");

/*
HOME Prazo mais aceito
SELECT  COUNT(*)                 AS contagem
       ,MONTH(prazo_carencia)    AS carencia
       ,MONTH(prazo_amortizacao) AS amortizacao
FROM historico
GROUP BY  carencia
         ,amortizacao
ORDER BY  contagem DESC

HOME Onde investir
SELECT

HOME Evolução setor
SELECT
*/

const { format } = require('date-fns');
// Função para montar datas no formato 'YYYY-MM-DD'
function montarIntervalo(ano, mesInicial, mesFinal) {
    const dataInicial = new Date(ano, mesInicial - 1, 1);
    const dataFinal = new Date(ano, mesFinal, 0); // último dia do mês final

    const dataInicialStr = format(dataInicial, 'yyyy-MM-dd');  // Usando date-fns para formatar
    const dataFinalStr = format(dataFinal, 'yyyy-MM-dd');

    return { dataInicialStr, dataFinalStr };
}

function montarDataPassado(ano, mesInicial, mesFinal) {
    ano = ano - 1;
    const dataInicial = new Date(ano, mesInicial - 1, 1);
    const dataFinal = new Date(ano, mesFinal, 0); // último dia do mês final

    const dataInicialStrPassado = format(dataInicial, 'yyyy-MM-dd');  // Usando date-fns para formatar
    const dataFinalStrPassado = format(dataFinal, 'yyyy-MM-dd');

    return { dataInicialStrPassado, dataFinalStrPassado };
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
                mesMais.mes AS mes,
                maximo.juros_max AS maximo,
                minimo.juros_min AS minimo,
                prazo.carencia_max AS carencia_max,
                prazo.carencia_min AS carencia_min,
                ROUND(media_prazos.carencia_media, 2) AS carencia_media,
                ROUND(media_prazos.amortizacao_media, 2) AS amortizacao_media,
                ROUND(media_prazos.carencia_media + media_prazos.amortizacao_media, 2) AS prazo_total_medio,
                ROUND(((maximo.juros_max - minimo.juros_min) / minimo.juros_min) * 100, 2) AS variacao_juros_percentual
            FROM (
                SELECT  
                    MONTH(data_contratacao) AS mes,
                    COUNT(*) AS todo
                FROM historico
                WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
                AND subsetor_cnae = '${setor}'
                GROUP BY mes
                ORDER BY todo DESC
                LIMIT 1
            ) AS mesMais
            JOIN (
                SELECT juros AS juros_max
                FROM historico
                WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
                AND subsetor_cnae = '${setor}'
                ORDER BY data_contratacao DESC
                LIMIT 1
            ) AS maximo
            JOIN (
                SELECT juros AS juros_min
                FROM historico
                WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
                AND subsetor_cnae = '${setor}'
                ORDER BY data_contratacao
                LIMIT 1
            ) AS minimo
            JOIN (
                SELECT 
                    MAX(prazo_carencia) AS carencia_max,
                    MIN(prazo_carencia) AS carencia_min
                FROM historico
                WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
                AND subsetor_cnae = '${setor}'
            ) AS prazo
            JOIN (
                SELECT 
                    AVG(prazo_carencia) AS carencia_media,
                    AVG(prazo_amortizacao) AS amortizacao_media
                FROM historico
                WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
                AND subsetor_cnae = '${setor}'
            ) AS media_prazos;

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
                AVG(h.valor_desenbolsado) AS media_valor_operacao
            FROM historico h
            INNER JOIN setores_top4 s ON h.setor_cnae = s.setor_cnae
            WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
            GROUP BY YEAR(h.data_contratacao), MONTH(h.data_contratacao), h.setor_cnae
        )
        SELECT ano, mes, setor_cnae, media_valor_operacao
        FROM media_setores
        ORDER BY ano, mes, setor_cnae;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function valorMedioOperacoesMes(ano, mesInicial, mesFinal, sub_setor) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);
    const { dataInicialStrPassado, dataFinalStrPassado } = montarDataPassado(ano, mesInicial, mesFinal);
    // const instrucaoSql = `
    //     SELECT 
    //         YEAR(data_contratacao) AS ano,
    //         MONTH(data_contratacao) AS mes,
    //         ROUND(SUM(valor_operacao), 2) AS total_mes,
    //         ROUND(AVG(valor_operacao), 2) AS media_valores_mes
    //     FROM 
    //         historico
    //     WHERE 
    //         subsetor_cnae = '${sub_setor}'
    //         AND data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
    //     GROUP BY 
    //         YEAR(data_contratacao), MONTH(data_contratacao)
    //     ORDER BY 
    //         mes;

    // `;
    const instrucaoSql = `
        SELECT  ano_atual.atual     AS atual
                ,ano_passado.passado AS passado
                ,ano_atual.mes       AS mes
        FROM
        (
        	SELECT  SUM(valor_desenbolsado) AS atual
        	       ,MONTH(data_contratacao) AS mes
        	FROM historico
        	WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        	AND subsetor_cnae = '${sub_setor}'
        	GROUP BY  mes
        ) AS ano_atual
        left JOIN
        (
        	SELECT  SUM(valor_desenbolsado) AS passado
        	       ,MONTH(data_contratacao) AS mes
        	FROM historico
        	WHERE data_contratacao BETWEEN '${dataInicialStrPassado}' AND '${dataFinalStrPassado}'
        	AND subsetor_cnae = '${sub_setor}'
        	GROUP BY  mes
        ) AS ano_passado
        ON ano_atual.mes = ano_passado.mes
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function creditoConcedido(ano, mesInicial, mesFinal, sub_setor) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    // const instrucaoSql = `
    //     SELECT
    //         YEAR(data_contratacao) AS ano,
    //         MONTH(data_contratacao) AS mes,
    //         ROUND(SUM(valor_desenbolsado), 2) AS total_mes
    //     FROM
    //         historico
    //     WHERE
    //         subsetor_cnae = '${sub_setor}'
    //         AND data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
    //     GROUP BY
    //         YEAR(data_contratacao),
    //         MONTH(data_contratacao)
    //     ORDER BY
    //         mes;
    // `;
    const instrucaoSql = `
        SELECT
            mes,
            juros,
            ROUND(juros - LAG(juros) OVER (ORDER BY mes), 2) AS variacao_absoluta,
            ROUND((juros - LAG(juros) OVER (ORDER BY mes)) / LAG(juros) OVER (ORDER BY mes) * 100, 2) AS variacao_percentual
        FROM (
            SELECT
                MONTH(data_contratacao) AS mes,
                ROUND(AVG(juros), 2) AS juros
            FROM historico
            WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
            AND subsetor_cnae = '${sub_setor}'
            GROUP BY mes
        ) AS medias_mensais
        ORDER BY mes;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function exibirKpiHome(ano, mesInicial, mesFinal) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        SELECT  CONCAT(mj.setor_cnae,' - ',mj.juros) AS menor_juros
            ,mi.setor_cnae                        AS setor_menor_investimento
            ,mr.setor_cnae                        AS setor_maior_risco
            ,lr.setor_cnae                        AS setor_menor_risco
        FROM
        (
            SELECT  h.setor_cnae
                ,h.juros
            FROM historico h
            WHERE h.data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
            AND h.juros = (
            SELECT  MIN(h2.juros)
            FROM historico h2
            WHERE h2.data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}' )
            LIMIT 1
        ) AS mj, (
        SELECT  h.setor_cnae
            ,h.valor_desenbolsado
        FROM historico h
        WHERE h.data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        AND h.valor_desenbolsado = (
        SELECT  MIN(h2.valor_desenbolsado)
        FROM historico h2
        WHERE h2.data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}' )
        LIMIT 1 ) AS mi, (
        SELECT  h.setor_cnae
            ,POWER(1 + (h.juros / 100),h.prazo_carencia + h.prazo_amortizacao) * (h.prazo_carencia * 1.0 / h.prazo_amortizacao) AS risco
        FROM historico h
        WHERE h.data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        ORDER BY risco DESC
        LIMIT 1 ) AS mr, (
        SELECT  h.setor_cnae
            ,POWER(1 + (h.juros / 100),h.prazo_carencia + h.prazo_amortizacao) * (h.prazo_carencia * 1.0 / h.prazo_amortizacao) AS risco
        FROM historico h
        WHERE h.data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        ORDER BY risco ASC
        LIMIT 1 ) AS lr;
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
    creditoConcedido,
    exibirKpiHome
}
