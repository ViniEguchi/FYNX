var database = require("../database/config");

function buscarPorId(id) {
  console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarPorId()", id);

  var instrucaoSql = `SELECT * FROM empresa WHERE idEmpresa = '${id}'`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(responsavel, cnpj, razaoSocial, nomeFantasia) {
  var instrucaoSql = `INSERT INTO empresa (nome_fantasia, razao_social, representante_legal, cnpj)
    VALUES ('${nomeFantasia}', '${razaoSocial}', '${responsavel}', '${cnpj}');
  `;

  return database.executar(instrucaoSql);
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar
};