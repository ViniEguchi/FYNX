var database = require("../database/config");

/*
DASH Comparar Ano Anterior
SELECT  ano_atual.atual     AS atual
       ,ano_passado.passado AS passado
FROM
(
	SELECT  valor_desenbolsado AS atual
	FROM historico
	WHERE data_contratacao BETWEEN '${dataInicialStrAtual}' AND '${dataFinalStrAtual}'
	AND subsetor_cnae = '${setor}'
) AS ano_atual, (
SELECT  valor_desenbolsado AS passado
FROM historico
WHERE data_contratacao BETWEEN '${dataInicialStrPassado}' AND '${dataFinalStrPassado}'
AND subsetor_cnae = '${setor}') AS ano_passado

DASH Variação Juros
SELECT  AVG(juros) as juros
       ,MONTH(data_contratacao) AS mes
FROM historico
WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
AND subsetor_cnae = '${setor}'
GROUP BY mes
ORDER BY  mes

HOME 
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
        SELECT  mesMais.mes as mes
                ,maximo.juros_max as maximo
                ,minimo.juros_min as minimo
                ,prazo.carencia_max as carencia_max
                ,prazo.carencia_min as carencia_min
        FROM
        (
        	SELECT  MONTH(data_contratacao) AS mes
        	       ,COUNT(*)                AS todo
        	FROM historico
        	WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        	AND subsetor_cnae = '${setor}'
        	GROUP BY  mes
        	ORDER BY  todo DESC
        	LIMIT 1
        ) AS mesMais, (
        SELECT  juros AS juros_max
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        AND subsetor_cnae = '${setor}'
        ORDER BY data_contratacao DESC
        LIMIT 1) AS maximo, (
        SELECT  juros AS juros_min
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        AND subsetor_cnae = '${setor}'
        ORDER BY data_contratacao
        LIMIT 1) AS minimo, (
        SELECT MAX(prazo_carencia) as carencia_max
                ,MIN(prazo_carencia) as carencia_min
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        AND subsetor_cnae = '${setor}') as prazo;
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
        JOIN
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
        SELECT  ROUND(AVG(juros), 2) as juros
                ,MONTH(data_contratacao) AS mes
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        AND subsetor_cnae = '${sub_setor}'
        GROUP BY mes
        ORDER BY  mes
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function exibirKpiHome(ano, mesInicial, mesFinal) {
    const { dataInicialStr, dataFinalStr } = montarIntervalo(ano, mesInicial, mesFinal);

    const instrucaoSql = `
        SELECT  CONCAT(menor_juros.setor,' - ',menor_juros.juros) AS menor_juros
               ,menor_investimento.setor                          AS setor_menor_investimento
               ,maior_risco.setor                                 AS setor_maior_risco
               ,menor_risco.setor                                 AS setor_menor_risco
        FROM
        (
        	SELECT  setor_cnae AS setor
        	       ,MIN(juros) AS juros
        	FROM historico
        	WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        	GROUP BY  setor
        	ORDER BY  juros
        	LIMIT 1
        ) AS menor_juros, (
        SELECT  setor_cnae              AS setor
               ,MIN(valor_desenbolsado) AS valor
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        GROUP BY setor
        ORDER BY valor
        LIMIT 1) AS menor_investimento, (
        SELECT  setor_cnae          AS setor
               ,AVG(prazo_carencia) AS maximo
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        GROUP BY setor
        ORDER BY maximo DESC
        LIMIT 1) AS maior_risco, (
        SELECT  setor_cnae          AS setor
               ,AVG(prazo_carencia) AS minimo
        FROM historico
        WHERE data_contratacao BETWEEN '${dataInicialStr}' AND '${dataFinalStr}'
        GROUP BY setor
        ORDER BY minimo
        LIMIT 1) AS menor_risco
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
