
import produtos from "./banco.js";
import { SistemaLogin } from "./script.js";

const listaMaisVendidos = document.getElementById("lista-mais-vendidos");
const secaoMaisVendidos = document.getElementById("secao-mais-vendidos");
const tituloProdutos = secaoMaisVendidos.querySelector("h2");

const botoesCategorias = document.querySelectorAll(".categoria");
const btnVoltarCategorias = document.getElementById("btn-voltar-categorias");

const campoPesquisa = document.getElementById("campo-pesquisa");
const btnPesquisa = document.getElementById("btn-pesquisa");

const nomesMaisVendidos = [
    "Coxinha",
    "Misto Quente",
    "Brownie",
    "Brigadeiro",
    "Café expresso",
    "Achocolatado"
];

const produtosMaisVendidos = nomesMaisVendidos
    .map(nome => produtos.find(produto =>
        produto.nome.toLowerCase() === nome.toLowerCase()
    ))
    .filter(produto => produto !== undefined);

// CRIAR CARD DOS PRODUTOS

function criarCard(produto) {
    const card = document.createElement("div");
    card.classList.add("produto");

    card.innerHTML = `
        <h3>${produto.nome}</h3>
        <p>${produto.categoria}</p>
        <strong>R$ ${produto.preco.toFixed(2).replace(".", ",")}</strong>
        <button type="button">Adicionar</button>
    `;

    return card;
}

// MOSTRAR PRODUTOS

function mostrarProdutos(lista) {
    listaMaisVendidos.replaceChildren();

    if (lista.length === 0) {
        listaMaisVendidos.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    lista.forEach(produto => {
        listaMaisVendidos.appendChild(criarCard(produto));
    });
}

// VOLTAR PARA A PÁGINA INICIAL

function mostrarInicioCategorias() {
    secaoMaisVendidos.hidden = false;

    tituloProdutos.textContent = "Mais vendidos";

    btnVoltarCategorias.hidden = true;

    mostrarProdutos(produtosMaisVendidos);

    botoesCategorias.forEach(botao => {
        botao.classList.remove("categoria-ativa");
    });

    campoPesquisa.value = "";
}

// INICIAR SITE

mostrarInicioCategorias();

// FILTRAR CATEGORIAS

botoesCategorias.forEach(botao => {
    botao.addEventListener("click", () => {
        const categoriaSelecionada = botao.dataset.categoria;

        const produtosFiltrados = produtos.filter(produto =>
            produto.categoria === categoriaSelecionada
        );

        const nomeCategoria =
            categoriaSelecionada === "Salgado" ? "Salgados" :
            categoriaSelecionada === "Doce" ? "Doces" :
            "Bebidas";

        tituloProdutos.textContent = nomeCategoria;

        btnVoltarCategorias.hidden = false;

        campoPesquisa.value = "";

        mostrarProdutos(produtosFiltrados);

        botoesCategorias.forEach(item => {
            item.classList.remove("categoria-ativa");
        });

        botao.classList.add("categoria-ativa");
    });
});

// BOTÃO DE VOLTAR

btnVoltarCategorias.addEventListener("click", () => {
    mostrarInicioCategorias();
});

// PESQUISA

function pesquisarProdutos() {
    const pesquisa = campoPesquisa.value.toLowerCase().trim();

    const encontrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(pesquisa) ||
        produto.categoria.toLowerCase().includes(pesquisa)
    );

    tituloProdutos.textContent = "Resultado da pesquisa";

    btnVoltarCategorias.hidden = false;

    mostrarProdutos(encontrados);

    botoesCategorias.forEach(botao => {
        botao.classList.remove("categoria-ativa");
    });
}

btnPesquisa.addEventListener("click", pesquisarProdutos);

campoPesquisa.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        pesquisarProdutos();
    }
});

// LOGIN

const sistemaLogin = new SistemaLogin();

const areaUsuario = document.getElementById("area-usuario");
const conteudoPrincipal = document.getElementById("conteudo-principal");
const boasVindas = document.getElementById("boas-vindas");
const nomeCliente = document.getElementById("nome-cliente");

const telaLogin = document.getElementById("tela-login");
const telaCadastro = document.getElementById("tela-cadastro");

const linkInicio = document.getElementById("link-inicio");
const btnLogin = document.getElementById("btn-login");
const btnIrCadastro = document.getElementById("btn-ir-cadastro");
const btnIrLogin = document.getElementById("btn-ir-login");
const btnVoltarLogin = document.getElementById("btn-voltar-login");

const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");

// MOSTRAR INÍCIO

function voltarParaInicio() {
    telaLogin.hidden = true;
    telaCadastro.hidden = true;
    conteudoPrincipal.hidden = false;
    boasVindas.hidden = true;

    mostrarInicioCategorias();
}

linkInicio.addEventListener("click", event => {
    event.preventDefault();
    voltarParaInicio();
});

// ABRIR LOGIN

btnLogin.addEventListener("click", () => {
    conteudoPrincipal.hidden = true;
    telaCadastro.hidden = true;
    telaLogin.hidden = false;
});

// ABRIR CADASTRO

btnIrCadastro.addEventListener("click", () => {
    telaLogin.hidden = true;
    telaCadastro.hidden = false;
});

// VOLTAR PARA LOGIN

btnIrLogin.addEventListener("click", () => {
    telaCadastro.hidden = true;
    telaLogin.hidden = false;
});

// VOLTAR DA TELA DE LOGIN

btnVoltarLogin.addEventListener("click", voltarParaInicio);

// ATUALIZAR USUÁRIO

function atualizarUsuario(cliente) {
    telaLogin.hidden = true;
    telaCadastro.hidden = true;
    conteudoPrincipal.hidden = false;
    boasVindas.hidden = false;

    nomeCliente.textContent = cliente.nome;

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

        voltarParaInicio();
    });

    areaUsuario.appendChild(nome);
    areaUsuario.appendChild(btnSair);
}

// CADASTRAR USUÁRIO

formCadastro.addEventListener("submit", event => {
    event.preventDefault();

    const nome = document.getElementById("nome-cadastro").value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;

    const cadastrado = sistemaLogin.cadastrarUsuario(nome, email, senha);

    if (cadastrado) {
        sistemaLogin.autenticarUsuario(email, senha);

        atualizarUsuario(sistemaLogin.clienteLogado);

        formCadastro.reset();

        alert("Cadastro realizado com sucesso!");
    } else {
        alert("Este e-mail já está cadastrado.");
    }
});

// FAZER LOGIN

formLogin.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    const autenticado = sistemaLogin.autenticarUsuario(email, senha);

    if (autenticado) {
        atualizarUsuario(sistemaLogin.clienteLogado);

        formLogin.reset();
    } else {
        alert("E-mail ou senha incorretos.");
    }
});
