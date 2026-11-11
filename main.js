import produtos from "./banco.js";
import { SistemaLogin } from "./script.js";

// EXIBIÇÃO DOS PRODUTOS
const listaProdutos = document.getElementById("lista-produtos");

produtos.forEach(produto => {

    const card = document.createElement("div");
    card.classList.add("produto");

    card.innerHTML = `
        <h3>${produto.nome}</h3>
        <p>${produto.categoria}</p>
        <strong>R$ ${produto.preco.toFixed(2)}</strong>
        <button>Adicionar</button>
    `;

    listaProdutos.appendChild(card);
});

// SISTEMA DE LOGIN
const sistemaLogin = new SistemaLogin();

// Elementos do HTML
const areaUsuario = document.getElementById("area-usuario");
const conteudoPrincipal = document.getElementById("conteudo-principal");
const boasVindas = document.getElementById("boas-vindas");
const nomeCliente = document.getElementById("nome-cliente");
const telaLogin = document.getElementById("tela-login");
const telaCadastro = document.getElementById("tela-cadastro");

// Botões
const btnLogin = document.getElementById("btn-login");
const btnIrCadastro = document.getElementById("btn-ir-cadastro");
const btnIrLogin = document.getElementById("btn-ir-login");
const btnVoltarLogin = document.getElementById("btn-voltar-login");

// Formulários
const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");

// Mostrar página inicial
function mostrarInicio() {
    telaLogin.hidden = true;
    telaCadastro.hidden = true;
    conteudoPrincipal.hidden = false;
    boasVindas.hidden = true;
}

// Abrir tela de login
btnLogin.addEventListener("click", () => {
    conteudoPrincipal.hidden = true;
    telaCadastro.hidden = true;
    telaLogin.hidden = false;
});

// Abrir tela de cadastro
btnIrCadastro.addEventListener("click", () => {
    telaLogin.hidden = true;
    telaCadastro.hidden = false;
});

// Voltar para o login
btnIrLogin.addEventListener("click", () => {
    telaCadastro.hidden = true;
    telaLogin.hidden = false;
});

// Voltar para a página inicial
btnVoltarLogin.addEventListener("click", mostrarInicio);

// Atualizar interface após login
function atualizarUsuario(cliente) {
    telaLogin.hidden = true;
    telaCadastro.hidden = true;
    conteudoPrincipal.hidden = false;
    boasVindas.hidden = false;

    nomeCliente.textContent = cliente.nome;

    // Atualiza o cabeçalho
    areaUsuario.replaceChildren();

    const nome = document.createElement("span");
    nome.textContent = cliente.nome;

    const btnSair = document.createElement("button");
    btnSair.textContent = "Sair";

    btnSair.addEventListener("click", () => {
        sistemaLogin.logout();

        areaUsuario.replaceChildren();

        const btnEntrar = document.createElement("button");
        btnEntrar.textContent = "Entrar";

        btnEntrar.addEventListener("click", () => {
            conteudoPrincipal.hidden = true;
            telaLogin.hidden = false;
        });

        areaUsuario.appendChild(btnEntrar);

        mostrarInicio();
    });

    areaUsuario.appendChild(nome);
    areaUsuario.appendChild(btnSair);
}

// CADASTRO
formCadastro.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome-cadastro").value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;

    const cadastrado = sistemaLogin.cadastrarUsuario(
        nome, email, senha
    );

    if (cadastrado) {
        sistemaLogin.autenticarUsuario(email, senha);

        atualizarUsuario(sistemaLogin.clienteLogado);

        formCadastro.reset();

        alert("Cadastro realizado com sucesso!");
    } else {
        alert("Este e-mail já está cadastrado.");
    }
});


// LOGIN
formLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    const autenticado = sistemaLogin.autenticarUsuario(
        email, senha
    );

    if (autenticado) {
        atualizarUsuario(sistemaLogin.clienteLogado);

        formLogin.reset();
    } else {
        alert("E-mail ou senha incorretos.");
    }
});