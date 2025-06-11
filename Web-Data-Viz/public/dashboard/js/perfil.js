usuario.innerHTML = sessionStorage.NOME_USUARIO;

const tipoUsuario = sessionStorage.IS_GERENTE; 
const paginaAtual = window.location.pathname;  

const optionsContainer = document.querySelector('.options');

optionsContainer.innerHTML = `
<div class="option ${paginaAtual.includes('home.html') ? 'selected' : ''}">
<img src="../assets/icon/home 3.png" alt="">
<a href="../dashboard/home.html">HOME</a>
</div>
<div class="option ${paginaAtual.includes('dashboard.html') ? 'selected' : ''}">
<img src="../assets/icon/bar-chart 4.png" alt="">
<a href="../dashboard/dashboard.html">DASHBOARD</a>
</div>
${tipoUsuario == 0 ? `
<div class="option ${paginaAtual.includes('users.html') ? 'selected' : ''}">
<img src="../assets/icon/user (1) 2.png" alt="">
<a href="../dashboard/users.html">USUÁRIOS</a>
</div>
` : ''}
<div class="option ${paginaAtual.includes('perfil.html') ? 'selected' : ''}">
          <img src="../assets/icon/edit (1) 1.png" alt="">
<a href="../dashboard/perfil.html">EDITAR</a>
</div>
<div class="option ${paginaAtual.includes('mensagens.html') ? 'selected' : ''} ">
        <img style="filter: invert(1);" src="../assets/icon/mail-icon.png" alt="">
        <a href="../dashboard/mensagens.html">MENSAGENS</a>
      </div>
<div class="option">
<img src="../assets/icon/logout 2.png" alt="">
<a href="../index.html">SAIR</a>
</div>
`;

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
                
                let camposUsuarioComum = `
                    ${criarCampoPerfil("Nome", "nome", "text", resposta.nome)}
                    ${criarCampoPerfil("CPF", "cpf", "text", resposta.cpf)}
                    ${criarCampoPerfil("Celular", "celular", "text", resposta.celular)}
                    ${criarCampoPerfil("Email", "email", "email", resposta.email)}
                    ${criarCampoPerfil("Senha", "senha", "password", resposta.senha, true)}                  
                `;

                let camposUsuarioAdmin = `
                    ${camposUsuarioComum}
                    ${criarCampoPerfil("Nome Fantasia", "nome_fantasia", "text", resposta.nome_fantasia)}
                    ${criarCampoPerfil("Razão Social", "razao_social", "text", resposta.razao_social)}
                    ${criarCampoPerfil("Representante Legal", "representante_legal", "text", resposta.representante_legal)}
                    ${criarCampoPerfil("CNPJ", "cnpj", "text", resposta.cnpj)}
                    ${criarCampoPerfil("CEP", "cep", "text", resposta.cep)}
                    ${criarCampoPerfil("Logradouro", "logradouro", "text", resposta.logradouro)}
                    ${criarCampoPerfil("Número", "numero", "text", resposta.numero)}
                    ${criarCampoPerfil("Complemento", "complemento", "text", resposta.complemento)}
                `
                
                let htmlCampos = `
                  <div class="campos">
                    ${camposUsuarioComum}
                  </div>
                `;

                if (tipoUsuario == 0) {
                    htmlCampos = `
                    <div class="campos">
                        ${camposUsuarioAdmin}
                    </div>  
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
                if (tipoUsuario == 0) {
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

    if (tipoUsuario == 0) {
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
