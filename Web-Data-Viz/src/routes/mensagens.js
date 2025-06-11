var express = require("express");
var router = express.Router();

var mensagensController = require("../controllers/mensagensController");
router.get("/:idUsuarioServer/:idEmpresaServer", function (req, res) {
    mensagensController.listar(req, res);
})

router.post("/enviar", function (req, res) {
    mensagensController.enviar(req, res);
})

router.put("/update", function (req, res) {
    mensagensController.update(req, res);
})

router.delete("/deletar/:idMensagemServer/:idUsuarioServer", function (req, res) {
    mensagensController.deletar(req, res);
})

module.exports = router;