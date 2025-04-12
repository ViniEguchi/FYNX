function carregarPerfil() {
    const tipoUsuario = sessionStorage.IS_GERENTE;

    fetch(`/usuarios/perfil/${sessionStorage.ID_USUARIO}`).then(function (resposta) {
        if (resposta.ok) {
            if (resposta.status == 204) {
                var feed = document.getElementById("profile-card");
                var mensagem = document.createElement("span");
                mensagem.innerHTML = "Nenhum resultado encontrado."
                feed.appendChild(mensagem);
                throw "Nenhum resultado encontrado!!";
            }

            resposta.json().then(function (resposta) {
                console.log("Dados recebidos: ", JSON.stringify(resposta));
                
                let htmlCampos = `
                  <h2>Perfil</h2>
                  ${criarCampoPerfil("Nome", "nome", "text", resposta.nome)}
                  ${criarCampoPerfil("CPF", "cpf", "text", resposta.cpf)}
                  ${criarCampoPerfil("Celular", "celular", "text", resposta.celular)}
                  ${criarCampoPerfil("Email", "email", "email", resposta.email)}
                  ${criarCampoPerfil("Senha", "senha", "password", resposta.senha, true)}
                `;

                if (tipoUsuario == 1) {
                    htmlCampos += `
                      ${criarCampoPerfil("Nome Fantasia", "nome_fantasia", "text", resposta.nome_fantasia)}
                      ${criarCampoPerfil("Razão Social", "razao_social", "text", resposta.razao_social)}
                      ${criarCampoPerfil("Representante Legal", "representante_legal", "text", resposta.representante_legal)}
                      ${criarCampoPerfil("CNPJ", "cnpj", "text", resposta.cnpj)}
                      ${criarCampoPerfil("CEP", "cep", "text", resposta.cep)}
                      ${criarCampoPerfil("Logradouro", "logradouro", "text", resposta.logradouro)}
                      ${criarCampoPerfil("Número", "numero", "text", resposta.numero)}
                      ${criarCampoPerfil("Complemento", "complemento", "text", resposta.complemento)}
                    `;
                }

                htmlCampos += `<button id="saveBtn" class="save-btn" onclick="salvarPerfil()">Salvar</button>`;
                document.getElementById("profile-card").innerHTML = htmlCampos;

                const camposComuns = ["nome", "cpf", "celular", "email", "senha"];
                const camposGerente = [
                    "nome_fantasia", "razao_social", "representante_legal", "cnpj",
                    "cep", "logradouro", "numero", "complemento"
                ];

                camposComuns.forEach(makeEditable);
                if (tipoUsuario == 1) {
                    camposGerente.forEach(makeEditable);
                }

                document.getElementById('saveBtn').addEventListener('click', () => {
                    alert('Dados salvos com sucesso!');
                    document.getElementById('saveBtn').style.display = 'none';
                });
            });
        }
    });
}

function makeEditable(fieldId) {
    const span = document.getElementById(fieldId);
    const input = document.getElementById(fieldId + 'Input');
    const saveBtn = document.getElementById('saveBtn');

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

        if (fieldId == "senha") {
            span.textContent = '•'.repeat(input.value.length);
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
}

function criarCampoPerfil(label, id, tipo = "text", valor = "", mascarar = false) {
    const valorSpan = mascarar ? '•'.repeat(valor.length) : valor;
    return `
    <div class="field-group">
      <label class="label">${label}</label>
      <span id="${id}" class="editable">${valorSpan}</span>
      <input type="${tipo}" id="${id}Input" class="input-edit" value="${valor}" style="display: none;">
    </div>
  `;
}

function salvarPerfil() {
    const tipoUsuario = sessionStorage.IS_GERENTE;

    const dadosAtualizados = {
        nome: document.getElementById('nomeInput').value,
        cpf: document.getElementById('cpfInput').value,
        celular: document.getElementById('celularInput').value,
        email: document.getElementById('emailInput').value,
        senha: document.getElementById('senhaInput').value,
    };

    if (tipoUsuario == 1) {
        Object.assign(dadosAtualizados, {
            nome_fantasia: document.getElementById('nome_fantasiaInput').value,
            razao_social: document.getElementById('razao_socialInput').value,
            representante_legal: document.getElementById('representante_legalInput').value,
            cnpj: document.getElementById('cnpjInput').value,
            cep: document.getElementById('cepInput').value,
            logradouro: document.getElementById('logradouroInput').value,
            numero: document.getElementById('numeroInput').value,
            complemento: document.getElementById('complementoInput').value
        });
    }

    fetch(`/usuarios/atualizar/${sessionStorage.ID_USUARIO}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(resposta => {
        if (resposta.ok) {
            alert("Perfil atualizado com sucesso!");
            document.getElementById('saveBtn').style.display = 'none';
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
