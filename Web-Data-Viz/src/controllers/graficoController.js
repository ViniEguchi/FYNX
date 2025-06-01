let graficoModel = require("../models/graficoModel")

function preencherSetores(req, res) {
    console.log("controller");

    graficoModel.preencherSetores(ano, mesInicial, mesFinal)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao enviar relatório:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}

function totalOperacoes(req, res) {
    console.log("função totalOperacoes");

    graficoModel.totalOperacoes(ano, mesInicial, mesFinal)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar total de operações:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}

function jurosMedioSetor(req, res) {
    console.log("função jurosMedioSetor");

    graficoModel.jurosMedioSetor(ano, mesInicial, mesFinal)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar total de operações:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}

function prazoAmortizacaoMes(req, res) {
    console.log("função jurosMedioSetor");

    graficoModel.prazoAmortizacaoMes(ano, mesInicial, mesFinal)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar prazo de amortização:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}

function valorOperacoesMes(req, res) {
    console.log("função valorOperacoesMes");

    graficoModel.valorOperacoesMes(ano, mesInicial, mesFinal)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar valor das operações:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}

function exibirKpiDash(req, res) {
    let ano = req.params.ano;
    let mesInicial = req.params.mesInicial;
    let mesFinal = req.params.mesFinal;
    let setor = req.params.setor;

    graficoModel.exibirKpiDash(ano, mesInicial, mesFinal, setor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao exibir KPI's:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function valorMedioOperacoesMes(req, res) {
    let ano = req.params.ano;
    let mesInicial = req.params.mesInicial;
    let mesFinal = req.params.mesFinal;
    let setor = req.params.setor;

    console.log("função valorMedioOperacoesMes");

    graficoModel.valorMedioOperacoesMes(ano, mesInicial, mesFinal,setor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar valor das operações:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}
function creditoConcedido(req, res) {
    let ano = req.params.ano;
    let mesInicial = req.params.mesInicial;
    let mesFinal = req.params.mesFinal;
    let setor = req.params.setor;

    console.log("função creditoConcedido");

    graficoModel.creditoConcedido(ano, mesInicial, mesFinal,setor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar valor das operações:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}

module.exports = {
    preencherSetores,
    exibirKpiDash,
    preencherSetores,
    totalOperacoes,
    jurosMedioSetor,
    prazoAmortizacaoMes,
    valorOperacoesMes,
    valorMedioOperacoesMes,
    creditoConcedido
}