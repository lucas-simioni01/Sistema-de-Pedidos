
import produtos from "./banco.js";

import {
    SistemaLogin,
    Carrinho,
    Pedido,
    PagamentoPix,
    PagamentoCredito,
    PagamentoDebito,
    PagamentoBoleto
} from "./script.js";

// =====================================
// CARRINHO
// =====================================

const carrinho = new Carrinho();

let proximoNumeroPedido = 1;

const cabecalho = document.querySelector(".cabecalho");

const btnCarrinho = document.createElement("button");
btnCarrinho.type = "button";
btnCarrinho.classList.add("carrinho");
btnCarrinho.textContent = "Carrinho (0) - R$ 0,00";

const painelCarrinho = document.createElement("div");
painelCarrinho.classList.add("painel-carrinho");
painelCarrinho.hidden = true;

cabecalho.appendChild(btnCarrinho);
cabecalho.appendChild(painelCarrinho);

// =====================================
// MEUS PEDIDOS
// =====================================

const btnMeusPedidos = document.createElement("button");

btnMeusPedidos.type = "button";
btnMeusPedidos.textContent = "Meus pedidos";
btnMeusPedidos.classList.add("btn-meus-pedidos");

const painelPedidos = document.createElement("div");

painelPedidos.classList.add("painel-pedidos");
painelPedidos.hidden = true;

cabecalho.appendChild(btnMeusPedidos);
cabecalho.appendChild(painelPedidos);

// =====================================
// FORMATAR PREÇO
// =====================================

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// =====================================
// AVISO DE LOGIN
// =====================================

