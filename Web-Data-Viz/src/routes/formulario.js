var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/enviar", function (req, res) {
    usuarioController.enviar(req, res);
})

module.exports = router;