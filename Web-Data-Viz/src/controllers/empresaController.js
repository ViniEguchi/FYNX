var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    console.log(resultado)
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  const {
    nomeFantasia,
    razaoSocial,
    representante,
    cnpj,
    cep,
    logradouro,
    numero,
    complemento
  } = req.body;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    if (resultado.length > 0) {
      res.status(401).json({
        mensagem: `A empresa com o CNPJ ${cnpj} já existe`
      });
    } else {
      empresaModel.cadastrarEmpresa(nomeFantasia, razaoSocial, representante, cnpj)
        .then((resultadoEmpresa) => {
          const idEmpresa = resultadoEmpresa.insertId;
          empresaModel.cadastrarEndereco(idEmpresa, cep, logradouro, numero, complemento);
        })
        .then((resultadoEndereco) => {
          res.status(201).json({
            mensagem: "Empresa cadastrada com sucesso!"
          });
        })
        .catch((erro) => {
          console.error("Erro ao cadastrar empresa e endereço:", erro);
          res.status(500).json({
            erro: "Erro ao cadastrar empresa e endereço"
          });
        });
    }
  });
}

function atualizar(req, res) {
  idEmpresa = req.params.empresaId
  const {
    idEndereco,
    nomeFantasia,
    razaoSocial,
    representante,
    cnpj,
    cep,
    logradouro,
    numero,
    complemento
  } = req.body;
  
  empresaModel.atualizar(
    idEmpresa,
    nomeFantasia,
    razaoSocial,
    representante,
    cnpj
  )
    .then(() => {
      return empresaModel.atualizarEndereco(
        idEmpresa,
        cep,
        logradouro,
        numero,
        complemento
      );
    })
    .then((resultadoEndereco) => {
      res.status(200).json(resultadoEndereco);
    })
    .catch((erro) => {
      console.error("Erro ao atualizar empresa/endereço:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}


function deletar(req, res) {
  const idEmpresa = req.params.id;
  console.log("Deletando Empresa")
  if (!idEmpresa) {
    return res.status(400).send("ID do Empresa não informada.");
  }

  empresaModel.deletar(idEmpresa)
    .then((resultado) => {
      if (resultado.affectedRows === 0) {
        return res.status(404).send("Empresa não encontrada.");
      }
      res.status(200).send("Empresa deletada com sucesso!");
    })
    .catch((erro) => {
      console.error("Erro ao deletar Empresa:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}



module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
  deletar,
  atualizar
};