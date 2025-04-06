var express = require("express");
var router = express.Router();

var funcionarioController = require("../controllers/funcionarioController");

router.post("/cadastrar", function (req, res) {
    funcionarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    funcionarioController.autenticar(req, res);
});

router.get("/perfil/:id", function (req, res) {
    funcionarioController.perfil(req, res);
});

router.put("/atualizar/:idUsuario", function (req, res) {
    funcionarioController.atualizar(req, res);
});

router.get("/listar/:idEmpresa", function (req, res) {
    funcionarioController.listarFuncionarios(req, res);
});

router.delete("/deletar/:idFuncionario", function (req, res) {
    funcionarioController.deletarFuncionario(req, res);
});



module.exports = router;