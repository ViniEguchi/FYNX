var graficoModel = require("../models/graficoModel")

function preencherSetores(req, res) {
    console.log("controller");

    graficoModel.preencherSetores()
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

    graficoModel.totalOperacoes()
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

    graficoModel.jurosMedioSetor()
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

    graficoModel.prazoAmortizacaoMes()
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

    graficoModel.valorOperacoesMes()
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
    totalOperacoes,
    jurosMedioSetor,
    prazoAmortizacaoMes,
    valorOperacoesMes
}