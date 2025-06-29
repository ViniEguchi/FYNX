var express = require("express");
var router = express.Router();

var graficoController = require("../controllers/graficoController");

router.get("/preencherSetores", function (req, res) {
  graficoController.preencherSetores(req, res);
});

router.get("/totalOperacoes/:ano/:mesInicial/:mesFinal", function (req, res) {
  graficoController.totalOperacoes(req, res);
});

router.get("/jurosMedioSetor/:ano/:mesInicial/:mesFinal", function (req, res) {
  graficoController.jurosMedioSetor(req, res);
});

router.get("/prazoAmortizacaoMes/:ano/:mesInicial/:mesFinal", function (req, res) {
  graficoController.prazoAmortizacaoMes(req, res);
});

router.get("/valorOperacoesMes/:ano/:mesInicial/:mesFinal", function (req, res) {
  graficoController.valorOperacoesMes(req, res);
});

router.get("/exibirKpiDash/:ano/:mesInicial/:mesFinal/:setor", function (req, res) {
  graficoController.exibirKpiDash(req, res);
});

router.get("/valorMedioOperacoesMes/:ano/:mesInicial/:mesFinal/:setor", function (req, res) {
  graficoController.valorMedioOperacoesMes(req, res);
});

router.get("/creditoConcedido/:ano/:mesInicial/:mesFinal/:setor", function (req, res) {
  graficoController.creditoConcedido(req, res);
});

router.get("/exibirKpiHome/:ano/:mesInicial/:mesFinal", function (req, res) {
  graficoController.exibirKpiHome(req, res);
});

router.get("/prazoMaisAceito/:ano/:mesInicial/:mesFinal", function (req, res) {
  graficoController.prazoMaisAceito(req, res);
});

router.get("/setorParaInvestir/:ano/:mesInicial/:mesFinal", function (req, res) {
  graficoController.setorParaInvestir(req, res);
});


module.exports = router;