var database = require("../database/config")

function enviar_formulario(nome, email, mensagem) {
    console.log("ACESSEI O empresa  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarPorId()");

    var instrucaoSql = `INSERT INTO formulario (nome, email, mensagem) VALUES 
                        ('${nome}', '${email}', '${mensagem}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    enviar_formulario
}