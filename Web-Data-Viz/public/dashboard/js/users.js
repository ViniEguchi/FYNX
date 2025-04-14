window.onload = () => {
    const isGerente = sessionStorage.getItem("IS_GERENTE");

    if (isGerente !== "1") {
        
        window.location.href = "/pagina-nao-autorizada.html";
        
    }
};

function makeEditable(fieldId, idSufixo) {
    setTimeout(() => {
        const span = document.getElementById(fieldId);
        const input = document.getElementById(fieldId + 'Input');
        const saveBtn = document.getElementById(`saveBtn_${idSufixo}`);

        if (!span || !input || !saveBtn) {
            console.warn(`Elementos não encontrados para: ${fieldId}`);
            return;
        }

        span.addEventListener('click', () => {
            span.style.display = 'none';
            input.style.display = 'block';
            input.focus();
        });

        input.addEventListener('input', () => {
            saveBtn.style.display = 'block';
        });

        input.addEventListener('blur', () => {
            span.textContent = input.value;
            span.style.display = 'block';
            input.style.display = 'none';

            if (fieldId.startsWith(`senha_`)) {
                span.textContent = '•'.repeat(input.value.length);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }, 0); // delay pra garantir que os elementos existam
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

function criarCardPerfil(func) {
    const idSufixo = func.idFuncionario;
    const container = document.getElementById("profile-card-row");

    const cardHTML = `
        <div class="profile-card">
            ${criarCampoUsuario("Nome", `nome_${idSufixo}`, "text", func.nome)}
            ${criarCampoUsuario("CPF", `cpf_${idSufixo}`, "text", func.cpf)}
            ${criarCampoUsuario("Celular", `celular_${idSufixo}`, "text", func.celular)}
            ${criarCampoUsuario("Email", `email_${idSufixo}`, "email", func.email)}
            ${criarCampoUsuario("Senha", `senha_${idSufixo}`, "password", func.senha, true)}
            ${criarCampoSelect("Gerente", `gerente_${idSufixo}`, func.isGerente)}
            <button id="saveBtn_${idSufixo}" class="save-btn" onclick="salvarPerfil(${func.idFuncionario})" style="display:none;">Salvar</button>
            <button class="delete-btn" onclick="excluirPerfil(${func.idFuncionario})">Excluir Perfil</button>
        </div>
    `;

    container.innerHTML += cardHTML;

    // Ativa edição nos campos
    ["nome", "cpf", "celular", "email", "senha"].forEach(campo => {
        makeEditable(`${campo}_${idSufixo}`, idSufixo);
    });

    const selectGerente = document.getElementById(`gerente_${idSufixo}Input`);
    const saveBtn = document.getElementById(`saveBtn_${idSufixo}`);

    selectGerente.addEventListener('change', () => {
        saveBtn.style.display = 'block';
    });
}

// FUNÇÃO PRINCIPAL

function carregarPerfil() {
    fetch(`/funcionarios/listar/${sessionStorage.ID_EMPRESA}`).then(function (resposta) {
        if (resposta.ok) {
            if (resposta.status === 204) {
                const feed = document.getElementById("profile-card-row");
                const mensagem = document.createElement("span");
                mensagem.innerHTML = "Nenhum resultado encontrado.";
                feed.appendChild(mensagem);
                throw "Nenhum resultado encontrado!";
            }

            resposta.json().then(function (funcionarios) {
                const container = document.getElementById("profile-card-row");
                container.innerHTML = ""; // Limpa antes de renderizar

                funcionarios.forEach(func => criarCardPerfil(func));
            });
        }
    });
}

// SALVAR / EXCLUIR PERFIL

function salvarPerfil(idFuncionario) {
    const dadosAtualizados = {
        nome: document.getElementById(`nome_${idFuncionario}Input`).value,
        cpf: document.getElementById(`cpf_${idFuncionario}Input`).value,
        celular: document.getElementById(`celular_${idFuncionario}Input`).value,
        email: document.getElementById(`email_${idFuncionario}Input`).value,
        senha: document.getElementById(`senha_${idFuncionario}Input`).value,
        gerente: document.getElementById(`gerente_${idFuncionario}Input`).value
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

// CADASTRO

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

// FORMULÁRIO MODAL

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