
window.onload = () => {
    const isGerente = sessionStorage.getItem("IS_GERENTE");

    if (isGerente !== "1") {
        
        window.location.href = "/pagina-nao-autorizada.html";
        
    }
};


function carregarPerfil() {
    fetch(`/funcionarios/listar/${sessionStorage.ID_EMPRESA}`).then(function (resposta) {
        if (resposta.ok) {
            if (resposta.status === 204) {
                const feed = document.getElementById("tabelaUsuariosBody");
                const mensagem = document.createElement("span");
                mensagem.innerHTML = "Nenhum resultado encontrado.";
                feed.appendChild(mensagem);
                throw "Nenhum resultado encontrado!";
            }

            resposta.json().then(function (funcionarios) {
                const container = document.getElementById("tabelaUsuariosBody");
                container.innerHTML = "";

                funcionarios.forEach(func => criarCardPerfil(func));
            });
        }
    });
}

function criarCardPerfil(func) {
    const id = func.idFuncionario;
    const tbody = document.getElementById("tabelaUsuariosBody");

    const linhaHTML = `
        <tr id="linha_${id}">
            <td>
                <span id="nome_${id}" class="editable">${func.nome}</span>
                <input type="text" id="nome_${id}Input" class="input-edit" value="${func.nome}" style="display:none;">
            </td>
            <td>
                <span id="cpf_${id}" class="editable">${func.cpf}</span>
                <input type="text" id="cpf_${id}Input" class="input-edit" value="${func.cpf}" style="display:none;">
            </td>
            <td>
                <span id="celular_${id}" class="editable">${func.celular}</span>
                <input type="text" id="celular_${id}Input" class="input-edit" value="${func.celular}" style="display:none;">
            </td>
            <td>
                <span id="email_${id}" class="editable">${func.email}</span>
                <input type="email" id="email_${id}Input" class="input-edit" value="${func.email}" style="display:none;">
            </td>
            <td>
                <span id="senha_${id}" class="editable">${'•'.repeat(func.senha.length)}</span>
                <input type="password" id="senha_${id}Input" class="input-edit" value="${func.senha}" style="display:none;">
            </td>
            <td>
                <span id="gerente_${id}" class="editable">${func.isGerente == 0 ? 'Não' : 'Sim'}</span>
                <select id="gerente_${id}Input" class="input-edit">
                    <option value="0" ${func.isGerente == 0 ? 'selected' : ''}>Não</option>
                    <option value="1" ${func.isGerente == 1 ? 'selected' : ''}>Sim</option>
                </select>
            </td>
            <td class="acoes-coluna">
                <div class="acoes-wrapper">
                    <img src="../assets/icon/recycle-bin 1.png" alt="excluir" class="icon" onclick="excluirPerfil(${id})">
                    <button id="saveBtn_${id}" class="save-btn" onclick="salvarPerfil(${id})">Salvar</button>
                </div>
            </td>
        </tr>
    `;

    tbody.innerHTML += linhaHTML;

    setTimeout(() => {
        ["nome", "cpf", "celular", "email", "senha","gerente"].forEach(campo => {
            makeEditable(`${campo}_${id}`, id);
        });
    }, 0);

    const select = document.getElementById(`gerente_${id}Input`);
    select.addEventListener("change", () => salvarPerfil(id));
}

function criarCampoUsuario(label, id, tipo = "text", valor = "", mascarar = false) {
    const valorSpan = mascarar ? '•'.repeat(valor.length) : valor;
    return `
    <div class="field-group fieldGroupRow">
        <label class="label">${label}</label>
        <span id="${id}" class="editable">${valorSpan}</span>
        <input type="${tipo}" id="${id}Input" class="input-edit" value="${valor}" style="display:none;">
    </div>
    `;
}

function criarCampoSelect(label, id, valorAtual) {
    return `
    <div class="field-group fieldGroupRow">
        <label class="label">${label}</label>
        <select id="${id}Input" class="input-edit">
            <option value="0" ${valorAtual == 0 ? 'selected' : ''}>Não</option>
            <option value="1" ${valorAtual == 1 ? 'selected' : ''}>Sim</option>
        </select>
    </div>
    `;
}

