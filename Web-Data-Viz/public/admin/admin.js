const tabelaEmpresas = document.getElementById('tabelaEmpresas').getElementsByTagName('tbody')[0];
const tabelaFuncionarios = document.getElementById('tabelaFuncionarios').getElementsByTagName('tbody')[0];
const formEmpresa = document.getElementById('formEmpresa');
const formFuncionario = document.getElementById('formFuncionario');
const funcionariosSection = document.getElementById('funcionariosSection');
const btnCadastrarEmpresa = document.getElementById('btnCadastrarEmpresa');
const cadastrarFuncionarioBtn = document.getElementById('cadastrarFuncionarioBtn');
const voltarEmpresasBtn = document.getElementById('voltarEmpresasBtn');
const empresaIdFuncionario = document.getElementById('empresaIdFuncionario');
const dialogCadastrarEmpresa = document.getElementById('dialogCadastrarEmpresa');
const dialogCadastrarFuncionario = document.getElementById('dialogCadastrarFuncionario');

let empresaSelecionadaId = null;

voltarEmpresasBtn.addEventListener('click', () => {
    funcionariosSection.style.display = 'none';
});

btnCadastrarEmpresa.addEventListener('click', () => {
    dialogCadastrarEmpresa.showModal();
});

document.getElementById('cancelarCadastroEmpresa').addEventListener('click', () => {
    dialogCadastrarEmpresa.close();
});

function listarEmpresas() {
    tabelaEmpresas.innerHTML = '';

    fetch("/empresas/listar", {
        method: "GET"
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (dados) {
                dados.forEach(empresa => {
                    const row = tabelaEmpresas.insertRow();
                    row.innerHTML = `
                        <td>${empresa.idEmpresa}</td>
                        <td>
                            <span id="nome_${empresa.idEmpresa}">${empresa.nome_fantasia}</span>
                            <input type="text" id="nome_${empresa.idEmpresa}Input" value="${empresa.nome_fantasia}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <span id="razao_${empresa.idEmpresa}">${empresa.razao_social}</span>
                            <input type="text" id="razao_${empresa.idEmpresa}Input" value="${empresa.razao_social}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <span id="representante_${empresa.idEmpresa}">${empresa.representante_legal}</span>
                            <input type="text" id="representante_${empresa.idEmpresa}Input" value="${empresa.representante_legal}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <span id="cnpj_${empresa.idEmpresa}">${empresa.cnpj}</span>
                            <input type="text" id="cnpj_${empresa.idEmpresa}Input" value="${empresa.cnpj}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <span id="cep_${empresa.idEmpresa}">${empresa.cep}</span>
                            <input type="text" id="cep_${empresa.idEmpresa}Input" value="${empresa.cep}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <span id="logradouro_${empresa.idEmpresa}">${empresa.logradouro}</span>
                            <input type="text" id="logradouro_${empresa.idEmpresa}Input" value="${empresa.logradouro}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <span id="numero_${empresa.idEmpresa}">${empresa.numero}</span>
                            <input type="text" id="numero_${empresa.idEmpresa}Input" value="${empresa.numero}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <span id="complemento_${empresa.idEmpresa}">${empresa.complemento}</span>
                            <input type="text" id="complemento_${empresa.idEmpresa}Input" value="${empresa.complemento}" class="input-edit" style="display: none;">
                        </td>
                        <td>
                            <button onclick="mostrarFuncionarios(${empresa.idEmpresa})">Ver Funcionários</button>
                            <button id="editEmpresaBtn_${empresa.idEmpresa}" onclick="editarEmpresa(${empresa.idEmpresa})">Editar</button>
                            <button id="saveEmpresaBtn_${empresa.idEmpresa}" onclick="salvarEmpresa(${empresa.idEmpresa})" style="display: none;">Salvar</button>
                            <button onclick="excluirEmpresa(${empresa.idEmpresa})">Excluir</button>
                            <button id="cancelEmpresaBtn_${empresa.idEmpresa}" onclick="cancelarEdicaoEmpresa(${empresa.idEmpresa})" style="display: none;">Cancelar</button>
                        </td>
                    `;

                });
            });
        } else {
            resposta.text().then(function (texto) {
                console.error(texto);
            });
        }
    }).catch(function (erro) {
        console.log("Erro na requisição de empresas:", erro);
    });
}

