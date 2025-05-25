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

function exibirKpiDash(req, res) {
    var periodo = req.params.periodo;
    var setor = req.params.setor;

    console.log(periodo);
    console.log(setor);

    graficoModel.exibirKpiDash(periodo, setor)
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
    exibirKpiDash
}