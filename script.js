class Produto {
    constructor(nome, preco, categoria) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }
}

class Cliente {
    constructor(nome) {
        this.nome = nome;
        this.pedidos = [];
    }

    adicionarPedido(pedido) {
        this.pedidos.push(pedido);
    }
}

class ItemPedido {
    constructor(produto, quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
    }

    calcular_subtotal() {
        return this.produto.preco * this.quantidade;
    }
}

class Pagamento {
    pagar(valor) {
        throw new Error("O método pagar deve ser implementado.");
    }
}

class PagamentoPix extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via Pix: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

class PagamentoCredito extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via crédito: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

class PagamentoDebito extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via débito: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

class PagamentoBoleto extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via boleto: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

class Pedido {
    constructor(numero, cliente) {
        this.numero = numero;
        this.status = "Aberto";
        this.itens = [];
        this.cliente = cliente;
    }

    adicionarItem(produto, quantidade) {
        const item = new ItemPedido(produto, quantidade);
        this.itens.push(item);
    }

    calcular_total() {
        return this.itens.reduce(
            (total, item) => total + item.calcular_subtotal(),
            0
        );
    }

    finalizar(pagamento) {
        if (this.status === "Finalizado") {
            console.log("Este pedido já foi finalizado.");
            return false;
        }

        const total = this.calcular_total();

        if (total <= 0) {
            console.log("O pedido não possui itens.");
            return false;
        }

        const aprovado = pagamento.pagar(total);

        if (aprovado) {
            this.status = "Finalizado";
            this.cliente.adicionarPedido(this);
            return true;
        }

        return false;
    }
}

export {
    Produto,
    Cliente,
    Pedido,
    ItemPedido,
    Pagamento,
    PagamentoPix,
    PagamentoCredito,
    PagamentoDebito,
    PagamentoBoleto
};