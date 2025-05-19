var express = require("express");
var router = express.Router();

var graficoController = require("../controllers/graficoController");

router.get("/:preencherSetores", function (req, res) {
  graficoController.preencherSetores(req, res);
});

module.exports = router;