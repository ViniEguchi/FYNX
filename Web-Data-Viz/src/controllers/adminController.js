const adminModel = require("../models/adminModel");

function listarEmpresas(req, res) {
    adminModel.listarEmpresas()
        .then(empresas => {
            if (empresas.length === 0) return res.status(204).send("Nenhuma empresa cadastrada.");
            res.status(200).json(empresas);
        })
        .catch(erro => {
            console.error("Erro ao listar empresas:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function listarFuncionarios(req, res) {
    const idEmpresa = req.params.idEmpresa;

    if (!idEmpresa) return res.status(400).send("ID da empresa não informado.");

    adminModel.listarFuncionariosPorEmpresa(idEmpresa)
        .then(funcionarios => {
            if (funcionarios.length === 0) return res.status(204).send("Nenhum funcionário encontrado.");
            res.status(200).json(funcionarios);
        })
        .catch(erro => {
            console.error("Erro ao listar funcionários:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function cadastrarEmpresa(req, res) {
    const { nome_fantasia, razao_social, representante_legal, cnpj, cep, logradouro, numero, complemento } = req.body;

    if (!nome_fantasia || !razao_social || !representante_legal || !cnpj) {
        return res.status(400).send("Campos obrigatórios não preenchidos.");
    }

    adminModel.cadastrarEmpresa(nome_fantasia, razao_social, representante_legal, cnpj, cep, logradouro, numero, complemento)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao cadastrar empresa:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function atualizarEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;
    const { nomeFantasia,
        razaoSocial,
        representante,
        cnpj,
        cep,
        logradouro,
        numero,
        complemento } = req.body;

    console.log(idEmpresa, nomeFantasia, razaoSocial)
    if (!idEmpresa || !nomeFantasia || !razaoSocial) {
        return res.status(400).send("Campos obrigatórios não informados.");
    }


    adminModel.atualizarEmpresa(idEmpresa, nomeFantasia, razaoSocial, representante, cnpj, cep, logradouro, numero, complemento)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao atualizar empresa:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function deletarEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;

    if (!idEmpresa) return res.status(400).send("ID da empresa não informado.");

    adminModel.deletarEmpresa(idEmpresa)
        .then(resultado => res.status(200).send("Empresa deletada com sucesso!"))
        .catch(erro => {
            console.error("Erro ao deletar empresa:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

module.exports = {
    listarEmpresas,
    listarFuncionarios,
    cadastrarEmpresa,
    atualizarEmpresa,
    deletarEmpresa
};
