var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");
var enderecoModel = require("../models/enderecoModel");
var empresaModel = require("../models/empresaModel")

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        senha: resultadoAutenticar[0].senha,
                                        aquarios: resultadoAquarios
                                    });
                                } else {
                                    res.status(204).json({
                                        aquarios: []
                                    });
                                }
                            })
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html

    var responsavel = req.body.responsavelServer
    var email = req.body.emailServer
    var senha = req.body.senhaServer
    var cnpj = req.body.cnpjServer
    var razaoSocial = req.body.razaoSocialServer
    var nomeFantasia = req.body.nomeFantasiaServer
    var cep = req.body.cepServer
    var bairro = req.body.bairroServer
    var logradouro = req.body.logradouroServer
    var numero = req.body.numeroServer
    var estado = req.body.estadoServer
    var uf = req.body.ufServer

    // Faça as validações dos valores
    if (responsavel == undefined) {
        res.status(400).send("O responsável está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("Seu CNPJ está undefined!");
    } else if (razaoSocial == undefined) {
        res.status(400).send("A razão social está undefined!");
    } else if (nomeFantasia == undefined) {
        res.status(400).send("O nome fantasia está undefined!");
    } else if (cep == undefined) {
        res.status(400).send("O CEP está undefined!");
    } else if (bairro == undefined) {
        res.status(400).send("O bairro está undefined!");
    } else if (logradouro == undefined) {
        res.status(400).send("O logradouro está undefined!");
    } else if (numero == undefined) {
        res.status(400).send("O número está undefined!");
    } else if (estado == undefined) {
        res.status(400).send("O estado está undefined!");
    } else if (uf == undefined) {
        res.status(400).send("A UF está undefined!");
    } else {
        empresaModel.buscarPorCnpj(cnpj)
            .then((resultadoCNPJ) => {
                console.log(resultadoCNPJ.length == 0)
                if(resultadoCNPJ.length == 0){
                    empresaModel.cadastrar(responsavel, cnpj, razaoSocial, nomeFantasia)
                    .then((resultadoCadastroEmpresa) => {
                        var idEmpresa = resultadoCadastroEmpresa.insertId
                        console.log(`Resultados empresa: ${JSON.stringify(resultadoCadastroEmpresa)}`);
                        console.log(resultadoCadastroEmpresa.affectedRows > 0)
                        if (resultadoCadastroEmpresa.affectedRows > 0) {

                            enderecoModel.cadastrar(idEmpresa, cep, logradouro, numero)
                                .then((resultadoEnderecoModel) => {
                                    console.log(`Resultados endereço: ${JSON.stringify(resultadoEnderecoModel)}`);

                                    if (resultadoEnderecoModel.affectedRows > 0) {
                                        usuarioModel.cadastrar(idEmpresa, responsavel)
                                            .then((resultadoCadastroFuncionario) => {
                                                var idFuncionario = resultadoCadastroFuncionario.insertId
                                                console.log(`Resultados funcionario: ${JSON.stringify(resultadoCadastroFuncionario)}`);

                                                if (resultadoCadastroFuncionario.affectedRows > 0) {
                                                    usuarioModel.cadastrarLogin(idFuncionario, idEmpresa, email, senha)
                                                        .then((resultadoCadastroLogin) => {
                                                            console.log(`Resultados login: ${JSON.stringify(resultadoCadastroLogin)}`);
                                                        })
                                                }
                                            })

                                    }

                                })

                        }
                        console.log(resultadoCadastroEmpresa);

                    })
                    .catch(
                        function (erro) {
                            console.log(erro);
                            console.log(
                                "\nHouve um erro ao realizar o cadastro! Erro: ",
                                erro.sqlMessage
                            );
                            res.status(500).json(erro.sqlMessage);
                        }
                    );
                }else{
                    console.log("\nEmpresa ja existente!")
                        res.status(400).json();
                }

            })

    }
}

module.exports = {
    autenticar,
    cadastrar
}