function editarEmpresa(empresaId) {
    document.querySelectorAll('.input-edit').forEach(input => {
        input.style.display = 'none';
    });
    document.querySelectorAll('span[id]').forEach(span => {
        span.style.display = 'inline-block';
    });

    const campos = [
        "nome",
        "razao",
        "representante",
        "cnpj",
        "cep",
        "logradouro",
        "numero",
        "complemento"
    ];

    campos.forEach(campo => {
        const span = document.getElementById(`${campo}_${empresaId}`);
        const input = document.getElementById(`${campo}_${empresaId}Input`);

        if (span && input) {
            span.style.display = 'none';
            input.style.display = 'inline-block';
        }
    });
    const cancelBtn = document.getElementById(`cancelEmpresaBtn_${empresaId}`);
    if (cancelBtn) cancelBtn.style.display = 'inline-block';    
    const editBtn = document.getElementById(`editEmpresaBtn_${empresaId}`);
    const saveBtn = document.getElementById(`saveEmpresaBtn_${empresaId}`);

    if (editBtn && saveBtn) {
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    }
}

function cancelarEdicaoEmpresa(empresaId) {
    const campos = [
        "nome",
        "razao",
        "representante",
        "cnpj",
        "cep",
        "logradouro",
        "numero",
        "complemento"
    ];

    campos.forEach(campo => {
        const span = document.getElementById(`${campo}_${empresaId}`);
        const input = document.getElementById(`${campo}_${empresaId}Input`);

        if (span && input) {
            input.value = span.textContent;
            input.style.display = 'none';
            span.style.display = 'inline-block';
        }
    });

    const editBtn = document.getElementById(`editEmpresaBtn_${empresaId}`);
    const saveBtn = document.getElementById(`saveEmpresaBtn_${empresaId}`);
    const cancelBtn = document.getElementById(`cancelEmpresaBtn_${empresaId}`);

    if (editBtn) editBtn.style.display = 'inline-block';
    if (saveBtn) saveBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

function excluirEmpresa(empresaId){
    if (confirm("Deseja realmente excluir esta Empresa?")) {
        fetch(`/empresas/deletar/${empresaId}`, {
            method: "DELETE"
        }).then(function (resposta) {
            if (resposta.ok) {
                alert("Funcionário excluído com sucesso!");
                listarEmpresas();
            } else {
                resposta.text().then(function (texto) {
                    console.error(texto);
                });
            }
        }).catch(function (erro) {
            console.log("Erro na requisição de exclusão:", erro);
        });
    }
}

function salvarEmpresa(empresaId) {
    const novaEmpresa = {
        nomeFantasia: document.getElementById(`nome_${empresaId}Input`).value,
        razaoSocial: document.getElementById(`razao_${empresaId}Input`).value,
        representante: document.getElementById(`representante_${empresaId}Input`).value,
        cnpj: document.getElementById(`cnpj_${empresaId}Input`).value,
        cep: document.getElementById(`cep_${empresaId}Input`).value,
        logradouro: document.getElementById(`logradouro_${empresaId}Input`).value,
        numero: document.getElementById(`numero_${empresaId}Input`).value,
        complemento: document.getElementById(`complemento_${empresaId}Input`).value,
    };

    fetch(`/admin/atualizar/${empresaId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaEmpresa)
    }).then(res => {
        if (res.ok) {
            alert("Empresa cadastrada com sucesso!");
            listarEmpresas();
            dialogCadastrarEmpresa.close();
        } else {
            res.text().then(texto => console.error("Erro:", texto));
        }
    }).catch(err => {
        console.error("Erro na requisição:", err);
    });
}

function mostrarFuncionarios(empresaId) {
    empresaSelecionadaId = empresaId
    tabelaFuncionarios.innerHTML = '';

    fetch(`/funcionarios/listar/${empresaId}`, {
        method: "GET"
    }).then(function (resposta) {
        if (resposta.ok && resposta.status == 200) {

            resposta.json().then(function (funcionariosEmpresa) {
                funcionariosEmpresa.forEach(funcionario => {
                    const row = tabelaFuncionarios.insertRow();
                    row.innerHTML = `
                        <td>${funcionario.idFuncionario}</td>
                        <td>
                            <span id="func_nome_${funcionario.idFuncionario}">${funcionario.nome}</span>
                            <input type="text" id="func_nome_${funcionario.idFuncionario}Input" class="input-edit" value="${funcionario.nome}" style="display:none;">
                        </td>
                        <td>
                            <span id="func_cpf_${funcionario.idFuncionario}">${funcionario.cpf}</span>
                            <input type="text" id="func_cpf_${funcionario.idFuncionario}Input" class="input-edit" value="${funcionario.cpf}" style="display:none;">
                        </td>
                        <td>
                            <span id="func_celular_${funcionario.idFuncionario}">${funcionario.celular}</span>
                            <input type="text" id="func_celular_${funcionario.idFuncionario}Input" class="input-edit" value="${funcionario.celular}" style="display:none;">
                        </td>
                        <td>
                            <span id="func_email_${funcionario.idFuncionario}">${funcionario.email}</span>
                            <input type="email" id="func_email_${funcionario.idFuncionario}Input" class="input-edit" value="${funcionario.email}" style="display:none;">
                        </td>
                        <td>
                            <span id="func_senha_${funcionario.idFuncionario}">${funcionario.senha}</span>
                            <input type="password" id="func_senha_${funcionario.idFuncionario}Input" class="input-edit" value="${funcionario.senha}" style="display:none;">
                        </td>
                        <td>
                            <span id="func_select_${funcionario.idFuncionario}">${funcionario.isGerente == 1 ? "Sim" : "Não"}</span>

                            <select id="func_select_${funcionario.idFuncionario}Input" class="input-edit" style="display:none;">
                                <option value="0" ${funcionario.isGerente == 0 ? 'selected' : ''}>Não</option>
                                <option value="1" ${funcionario.isGerente == 1 ? 'selected' : ''}>Sim</option>
                            </select>
                        </td>
                        <td>
                            <button id="editBtn_${funcionario.idFuncionario}" class="edit-btn" onclick="editarFuncionario(${funcionario.idFuncionario})">Editar</button>
                            <button id="saveBtn_${funcionario.idFuncionario}" class="save-btn" onclick="salvarFuncionario(${empresaId}, ${funcionario.idFuncionario})" style="display: none;">Salvar</button>
                            <button class="delete-btn" onclick="excluirFuncionario(${empresaId}, ${funcionario.idFuncionario})">Excluir</button>
                            <button id="cancelBtn_${funcionario.idFuncionario}" class="cancel-btn" onclick="cancelarEdicaoFuncionario(${funcionario.idFuncionario})" style="display: none;">Cancelar</button>
                        </td>
                    `;

                });

                funcionariosSection.style.display = 'block';
            });
        } else {
            tabelaFuncionarios.innerHTML = `
                        Nenhum funcionario encontrado para essa empresa
                    `;
            funcionariosSection.style.display = 'block';
        }
    }).catch(function (erro) {
        console.log("Erro na requisição de funcionários:", erro);
    });
}

function editarFuncionario(funcionarioId) {
    const cancelBtn = document.getElementById(`cancelBtn_${funcionarioId}`);
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    document.querySelectorAll('.input-edit').forEach(input => {
        input.style.display = 'none';
    });
    document.querySelectorAll('span[id^="func_"]').forEach(span => {
        span.style.display = 'inline-block';
    });

    document.querySelectorAll('button[id^="editBtn_"]').forEach(btn => {
        btn.style.display = 'inline-block';
    });
    
    document.querySelectorAll('button[id^="saveBtn_"]').forEach(btn => {
        btn.style.display = 'none';
    });

    const campos = ["nome", "cpf", "celular", "email", "senha", "select"];
    campos.forEach(campo => {
        const span = document.getElementById(`func_${campo}_${funcionarioId}`);
        const input = document.getElementById(`func_${campo}_${funcionarioId}Input`);

            if (span && input) {
                span.style.display = 'none';
                input.style.display = 'inline-block';
            }
        
    });

    const editBtn = document.getElementById(`editBtn_${funcionarioId}`);
    const saveBtn = document.getElementById(`saveBtn_${funcionarioId}`);

    if (editBtn && saveBtn) {
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    }
}

function cancelarEdicaoFuncionario(funcionarioId) {
    const campos = ["nome", "cpf", "celular", "email", "senha","select"];
    campos.forEach(campo => {
        const span = document.getElementById(`func_${campo}_${funcionarioId}`);
        const input = document.getElementById(`func_${campo}_${funcionarioId}Input`);
        if (span && input) {
            input.value = span.textContent;
            input.style.display = 'none';
            span.style.display = 'inline';
        }
    });
    
    const editBtn = document.getElementById(`editBtn_${funcionarioId}`);
    const saveBtn = document.getElementById(`saveBtn_${funcionarioId}`);
    const cancelBtn = document.getElementById(`cancelBtn_${funcionarioId}`);
    
    if (editBtn) editBtn.style.display = 'inline-block';
    if (saveBtn) saveBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

function salvarFuncionario(idEmpresa,funcionarioId) {
    const nome = document.getElementById(`func_nome_${funcionarioId}Input`).value;
    const cpf = document.getElementById(`func_cpf_${funcionarioId}Input`).value;
    const celular = document.getElementById(`func_celular_${funcionarioId}Input`).value;
    const email = document.getElementById(`func_email_${funcionarioId}Input`).value;
    const senha = document.getElementById(`func_senha_${funcionarioId}Input`).value;
    const isGerente = document.getElementById(`func_select_${funcionarioId}Input`).value;

    const funcionarioAtualizado = {
        nome,
        cpf,
        celular,
        email,
        senha,
        isGerente
    };

    fetch(`/funcionarios/atualizar/${funcionarioId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(funcionarioAtualizado)
    }).then(function (resposta) {
        if (resposta.ok) {
            mostrarFuncionarios(idEmpresa)
            document.getElementById(`saveBtn_${funcionarioId}`).style.display = 'none';
            alert("Funcionário atualizado com sucesso!");
        } else {
            resposta.text().then(function (texto) {
                console.error(texto);
                alert("Erro ao atualizar funcionário: " + texto);
            });
        }
    }).catch(function (erro) {
        console.log("Erro na requisição de atualização:", erro);
    });
}

function excluirFuncionario(empresaId, funcionarioId) {
    if (confirm("Deseja realmente excluir este funcionário?")) {
        fetch(`/funcionarios/deletar/${funcionarioId}`, {
            method: "DELETE"
        }).then(function (resposta) {
            if (resposta.ok) {
                alert("Funcionário excluído com sucesso!");
                mostrarFuncionarios(empresaId);
            } else {
                resposta.text().then(function (texto) {
                    console.error(texto);
                });
            }
        }).catch(function (erro) {
            console.log("Erro na requisição de exclusão:", erro);
        });
    }
}

function cadastrarFuncionario() {
    const nome = document.getElementById('cadastroNomeInput').value;
    const cpf = document.getElementById('cadastroCpfInput').value;
    const celular = document.getElementById('cadastroCelularInput').value;
    const email = document.getElementById('cadastroEmailInput').value;
    const senha = document.getElementById('cadastroSenhaInput').value;
    const gerente = document.getElementById('cadastroGerenteInput').value;
    const idEmpresa = parseInt(document.getElementById('inputEmpresaIdFuncionario').value)


    console.log(nome)
    if (!nome || !cpf || !celular || !email || !senha) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const dadosCriacao = {
        idEmpresa,
        nome,
        cpf,
        celular,
        email,
        senha,
        gerente
    };

    fetch(`/funcionarios/cadastrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosCriacao)
        })
        .then(resposta => {
            if (resposta.ok) {
                alert("Perfil criado com sucesso!");
                document.getElementById('formCadastro').reset();

                dialogCadastrarFuncionario.close();

                mostrarFuncionarios(idEmpresa)
            } else if (resposta.status === 409) {
                alert("Este e-mail ou CPF já está cadastrado.");
            } else {
                throw `Erro ao criar: ${resposta.status}`;
            }
        })
        .catch(erro => {
            console.error("Erro ao criar perfil:", erro);
            alert("Erro inesperado ao criar o perfil.");
        });
}

cadastrarFuncionarioBtn.addEventListener('click', () => {
    if (empresaSelecionadaId) {
        document.getElementById('inputEmpresaIdFuncionario').value = empresaSelecionadaId;
        dialogCadastrarFuncionario.showModal();
    } else {
        alert("Selecione uma empresa primeiro.");
    }
});

document.getElementById('cancelarCadastroFuncionario').addEventListener('click', () => {
    dialogCadastrarFuncionario.close();
});

listarEmpresas();