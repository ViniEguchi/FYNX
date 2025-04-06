var database = require("../database/config");

function buscarPorIdEmpresa(id) {
  console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarPorId()", id);

  var instrucaoSql = `SELECT * FROM endereco WHERE fkEmpresa = '${id}'`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);

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

function cadastrar(fkEmpresa, cep, logradouro, numero, complemento) {
  var instrucaoSql = `INSERT INTO endereco (fkEmpresa, cep, logradouro, numero, complemento)
    VALUES ('${fkEmpresa}', '${cep}', '${logradouro}', '${numero}', '${complemento}');
  `;

  return database.executar(instrucaoSql);
}

module.exports = {
  buscarPorCep,
  buscarPorIdEmpresa,
  cadastrar,
  listar
};