var mensagensModel = require("../models/mensagensModel")

function enviar(req, res) {
    const mensagem = req.body.mensagemServer;
    const idUsuario = req.body.idUsuarioServer;
    const idEmpresa = req.body.idEmpresaServer;

    if (mensagem == undefined) {
        res.status(400).send("Seu mensagem está undefined!");
    } else if (idUsuario == undefined) {
        res.status(400).send("Seu usuario está undefined!");
    }else if (idEmpresa == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else {
        mensagensModel.enviar(mensagem, idUsuario,idEmpresa)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.error("Erro ao enviar mensagem:", erro);
                res.status(500).json(erro.sqlMessage || erro.message);
            });
    }
}

function listar(req, res) {
    const idUsuario = req.params.idUsuarioServer;
    const idEmpresa = req.params.idEmpresaServer;

    if (idUsuario == undefined) {
        res.status(400).send("Seu usuario está undefined!");
    }else if (idEmpresa == undefined) {
        res.status(400).send("Sua empresa está undefined!");
    } else {

        mensagensModel.listar(idUsuario,idEmpresa)
        .then(mensagens => {
            if (mensagens.length === 0) return res.status(204).send("Nenhuma mensagem encontrada.");
            const mensagensFormatadas = mensagens.map(msg => ({
                ...msg,
                dt_criacao: formatarDataBrasil(msg.dt_criacao),
                dt_atualizacao: formatarDataBrasil(msg.dt_atualizacao)
            }));

            res.status(200).json(mensagensFormatadas);
        })
        .catch(erro => {
            console.error("Erro ao listar mensagens:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
    }
}

function update(req, res) {
    const idUsuario = req.body.idUsuarioServer;
    const idMensagem = req.body.idMensagemServer;
    const mensagem = req.body.mensagemServer;

    if (idUsuario == undefined) {
        res.status(400).send("Seu usuario está undefined!");
    }else if (mensagem == undefined) {
        res.status(400).send("Sua mensagem está undefined!");
    }else if (idMensagem == undefined) {
        res.status(400).send("Sua idMensagem está undefined!");
    } else {

        mensagensModel.update(idUsuario,idMensagem,mensagem)
        .then(mensagens => {
            if (mensagens.length === 0) return res.status(204).send("Nenhuma mensagem encontrada.");
            res.status(200).json(mensagens);
        })
        .catch(erro => {
            console.error("Erro ao listar mensagens:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
    }
}

function deletar(req, res) {
    const idUsuario = req.params.idUsuarioServer;
    const idMensagem = req.params.idMensagemServer;

    if (!idMensagem || !idUsuario) {
        return res.status(400).send("ID da mensagem ou do usuário está faltando.");
    }

    mensagensModel.deletar(idMensagem, idUsuario)
        .then(resultado => res.json({ sucesso: true }))
        .catch(erro => {
            console.error("Erro ao deletar mensagem:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function formatarDataBrasil(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });
}

module.exports = {
    enviar,
    listar,
    update,
    deletar
}