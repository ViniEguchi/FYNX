var database = require("../database/config");

function buscarPorId(id) {
  console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarPorId()", id);

  var instrucaoSql = `SELECT * FROM empresa WHERE idEmpresa = '${id}'`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);

  return database.executar(instrucaoSql);
}

function listar() {
  console.log(
    "ACESSEI O empresa MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()"
  );

  const instrucaoSql = `
    SELECT 
      e.idEmpresa,
      e.nome_fantasia,
      e.razao_social,
      e.representante_legal,
      e.cnpj,
      end.cep,
      end.logradouro,
      end.numero,
      end.complemento
    FROM empresa e
    INNER JOIN endereco end
      ON e.idEmpresa = end.fkEmpresa;
  `;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrarEmpresa(nomeFantasia, razaoSocial, representante, cnpj) {
  console.log("ACESSEI O empresaModel - cadastrarEmpresa()");
  const sql = `
        INSERT INTO empresa (nome_fantasia, razao_social, representante_legal, cnpj)
        VALUES ('${nomeFantasia}', '${razaoSocial}', '${representante}', '${cnpj}');
    `;
  return database.executar(sql);
}

function cadastrarEndereco(fkEmpresa, cep, logradouro, numero, complemento) {
  console.log("ACESSEI O empresaModel - cadastrarEndereco()");
  const sql = `
        INSERT INTO endereco (fkEmpresa, cep, logradouro, numero, complemento)
        VALUES ('${fkEmpresa}', '${cep}', '${logradouro}', '${numero}', '${complemento}');
    `;
  return database.executar(sql);
}

async function deletar(idEmpresa) {
  console.log("ACESSEI O MODEL - deletarEmpresa()");

  const deletarLogins = `
      DELETE FROM login 
      WHERE fkEmpresa = ${idEmpresa};
  `;
  console.log("Executando a instrução SQL: \n" + deletarLogins);
  await database.executar(deletarLogins);

  const deletarFuncionarios = `
      DELETE FROM funcionario 
      WHERE fkEmpresa = ${idEmpresa};
  `;
  console.log("Executando a instrução SQL: \n" + deletarFuncionarios);
  await database.executar(deletarFuncionarios);

  const deletarEnderecos = `
      DELETE FROM endereco 
      WHERE fkEmpresa = ${idEmpresa};
  `;
  console.log("Executando a instrução SQL: \n" + deletarEnderecos);
  await database.executar(deletarEnderecos);

  const deletarEmpresa = `
      DELETE FROM empresa 
      WHERE idEmpresa = ${idEmpresa};
  `;
  console.log("Executando a instrução SQL: \n" + deletarEmpresa);
  return database.executar(deletarEmpresa);
}

async function atualizarEndereco(idEndereco, fkEmpresa, cep, logradouro, numero, complemento) {
  console.log("ACESSEI O ENDEREÇO MODEL - atualizarEndereco()");

  const instrucaoSql = `
      UPDATE endereco 
      SET 
          cep = '${cep}',
          logradouro = '${logradouro}',
          numero = '${numero}',
          complemento = '${complemento}'
      WHERE idEndereco = ${idEndereco} AND fkEmpresa = ${fkEmpresa};
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

async function atualizarEmpresa(idEmpresa, nomeFantasia, razaoSocial, representanteLegal, cnpj) {
  console.log("ACESSEI O EMPRESA MODEL - atualizarEmpresa()");

  const instrucaoSql = `
      UPDATE empresa 
      SET 
          nome_fantasia = '${nomeFantasia}',
          razao_social = '${razaoSocial}',
          representante_legal = '${representanteLegal}',
          cnpj = '${cnpj}'
      WHERE idEmpresa = ${idEmpresa};
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}



module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrarEmpresa,
  listar,
  cadastrarEndereco,
  deletar,
  atualizarEndereco,
  atualizarEmpresa
};