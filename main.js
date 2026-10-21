const {Salgados, Doces, Bebidas, Cliente, Pedido} = require("./script");

const coxinha = new Salgados("Coxinha", 7);
const cliente1 = new Cliente("João");
const pedido1 = new Pedido(1)

console.log("Cliente:", cliente1.nome);
console.log("Pedido:", pedido1.numero)
console.log("Produto:", coxinha.nome);
console.log("Preço:", coxinha.preco);