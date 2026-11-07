import produtos from "./banco.js";

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