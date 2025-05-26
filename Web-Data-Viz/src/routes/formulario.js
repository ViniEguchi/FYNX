var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/formularioController");

router.post("/enviar_formulario", function (req, res) {
    usuarioController.enviar_formulario(req, res);
})

module.exports = router;