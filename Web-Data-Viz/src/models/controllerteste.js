var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");
var enderecoModel = require("../models/enderecoModel");
var empresaModel = require("../models/empresaModel")

async function autenticar(req, res) {
  const {
    emailServer: email,
    senhaServer: senha
  } = req.body;

  if (!email || !senha) {
    return res.status(400).send("Email e senha são obrigatórios.");
  }

  try {
    const resultadoAutenticar = await usuarioModel.autenticar(email, senha);

    if (resultadoAutenticar.length !== 1) {
      return res.status(403).send("Email e/ou senha inválido(s) ou múltiplos registros encontrados.");
    }

    const usuario = resultadoAutenticar[0];
    const empresa = await empresaModel.buscarPorId(usuario.empresaId);

    if (!empresa || empresa.length === 0) {
      return res.status(404).send("Empresa vinculada não encontrada.");
    }

    return res.json({
      id: usuario.idLogin,
      idEmpresa: usuario.empresaId,
      email: usuario.email,
      nome: usuario.nome,
      responsavel: empresa[0].representante_legal,
      senha: usuario.senha,
      isGerente: usuario.gerente
    });

  } catch (erro) {
    console.error("Erro durante a autenticação:", erro);
    return res.status(500).json(erro.sqlMessage || erro.message);
  }
}

async function cadastrar(req, res) {
  const {
    responsavelServer: responsavel,
    emailServer: email,
    senhaServer: senha,
    cnpjServer: cnpj,
    razaoSocialServer: razaoSocial,
    nomeFantasiaServer: nomeFantasia,
    cepServer: cep,
    logradouroServer: logradouro,
    numeroServer: numero,
    complementoServer: complemento,
    cpfServer: cpf,
    celularServer: celular
  } = req.body;

  try {
    const empresaExistente = await empresaModel.buscarPorCnpj(cnpj);

    if (empresaExistente.length > 0) {
      return res.status(400).send("Empresa já cadastrada com esse CNPJ.");
    }

    const resultadoEmpresa = await empresaModel.cadastrar(responsavel, cnpj, razaoSocial, nomeFantasia);
    const idEmpresa = resultadoEmpresa.insertId;

    if (!idEmpresa) throw new Error("Erro ao cadastrar empresa.");

    const resultadoEndereco = await enderecoModel.cadastrar(idEmpresa, cep, logradouro, numero, complemento);

    if (resultadoEndereco.affectedRows === 0) throw new Error("Erro ao cadastrar endereço.");

    const resultadoFuncionario = await usuarioModel.cadastrar(idEmpresa, responsavel, cpf, celular);
    const idFuncionario = resultadoFuncionario.insertId;

    if (!idFuncionario) throw new Error("Erro ao cadastrar funcionário.");

    const resultadoLogin = await usuarioModel.cadastrarLogin(idFuncionario, idEmpresa, email, senha);

    if (resultadoLogin.affectedRows === 0) throw new Error("Erro ao cadastrar login.");

    return res.status(201).send("Cadastro realizado com sucesso!");
  } catch (erro) {
    console.error("Erro ao realizar cadastro:", erro);
    return res.status(500).json(erro.sqlMessage || erro.message);
  }
}

async function perfil(req, res) {
  const idUsuario = req.params.id;

  try {
    const resultadoCarregarPerfil = await usuarioModel.carregarPerfil(idUsuario);

    if (resultadoCarregarPerfil.length !== 1) {
      return res.status(403).send("Usuário não encontrado ou múltiplos usuários com o mesmo ID.");
    }

    const usuario = resultadoCarregarPerfil[0];

    if (usuario.gerente) {
      const [empresa] = await empresaModel.buscarPorId(usuario.fkEmpresa);

      if (!empresa) {
        return res.status(404).send("Empresa não encontrada.");
      }

      const [endereco] = await enderecoModel.buscarPorIdEmpresa(usuario.fkEmpresa);

      if (!endereco) {
        return res.status(404).send("Endereço da empresa não encontrado.");
      }

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

  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro.sqlMessage || erro);
    return res.status(500).json(erro.sqlMessage || erro);
  }
}

function atualizar(req, res) {
  var idUsuario = req.params.idUsuario;

  var {
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
    res.status(400).send("Campos obrigatórios não informados!");
    return;
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
}