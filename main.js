
const {
    Produto,
    Cliente,
    Pedido,
    PagamentoPix
} = require("./script");

// Criando produtos
const coxinha = new Produto("Coxinha", 7);
const brigadeiro = new Produto("Brigadeiro", 3.50);
const coca = new Produto("Coca-Cola", 5);

// Criando cliente e pedido
const cliente1 = new Cliente("João");
const pedido1 = new Pedido(1, cliente1);

// Adicionando produtos ao pedido
pedido1.adicionarItem(coxinha, 2);
pedido1.adicionarItem(brigadeiro, 3);
pedido1.adicionarItem(coca, 1);

// Exibindo informações
console.log("Cliente:", cliente1.nome);
console.log("Pedido:", pedido1.numero);
console.log("Status:", pedido1.status);

console.log("\n--- Itens do pedido ---");

for (const item of pedido1.itens) {
    console.log(
        `${item.produto.nome} | ` +
        `Quantidade: ${item.quantidade} | ` +
        `Subtotal: R$ ${item.calcular_subtotal().toFixed(2)}`
    );
}

console.log(
    "\nTotal: R$ " + pedido1.calcular_total().toFixed(2)
);

// Pagamento
const pagamento = new PagamentoPix();
pedido1.finalizar(pagamento);

console.log("Status final:", pedido1.status);
