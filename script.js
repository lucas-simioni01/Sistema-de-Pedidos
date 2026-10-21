class Produto {
    constructor(nome, preco){
        this.nome = nome;
        this.preco = preco;
    }
}

class Salgados extends Produto {}
class Doces extends Produto {}
class Bebidas extends Produto {}

class Cliente {
    constructor(nome){
        this.nome = nome;
    }
}

class Pedido {
    constructor(numero){
        this.numero = numero;
        this.Produto = [];
    }
}

module.exports = {
    Produto,
    Salgados,
    Doces,
    Bebidas,
    Cliente,
    Pedido
};