function makeEditable(fieldId, idSufixo) {
    setTimeout(() => {
        const span = document.getElementById(fieldId);
        const input = document.getElementById(fieldId + 'Input');
        const saveBtn = document.getElementById(`saveBtn_${idSufixo}`);

        if (!span || !input || !saveBtn) {
            console.warn(`Elementos não encontrados para: ${fieldId}`);
            return;
        }

        // const isSelect = input.tagName === 'SELECT';
        // if (isSelect) {
        //     input.addEventListener('change', () => {
        //         const selectedText = input.options[input.selectedIndex].text;
        //         span.textContent = selectedText;
        //         span.style.display = 'block';
        //         input.style.display = 'none';
        //         saveBtn.style.display = 'block';
        //     });
        // }


        span.addEventListener('click', () => {
            span.style.display = 'none';
            input.style.display = 'block';
            input.focus();
        });

        input.addEventListener('input', () => {
            saveBtn.style.display = 'block';
        });

        input.addEventListener('blur', () => {
            if (input.tagName === 'SELECT') {
                span.textContent = input.options[input.selectedIndex].text;
            } else if (fieldId.startsWith(`senha_`)) {
                span.textContent = '•'.repeat(input.value.length);
            } else {
                span.textContent = input.value;
            }

            span.style.display = 'block';
            input.style.display = 'none';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }, 0);
}

function salvarPerfil(idFuncionario) {
    const dadosAtualizados = {
        nome: document.getElementById(`nome_${idFuncionario}Input`).value,
        cpf: document.getElementById(`cpf_${idFuncionario}Input`).value,
        celular: document.getElementById(`celular_${idFuncionario}Input`).value,
        email: document.getElementById(`email_${idFuncionario}Input`).value,
        senha: document.getElementById(`senha_${idFuncionario}Input`).value,
        isGerente: document.getElementById(`gerente_${idFuncionario}Input`).value
    };


    fetch(`/funcionarios/atualizar/${idFuncionario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(resposta => {
        if (resposta.ok) {
            alert("Perfil atualizado com sucesso!");
            document.getElementById(`saveBtn_${idFuncionario}`).style.display = 'none';
            carregarPerfil()
        } else if (resposta.status === 404) {
            alert("Usuário não encontrado.");
        } else {
            throw `Erro ao atualizar: ${resposta.status}`;
        }
    })
    .catch(erro => {
        console.error("Erro ao atualizar perfil:", erro);
    });
}

function excluirPerfil(idFuncionario) {
    if (confirm("Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita.")) {
        fetch(`/funcionarios/deletar/${idFuncionario}`, {
            method: "DELETE"
        })
        .then(resposta => {
            if (resposta.ok) {
                alert("Perfil excluído com sucesso.");
                carregarPerfil(); // Recarrega lista
            } else {
                alert("Erro ao excluir perfil.");
            }
        })
        .catch(erro => {
            console.error("Erro ao excluir perfil:", erro);
        });
    }
}

function cadastrar() {
    const nome = document.getElementById('cadastroNomeInput').value;
    const cpf = document.getElementById('cadastroCpfInput').value;
    const celular = document.getElementById('cadastroCelularInput').value;
    const email = document.getElementById('cadastroEmailInput').value;
    const senha = document.getElementById('cadastroSenhaInput').value;
    const gerente = document.getElementById('cadastroGerenteInput').value;
    const idEmpresa = sessionStorage.ID_EMPRESA;

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
            fecharFormulario();
            carregarPerfil();
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

function abrirFormulario() {
    const dialog = document.getElementById('formDialog');
    dialog.showModal();
}

function fecharFormulario() {
    const dialog = document.getElementById('formDialog');
    dialog.close();
}

function salvarCadastro() {
    cadastrar();
}

carregarPerfil()