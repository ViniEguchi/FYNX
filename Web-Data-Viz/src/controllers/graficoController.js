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

module.exports = {
    preencherSetores
}