var database = require("../database/config");

function listarEmpresas() {
    console.log(
      "ACESSEI O adminModel.listarEmpresas() \n\n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n\t\t >> verifique suas credenciais de acesso ao banco\n\t\t >> e se o servidor de seu BD está rodando corretamente.\n"
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
  

function listarFuncionariosPorEmpresa(idEmpresa) {
    console.log("ACESSEI O ADMIN MODEL - listarFuncionariosPorEmpresa():", idEmpresa);
    var instrucaoSql = `
        SELECT f.idFuncionario, f.nome, f.cpf, f.celular, 
               l.email, l.gerente, l.senha
        FROM funcionario f
        JOIN login l ON f.idFuncionario = l.fkFuncionario
        WHERE f.fkEmpresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function cadastrarEmpresa(nome_fantasia, razao_social, representante_legal, cnpj, cep, logradouro, numero, complemento) {
    console.log("ACESSEI O ADMIN MODEL - cadastrarEmpresa()");

    const sqlEmpresa = `
        INSERT INTO empresa (nome_fantasia, razao_social, representante_legal, cnpj)
        VALUES ('${nome_fantasia}', '${razao_social}', '${representante_legal}', '${cnpj}');
    `;

    console.log("Executando SQL para cadastro da empresa:\n" + sqlEmpresa);
    return database.executar(sqlEmpresa).then(resultadoEmpresa => {
        const idEmpresa = resultadoEmpresa.insertId;

        const sqlEndereco = `
            INSERT INTO endereco (fkEmpresa, cep, logradouro, numero, complemento)
            VALUES (${idEmpresa}, '${cep}', '${logradouro}', '${numero}', '${complemento}');
        `;
        console.log("Executando SQL para cadastro do endereço:\n" + sqlEndereco);
        return database.executar(sqlEndereco);
    });
}

async function atualizarEmpresa(idEmpresa, nome_fantasia, razao_social, representante_legal, cnpj, cep, logradouro, numero, complemento) {
    console.log("ACESSEI O ADMIN MODEL - atualizarEmpresa()");

    const sqlEmpresa = `
        UPDATE empresa 
        SET nome_fantasia = '${nome_fantasia}', razao_social = '${razao_social}', representante_legal = '${representante_legal}', cnpj = '${cnpj}'
        WHERE idEmpresa = ${idEmpresa};
    `;

    const sqlEndereco = `
        UPDATE endereco 
        SET cep = '${cep}', logradouro = '${logradouro}', numero = '${numero}', complemento = '${complemento}'
        WHERE fkEmpresa = ${idEmpresa};
    `;

    console.log("Executando SQL para atualizar empresa:\n" + sqlEmpresa);
    await database.executar(sqlEmpresa);

    console.log("Executando SQL para atualizar endereço:\n" + sqlEndereco);
    return database.executar(sqlEndereco);
}

function deletarEmpresa(idEmpresa) {
    console.log("ACESSEI O ADMIN MODEL - deletarEmpresa():", idEmpresa);

    const sql = `
        DELETE FROM empresa WHERE idEmpresa = ${idEmpresa};
    `;

    console.log("Executando SQL para deletar empresa:\n" + sql);
    return database.executar(sql);
}

module.exports = {
    listarEmpresas,
    listarFuncionariosPorEmpresa,
    cadastrarEmpresa,
    atualizarEmpresa,
    deletarEmpresa
};
