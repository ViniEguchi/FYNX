var funcionarioModel = require("../models/funcionarioModel");

function listarFuncionarios(req, res) {
    const idEmpresa = req.params.idEmpresa;

    funcionarioModel.listarFuncionarios(idEmpresa)
        .then((resultadoListarFuncionario) => {
            if (resultadoListarFuncionario.length === 0) {
                return res.status(204).send("Nenhum funcionário encontrado.");
            }

            const funcionarios = resultadoListarFuncionario.map(funcionario => ({
                idFuncionario: funcionario.idFuncionario,
                idLogin: funcionario.idLogin,
                nome: funcionario.nome,
                cpf: funcionario.cpf,
                celular: funcionario.celular,
                isGerente: funcionario.gerente,
                email: funcionario.email,
                senha: funcionario.senha
            }));

            return res.status(200).json(funcionarios);
        })
        .catch((erro) => {
            console.error("Erro ao carregar perfil:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function atualizar(req, res) {
    const idUsuario = req.params.idUsuario;
    const {
        nome,
        cpf,
        celular,
        email,
        senha,
        gerente,
    } = req.body;

    if (!idUsuario || !email || !nome) {
        return res.status(400).send("Campos obrigatórios não informados!");
    }

    funcionarioModel.atualizar(
            idUsuario, nome, cpf, celular, email, senha, gerente
        )
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro ao criar perfil:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function cadastrar(req, res) {
    const idEmpresa = req.body.idEmpresa;
    console.log("Cadastrando funcionario");

    const {
        nome,
        cpf,
        celular,
        email,
        senha,
        gerente
    } = req.body;

    if (!nome || !cpf || !celular || !email || !senha || gerente === undefined) {
        return res.status(400).send("Campos obrigatórios não preenchidos.");
    }

    funcionarioModel.verificarDadosExistentes(email, celular, cpf)
        .then((resultado) => {
            if (resultado.length > 0) {
                return res.status(409).send("E-mail ou celular já cadastrado.");
            }

            return funcionarioModel.cadastrar(
                idEmpresa, nome, cpf, celular, email, senha, gerente
            );
        })
        .then((resultadoCadastro) => {
            res.status(200).json(resultadoCadastro);
        })
        .catch((erro) => {
            console.error("Erro ao criar perfil:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}


function deletarFuncionario(req, res) {
    const idFuncionario = req.params.idFuncionario;
    console.log("Deletando Funcionario")
    if (!idFuncionario) {
        return res.status(400).send("ID do funcionário não informado.");
    }

    funcionarioModel.deletarFuncionario(idFuncionario)
        .then((resultado) => {
            if (resultado.affectedRows === 0) {
                return res.status(404).send("Funcionário não encontrado.");
            }
            res.status(200).send("Funcionário deletado com sucesso!");
        })
        .catch((erro) => {
            console.error("Erro ao deletar funcionário:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}



module.exports = {
    // autenticar,
    cadastrar,
    deletarFuncionario,
    atualizar,
    listarFuncionarios
};