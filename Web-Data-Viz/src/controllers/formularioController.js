var formularioModel = require("../models/formularioModel")

function enviar_formulario(req, res) {
    console.log("controller");
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var mensagem = req.body.mensagemServer;

    console.log(nome);
    console.log(email);
    console.log(mensagem);

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (mensagem == undefined) {
        res.status(400).send("Sua mensagem está undefined!");
    } else {
        formularioModel.enviar_formulario(nome, email, mensagem)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.error("Erro ao enviar relatório:", erro);
                res.status(500).json(erro.sqlMessage || erro.message);
            });
    }
}

module.exports = {
    enviar_formulario
}