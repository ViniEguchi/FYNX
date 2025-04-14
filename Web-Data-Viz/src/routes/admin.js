const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/", function (req, res) {
    adminController.listarEmpresas(req, res);
  });
  
  router.get("/:idEmpresa/funcionarios", function (req, res) {
    adminController.listarFuncionarios(req, res);
  });
  
  router.post("/cadastrar", function (req, res) {
    adminController.cadastrarEmpresa(req, res);
  });
  
  router.put("/atualizar/:idEmpresa", function (req, res) {
    adminController.atualizarEmpresa(req, res);
  });
  
  router.delete("/deletar/:idEmpresa", function (req, res) {
    adminController.deletarEmpresa(req, res);
  });

module.exports = router;
