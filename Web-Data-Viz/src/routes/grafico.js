var express = require("express");
var router = express.Router();

var graficoController = require("../controllers/graficoController");

router.get("/preencherSetores", function (req, res) {
  graficoController.preencherSetores(req, res);
});

router.get("/totalOperacoes", function (req, res) {
  graficoController.totalOperacoes(req, res);
});

router.get("/jurosMedioSetor", function (req, res) {
  graficoController.jurosMedioSetor(req, res);
});

router.get("/prazoAmortizacaoMes", function (req, res) {
  graficoController.prazoAmortizacaoMes(req, res);
});

router.get("/valorOperacoesMes", function (req, res) {
  graficoController.valorOperacoesMes(req, res);
});

router.get("/exibirKpiDash/:periodo/:setor", function (req, res) {
  graficoController.exibirKpiDash(req, res);
});


module.exports = router;