function mostrarAvisoLogin() {

    if (document.querySelector(".modal-login")) {
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal-login");

    modal.innerHTML = `
        <div class="conteudo-modal-login">

            <div class="icone-login-modal">
                <span>👤</span>
            </div>

            <h2>Entre na sua conta!</h2>

            <p>
                Para finalizar seu pedido, você precisa
                estar conectado à sua conta.
            </p>

            <button type="button" class="btn-ir-login-modal">
                Fazer login
            </button>

            <button type="button" class="btn-fechar-modal">
                Agora não
            </button>

        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".btn-ir-login-modal")
        .addEventListener("click", () => {

            modal.remove();

            painelCarrinho.hidden = true;
            painelPedidos.hidden = true;
            conteudoPrincipal.hidden = true;
            telaLogin.hidden = false;
        });

    modal.querySelector(".btn-fechar-modal")
        .addEventListener("click", () => {
            modal.remove();
        });

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// =====================================
// AVISO DE FORMA DE PAGAMENTO
// =====================================

function mostrarAvisoPagamento() {

    if (document.querySelector(".modal-pagamento")) {
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal-pagamento");

    modal.innerHTML = `
        <div class="conteudo-modal-pagamento">

            <div class="icone-pagamento-modal">
                <span>💳</span>
            </div>

            <h2>Escolha uma forma de pagamento</h2>

            <p>
                Para continuar com seu pedido, selecione
                uma das opções de pagamento disponíveis.
            </p>

            <button type="button" class="btn-entendi-pagamento">
                Entendi
            </button>

        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".btn-entendi-pagamento")
        .addEventListener("click", () => {
            modal.remove();
        });

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// =====================================
// TELA DE PEDIDO CONFIRMADO
// =====================================

function mostrarPedidoConfirmado(pedido, formaPagamento) {

    const nomesPagamento = {
        pix: "Pix",
        credito: "Cartão de crédito",
        debito: "Cartão de débito",
        boleto: "Boleto"
    };

    const modal = document.createElement("div");
    modal.classList.add("modal-pedido-confirmado");

    const conteudo = document.createElement("div");
    conteudo.classList.add("conteudo-pedido-confirmado");

    const icone = document.createElement("div");
    icone.classList.add("icone-pedido-confirmado");
    icone.textContent = "✓";

    const titulo = document.createElement("h2");
    titulo.textContent = "Pedido confirmado!";

    const mensagem = document.createElement("p");
    mensagem.textContent = "Seu pedido foi realizado com sucesso.";

    const numero = document.createElement("strong");
    numero.classList.add("numero-pedido");
    numero.textContent = `Pedido #${pedido.numero}`;

    const tituloItens = document.createElement("h3");
    tituloItens.textContent = "Resumo do pedido";

    const lista = document.createElement("div");
    lista.classList.add("lista-pedido-confirmado");

    pedido.itens.forEach(item => {

        const linha = document.createElement("div");
        linha.classList.add("linha-pedido-confirmado");

        const nome = document.createElement("span");

        nome.textContent =
            `${item.quantidade}x ${item.produto.nome}`;

        const subtotal = document.createElement("strong");

        subtotal.textContent =
            formatarPreco(item.calcular_subtotal());

        linha.appendChild(nome);
        linha.appendChild(subtotal);

        lista.appendChild(linha);
    });

    const pagamento = document.createElement("p");
    pagamento.classList.add("pagamento-confirmado");

    pagamento.textContent =
        `Pagamento: ${nomesPagamento[formaPagamento]}`;

    const total = document.createElement("div");
    total.classList.add("total-pedido-confirmado");

    total.textContent =
        `Total: ${formatarPreco(pedido.calcular_total())}`;

    const btnVoltar = document.createElement("button");

    btnVoltar.type = "button";
    btnVoltar.textContent = "Voltar ao cardápio";

    btnVoltar.classList.add("btn-voltar-cardapio");

    btnVoltar.addEventListener("click", () => {
        modal.remove();
    });

    conteudo.appendChild(icone);
    conteudo.appendChild(titulo);
    conteudo.appendChild(mensagem);
    conteudo.appendChild(numero);
    conteudo.appendChild(tituloItens);
    conteudo.appendChild(lista);
    conteudo.appendChild(pagamento);
    conteudo.appendChild(total);
    conteudo.appendChild(btnVoltar);

    modal.appendChild(conteudo);

    document.body.appendChild(modal);
}

// =====================================
// ATUALIZAR PAINEL MEUS PEDIDOS
// =====================================

function atualizarPainelPedidos() {

    painelPedidos.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = "Meus pedidos";

    painelPedidos.appendChild(titulo);

    const cliente = sistemaLogin.clienteLogado;

    if (!cliente || cliente.pedidos.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.textContent =
            "Você ainda não realizou nenhum pedido.";

        painelPedidos.appendChild(mensagem);

        return;
    }

    cliente.pedidos.slice().reverse().forEach(pedido => {

        const card = document.createElement("div");
        card.classList.add("card-meu-pedido");

        const numero = document.createElement("h4");

        numero.textContent = `Pedido #${pedido.numero}`;

        const status = document.createElement("p");

        status.textContent = `Status: ${pedido.status}`;

        const pagamento = document.createElement("p");

        const formas = {
            pix: "Pix",
            credito: "Cartão de crédito",
            debito: "Cartão de débito",
            boleto: "Boleto"
        };

        pagamento.textContent =
            `Pagamento: ${formas[pedido.formaPagamento] || "Não informado"}`;

        const lista = document.createElement("div");

        pedido.itens.forEach(item => {

            const produto = document.createElement("p");

            produto.textContent =
                `${item.quantidade}x ${item.produto.nome} - ` +
                formatarPreco(item.calcular_subtotal());

            lista.appendChild(produto);
        });

        const total = document.createElement("strong");

        total.textContent =
            `Total: ${formatarPreco(pedido.calcular_total())}`;

        card.appendChild(numero);
        card.appendChild(status);
        card.appendChild(pagamento);
        card.appendChild(lista);
        card.appendChild(total);

        painelPedidos.appendChild(card);
    });
}

// =====================================
// ATUALIZAR CARRINHO
// =====================================

function atualizarCarrinho() {

    const quantidade = carrinho.quantidadeTotal();
    const total = carrinho.calcularTotal();

    btnCarrinho.textContent =
        `Carrinho (${quantidade}) - ${formatarPreco(total)}`;

    painelCarrinho.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = "Meu carrinho";

    painelCarrinho.appendChild(titulo);

    // BOTÃO LIMPAR CARRINHO

    if (carrinho.itens.length > 0) {

        const btnLimpar = document.createElement("button");

        btnLimpar.type = "button";
        btnLimpar.textContent = "Limpar carrinho";
        btnLimpar.classList.add("btn-limpar-carrinho");

        btnLimpar.addEventListener("click", () => {
            carrinho.limparCarrinho();
            atualizarCarrinho();
        });

        painelCarrinho.appendChild(btnLimpar);
    }

    if (carrinho.itens.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.textContent = "Seu carrinho está vazio.";

        painelCarrinho.appendChild(mensagem);

        return;
    }

    carrinho.itens.forEach(item => {

        const linha = document.createElement("div");
        linha.classList.add("item-carrinho");

        const nome = document.createElement("strong");
        nome.textContent = item.produto.nome;

        const preco = document.createElement("span");

        preco.textContent =
            formatarPreco(item.produto.preco) + " cada";

        // CONTROLES DE QUANTIDADE

        const controles = document.createElement("div");

        controles.classList.add("controles-quantidade");

        const btnDiminuir = document.createElement("button");

        btnDiminuir.type = "button";
        btnDiminuir.textContent = "−";
        btnDiminuir.classList.add("btn-quantidade");

        const numero = document.createElement("span");

        numero.textContent = item.quantidade;

        const btnAumentar = document.createElement("button");

        btnAumentar.type = "button";
        btnAumentar.textContent = "+";
        btnAumentar.classList.add("btn-quantidade");

        btnDiminuir.addEventListener("click", () => {

            carrinho.alterarQuantidade(
                item.produto,
                item.quantidade - 1
            );

            atualizarCarrinho();
        });

        btnAumentar.addEventListener("click", () => {

            carrinho.adicionarProduto(item.produto);

            atualizarCarrinho();
        });

        controles.appendChild(btnDiminuir);
        controles.appendChild(numero);
        controles.appendChild(btnAumentar);

        const subtotal = document.createElement("strong");

        subtotal.textContent =
            "Subtotal: " +
            formatarPreco(item.calcular_subtotal());

        linha.appendChild(nome);
        linha.appendChild(preco);
        linha.appendChild(controles);
        linha.appendChild(subtotal);

        painelCarrinho.appendChild(linha);
    });

    // TOTAL DA COMPRA

    const totalFinal = document.createElement("strong");

    totalFinal.textContent =
        `Total: ${formatarPreco(total)}`;

    painelCarrinho.appendChild(totalFinal);

    // FORMA DE PAGAMENTO

    const selecaoPagamento = document.createElement("select");

    selecaoPagamento.classList.add("selecao-pagamento");

    selecaoPagamento.innerHTML = `
        <option value="">Escolha a forma de pagamento</option>
        <option value="pix">Pix</option>
        <option value="credito">Cartão de crédito</option>
        <option value="debito">Cartão de débito</option>
        <option value="boleto">Boleto</option>
    `;

    painelCarrinho.appendChild(selecaoPagamento);

    // FINALIZAR PEDIDO

    const btnFinalizar = document.createElement("button");

    btnFinalizar.type = "button";
    btnFinalizar.textContent = "Finalizar pedido";

    btnFinalizar.classList.add("btn-finalizar-pedido");

    btnFinalizar.addEventListener("click", () => {

        if (!sistemaLogin.clienteLogado) {
            mostrarAvisoLogin();
            return;
        }

        if (selecaoPagamento.value === "") {
            mostrarAvisoPagamento();
            return;
        }

        let pagamento;

        switch (selecaoPagamento.value) {

            case "pix":
                pagamento = new PagamentoPix();
                break;

            case "credito":
                pagamento = new PagamentoCredito();
                break;

            case "debito":
                pagamento = new PagamentoDebito();
                break;

            case "boleto":
                pagamento = new PagamentoBoleto();
                break;
        }

        // CRIAR PEDIDO

        const pedido = new Pedido(
            proximoNumeroPedido,
            sistemaLogin.clienteLogado
        );

        // REGISTRAR FORMA DE PAGAMENTO

        pedido.formaPagamento = selecaoPagamento.value;

        // ADICIONAR PRODUTOS

        carrinho.itens.forEach(item => {

            pedido.adicionarItem(
                item.produto,
                item.quantidade
            );
        });

        // FINALIZAR PEDIDO

        const finalizado = pedido.finalizar(pagamento);

        if (finalizado) {

            mostrarPedidoConfirmado(
                pedido,
                selecaoPagamento.value
            );

            proximoNumeroPedido++;

            carrinho.limparCarrinho();

            atualizarCarrinho();

            painelCarrinho.hidden = true;
        }
    });

    painelCarrinho.appendChild(btnFinalizar);
}

// =====================================
// ABRIR E FECHAR CARRINHO
// =====================================

btnCarrinho.addEventListener("click", () => {

    painelPedidos.hidden = true;

    painelCarrinho.hidden = !painelCarrinho.hidden;
});

// =====================================
// BOTÃO MEUS PEDIDOS
// =====================================

btnMeusPedidos.addEventListener("click", () => {

    if (!sistemaLogin.clienteLogado) {
        mostrarAvisoLogin();
        return;
    }

    painelCarrinho.hidden = true;

    atualizarPainelPedidos();

    painelPedidos.hidden = !painelPedidos.hidden;
});

// =====================================
// PRODUTOS E CATEGORIAS
// =====================================

const listaMaisVendidos =
    document.getElementById("lista-mais-vendidos");

const secaoMaisVendidos =
    document.getElementById("secao-mais-vendidos");

const tituloProdutos = secaoMaisVendidos.querySelector("h2");

const botoesCategorias =
    document.querySelectorAll(".categoria");

const btnVoltarCategorias =
    document.getElementById("btn-voltar-categorias");

const campoPesquisa =
    document.getElementById("campo-pesquisa");

const btnPesquisa =
    document.getElementById("btn-pesquisa");

// PRODUTOS MAIS VENDIDOS

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

// =====================================
// CRIAR CARD DOS PRODUTOS
// =====================================

function criarCard(produto) {

    const card = document.createElement("div");

    card.classList.add("produto");

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const categoria = document.createElement("p");
    categoria.textContent = produto.categoria;

    const preco = document.createElement("strong");
    preco.textContent = formatarPreco(produto.preco);

    const btnAdicionar = document.createElement("button");

    btnAdicionar.type = "button";
    btnAdicionar.textContent = "Adicionar";

    btnAdicionar.addEventListener("click", () => {

        carrinho.adicionarProduto(produto);

        atualizarCarrinho();

        btnAdicionar.textContent = "Adicionado!";

        setTimeout(() => {
            btnAdicionar.textContent = "Adicionar";
        }, 800);
    });

    card.appendChild(nome);
    card.appendChild(categoria);
    card.appendChild(preco);
    card.appendChild(btnAdicionar);

    return card;
}

// =====================================
// MOSTRAR PRODUTOS
// =====================================

function mostrarProdutos(lista) {

    listaMaisVendidos.replaceChildren();

    if (lista.length === 0) {

        listaMaisVendidos.textContent =
            "Nenhum produto encontrado.";

        return;
    }

    lista.forEach(produto => {
        listaMaisVendidos.appendChild(criarCard(produto));
    });
}

// =====================================
// VOLTAR PARA A PÁGINA INICIAL
// =====================================

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

// =====================================
// INICIAR SITE
// =====================================

mostrarInicioCategorias();

atualizarCarrinho();

// =====================================
// FILTRAR CATEGORIAS
// =====================================

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

// =====================================
// PESQUISA
// =====================================

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

// =====================================
// LOGIN
// =====================================

const sistemaLogin = new SistemaLogin();

const areaUsuario =
    document.getElementById("area-usuario");

const conteudoPrincipal =
    document.getElementById("conteudo-principal");

const boasVindas =
    document.getElementById("boas-vindas");

const nomeCliente =
    document.getElementById("nome-cliente");

const telaLogin =
    document.getElementById("tela-login");

const telaCadastro =
    document.getElementById("tela-cadastro");

const linkInicio =
    document.getElementById("link-inicio");

const btnLogin =
    document.getElementById("btn-login");

const btnIrCadastro =
    document.getElementById("btn-ir-cadastro");

const btnIrLogin =
    document.getElementById("btn-ir-login");

const btnVoltarLogin =
    document.getElementById("btn-voltar-login");

const formLogin =
    document.getElementById("form-login");

const formCadastro =
    document.getElementById("form-cadastro");

// =====================================
// MOSTRAR INÍCIO
// =====================================

function voltarParaInicio() {

    telaLogin.hidden = true;
    telaCadastro.hidden = true;
    conteudoPrincipal.hidden = false;
    boasVindas.hidden = true;

    painelPedidos.hidden = true;

    mostrarInicioCategorias();
}

linkInicio.addEventListener("click", event => {

    event.preventDefault();

    voltarParaInicio();
});

// =====================================
// ABRIR LOGIN
// =====================================

btnLogin.addEventListener("click", () => {

    conteudoPrincipal.hidden = true;
    telaCadastro.hidden = true;
    telaLogin.hidden = false;
});

// =====================================
// ABRIR CADASTRO
// =====================================

btnIrCadastro.addEventListener("click", () => {

    telaLogin.hidden = true;
    telaCadastro.hidden = false;
});

// =====================================
// VOLTAR PARA LOGIN
// =====================================

btnIrLogin.addEventListener("click", () => {

    telaCadastro.hidden = true;
    telaLogin.hidden = false;
});

// VOLTAR DA TELA DE LOGIN

btnVoltarLogin.addEventListener("click", voltarParaInicio);

// =====================================
// ATUALIZAR USUÁRIO
// =====================================

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

        painelPedidos.hidden = true;

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

// =====================================
// MODAL DE E-MAIL JÁ CADASTRADO
// =====================================

function mostrarAvisoEmailCadastrado() {

    if (document.querySelector(".modal-email-cadastrado")) {
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal-email-cadastrado");

    modal.innerHTML = `
        <div class="conteudo-email-cadastrado">

            <div class="icone-email-cadastrado">
                !
            </div>

            <h2>E-mail já cadastrado</h2>

            <p>
                Esse e-mail já possui uma conta.
                Tente entrar com sua senha ou utilize outro e-mail.
            </p>

            <button type="button" class="btn-fechar-email">
                Entendi
            </button>

        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".btn-fechar-email")
        .addEventListener("click", () => {
            modal.remove();
        });

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            modal.remove();
        }
    });
}

// =====================================
// CADASTRAR USUÁRIO
// =====================================

formCadastro.addEventListener("submit", event => {

    event.preventDefault();

    const nome = document.getElementById("nome-cadastro").value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;

    const cadastrado =
        sistemaLogin.cadastrarUsuario(nome, email, senha);

    if (cadastrado) {

        sistemaLogin.autenticarUsuario(email, senha);

        atualizarUsuario(sistemaLogin.clienteLogado);

        formCadastro.reset();

    } else {

        mostrarAvisoEmailCadastrado();
    }
});

// =====================================
// MODAL DE ERRO DE LOGIN
// =====================================

function mostrarErroLogin() {

    if (document.querySelector(".modal-erro-login")) {
        return;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal-erro-login");

    modal.innerHTML = `
        <div class="conteudo-erro-login">

            <div class="icone-erro-login">
                !
            </div>

            <h2>Não foi possível entrar</h2>

            <p>
                O e-mail ou a senha estão incorretos.
                Confira seus dados e tente novamente.
            </p>

            <button type="button" class="btn-tentar-login">
                Tentar novamente
            </button>

        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".btn-tentar-login")
        .addEventListener("click", () => {
            modal.remove();
        });

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            modal.remove();
        }
    });
}

// =====================================
// FAZER LOGIN
// =====================================

formLogin.addEventListener("submit", event => {

    event.preventDefault();

    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    const autenticado =
        sistemaLogin.autenticarUsuario(email, senha);

    if (autenticado) {

        atualizarUsuario(sistemaLogin.clienteLogado);

        formLogin.reset();

    } else {

        mostrarErroLogin();
    }
});

