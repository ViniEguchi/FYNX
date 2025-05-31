var graficoModel = require("../models/graficoModel")

function preencherSetores(req, res) {
    var ano = req.params.ano;
    var mesInicial = req.params.mesInicial;
    var mesFinal = req.params.mesFinal;

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
    var ano = req.params.ano;
    var mesInicial = req.params.mesInicial;
    var mesFinal = req.params.mesFinal;

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
    var ano = req.params.ano;
    var mesInicial = req.params.mesInicial;
    var mesFinal = req.params.mesFinal;

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
    var ano = req.params.ano;
    var mesInicial = req.params.mesInicial;
    var mesFinal = req.params.mesFinal;

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
    var ano = req.params.ano;
    var mesInicial = req.params.mesInicial;
    var mesFinal = req.params.mesFinal;

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
    var periodo = req.params.periodo;
    var setor = req.params.setor;

    console.log(periodo);
    console.log(setor);

    graficoModel.exibirKpiDash(ano, mesInicial, mesFinal, setor)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.error("Erro ao exibir KPI's:", erro);
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
    valorOperacoesMes
}