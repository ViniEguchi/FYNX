var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM endereco WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM endereco`;

  return database.executar(instrucaoSql);
}

function buscarPorCep(cnpj) {
  var instrucaoSql = `SELECT * FROM endereco WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(fkEmpresa, cep, logradouro, numero,complemento) {
  var instrucaoSql = `INSERT INTO endereco (fkEmpresa, cep, logradouro, numero, complemento)
    VALUES ('${fkEmpresa}', '${cep}', '${logradouro}', '${numero}', '${complemento}');
  `;

  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCep, buscarPorId, cadastrar, listar };
