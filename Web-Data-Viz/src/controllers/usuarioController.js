var usuarioModel = require("../models/usuarioModel");
var enderecoModel = require("../models/enderecoModel");
var empresaModel = require("../models/empresaModel");

function autenticar(req, res) {
const { emailServer: email, senhaServer: senha } = req.body;
    if (!email || !senha) {
        return res.status(400).send("Email e senha são obrigatórios.");
    }

    usuarioModel.autenticar(email, senha)
        .then((resultadoAutenticar) => {
            if (resultadoAutenticar.length !== 1) {
                return res.status(403).send("Email e/ou senha inválido(s) ou múltiplos registros encontrados.");
            }

            const usuario = resultadoAutenticar[0];

            empresaModel.buscarPorId(usuario.empresaId)
                .then((empresa) => {
                    if (!empresa || empresa.length === 0) {
                        return res.status(404).send("Empresa vinculada não encontrada.");
                    }

                    console.log("AAAAAAAAAAAA")
                    console.log(usuario)
                    res.json({
                        id: usuario.idLogin,
                        idEmpresa: usuario.empresaId,
                        email: usuario.email,
                        nome: usuario.nome,
                        responsavel: empresa[0].representante_legal,
                        senha: usuario.senha,
                        isGerente: usuario.gerente
                    });
                })
                .catch((erro) => {
                    console.error("Erro ao buscar empresa:", erro);
                    res.status(500).json(erro.sqlMessage || erro.message);
                });
        })
        .catch((erro) => {
            console.error("Erro durante a autenticação:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function cadastrar(req, res) {
    const {
        responsavelServer: responsavel,
        emailServer: email,
        senhaServer: senha,
        cnpjServer: cnpj,
        razaoSocialServer: razaoSocial,
        nomeFantasiaServer: nomeFantasia,
        cepServer: cep,
        bairroServer: bairro,
        logradouroServer: logradouro,
        numeroServer: numero,
        estadoServer: estado,
        ufServer: uf,
        complementoServer: complemento
    } = req.body;

    empresaModel.buscarPorCnpj(cnpj)
        .then((empresaExistente) => {
            if (empresaExistente.length > 0) {
                return res.status(400).send("Empresa já cadastrada com esse CNPJ.");
            }

            empresaModel.cadastrar(responsavel, cnpj, razaoSocial, nomeFantasia)
                .then((resultadoEmpresa) => {
                    const idEmpresa = resultadoEmpresa.insertId;
                    if (!idEmpresa) throw new Error("Erro ao cadastrar empresa.");

                    enderecoModel.cadastrar(idEmpresa, cep, logradouro, numero, complemento)
                        .then((resultadoEndereco) => {
                            if (resultadoEndereco.affectedRows === 0) throw new Error("Erro ao cadastrar endereço.");

                            usuarioModel.cadastrar(idEmpresa, responsavel)
                                .then((resultadoFuncionario) => {
                                    const idFuncionario = resultadoFuncionario.insertId;
                                    if (!idFuncionario) throw new Error("Erro ao cadastrar funcionário.");

                                    usuarioModel.cadastrarLogin(idFuncionario, idEmpresa, email, senha)
                                        .then((resultadoLogin) => {
                                            if (resultadoLogin.affectedRows === 0) throw new Error("Erro ao cadastrar login.");
                                            return res.status(201).send("Cadastro realizado com sucesso!");
                                        });
                                });
                        });
                });
        })
        .catch((erro) => {
            console.error("Erro ao realizar cadastro:", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function perfil(req, res) {
    const idUsuario = req.params.id;

    usuarioModel.carregarPerfil(idUsuario)
        .then((resultadoCarregarPerfil) => {
            if (resultadoCarregarPerfil.length !== 1) {
                return res.status(403).send("Usuário não encontrado ou múltiplos usuários com o mesmo ID.");
            }

            const usuario = resultadoCarregarPerfil[0];

            if (usuario.gerente) {
                empresaModel.buscarPorId(usuario.fkEmpresa)
                    .then(([empresa]) => {
                        if (!empresa) return res.status(404).send("Empresa não encontrada.");

                        enderecoModel.buscarPorIdEmpresa(usuario.fkEmpresa)
                            .then(([endereco]) => {
                                if (!endereco) return res.status(404).send("Endereço da empresa não encontrado.");

                                return res.json({
                                    nome: usuario.nome,
                                    cpf: usuario.cpf,
                                    celular: usuario.celular,
                                    isGerente: usuario.gerente,
                                    email: usuario.email,
                                    senha: usuario.senha,
                                    idEmpresa: empresa.idEmpresa,
                                    nome_fantasia: empresa.nome_fantasia,
                                    razao_social: empresa.razao_social,
                                    representante_legal: empresa.representante_legal,
                                    cnpj: empresa.cnpj,
                                    cep: endereco.cep,
                                    logradouro: endereco.logradouro,
                                    numero: endereco.numero,
                                    complemento: endereco.complemento
                                });
                            });
                    });
            } else {
                return res.json({
                    nome: usuario.nome,
                    cpf: usuario.cpf,
                    celular: usuario.celular,
                    isGerente: usuario.gerente,
                    email: usuario.email,
                    senha: usuario.senha
                });
            }
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
        nome_fantasia,
        razao_social,
        representante_legal,
        cnpj,
        cep,
        logradouro,
        numero,
        complemento
    } = req.body;

    if (!idUsuario || !email || !nome) {
        return res.status(400).send("Campos obrigatórios não informados!");
    }

    usuarioModel.atualizar(
    idUsuario,
    nome,
    cpf,
    celular,
    email,
    senha,
    nome_fantasia,
    razao_social,
    representante_legal,
    cnpj,
    cep,
    logradouro,
    numero,
    complemento
)

        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro ao atualizar perfil:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    perfil,
    atualizar
};

