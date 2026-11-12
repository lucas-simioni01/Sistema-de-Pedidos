
export class Produto {
    constructor(nome, preco, categoria, imagem) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.imagem = imagem;
    }
}

export class Cliente {
    constructor(nome) {
        this.nome = nome;
        this.pedidos = [];
    }

    adicionarPedido(pedido) {
        this.pedidos.push(pedido);
    }
}

export class SistemaLogin {
    constructor() {
        this.usuarios = [];
        this.clienteLogado = null;
    }

    cadastrarUsuario(nome, email, senha) {
        const existe = this.usuarios.some(
            usuario => usuario.email === email
        );

        if (existe) return false;

        this.usuarios.push({ nome, email, senha });
        return true;
    }

    autenticarUsuario(email, senha) {
        const usuario = this.usuarios.find(
            usuario => usuario.email === email && usuario.senha === senha
        );

        if (!usuario) return false;

        this.clienteLogado = new Cliente(usuario.nome);
        return true;
    }

    logout() {
        this.clienteLogado = null;
    }
}

export class ItemPedido {
    constructor(produto, quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
    }

    calcular_subtotal() {
        return this.produto.preco * this.quantidade;
    }
}

// CARRINHO DE COMPRAS

export class Carrinho {
    constructor() {
        this.itens = [];
    }

    adicionarProduto(produto) {
        const itemExistente = this.itens.find(
            item => item.produto.nome === produto.nome
        );

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            const novoItem = new ItemPedido(produto, 1);
            this.itens.push(novoItem);
        }
    }

    alterarQuantidade(produto, quantidade) {
        const item = this.itens.find(
            item => item.produto.nome === produto.nome
        );

        if (!item) return;

        if (quantidade <= 0) {
            this.removerProduto(produto.nome);
        } else {
            item.quantidade = quantidade;
        }
    }

    removerProduto(nome) {
        this.itens = this.itens.filter(
            item => item.produto.nome !== nome
        );
    }

    calcularTotal() {
        return this.itens.reduce(
            (total, item) => total + item.calcular_subtotal(),
            0
        );
    }

    quantidadeTotal() {
        return this.itens.reduce(
            (total, item) => total + item.quantidade,
            0
        );
    }

    limparCarrinho() {
        this.itens = [];
    }
}

// FORMAS DE PAGAMENTO

export class Pagamento {
    pagar(valor) {
        throw new Error("O método pagar deve ser implementado.");
    }
}

export class PagamentoPix extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via Pix: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

export class PagamentoCredito extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via crédito: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

export class PagamentoDebito extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via débito: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

export class PagamentoBoleto extends Pagamento {
    pagar(valor) {
        console.log(`Pagamento via boleto: R$ ${valor.toFixed(2)}`);
        return true;
    }
}

// PEDIDOS

export class Pedido {
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
