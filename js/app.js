// --- DADOS GERAIS ---
// Mantemos as chaves do localStorage
const AGENDAMENTOS_KEY = "@limpapiscina/agendamentos";
const CLIENTES_KEY = "@limpapiscina/clientes";
const EXTRAS_KEY = "@limpapiscina/extras";
const CART_KEY = "@limpapiscina/carrinho";

// --- E-COMMERCE (LOJA) ---
const PRODUTOS = [
    { 
        id: 1, 
        nome: 'Cloro Granulado 10kg', 
        preco: 189.90, 
        imagem: 'https://via.placeholder.com/400?text=Cloro+10kg',
        descricao: 'Cloro estabilizado de alta performance. Ideal para piscinas residenciais e clubes. Dissolução rápida e não deixa resíduos.'
    },
    { 
        id: 2, 
        nome: 'Algicida de Choque 1L', 
        preco: 45.50, 
        imagem: 'https://via.placeholder.com/400?text=Algicida',
        descricao: 'Elimina algas verdes, amarelas e pretas. Recupera a transparência da água em poucas horas. Uso emergencial.'
    },
    { 
        id: 3, 
        nome: 'Limpa Bordas Gel', 
        preco: 22.00, 
        imagem: 'https://via.placeholder.com/400?text=Limpa+Bordas',
        descricao: 'Detergente biodegradável em gel. Remove gordura e sujeira das bordas sem alterar o pH da água.'
    },
    { 
        id: 4, 
        nome: 'Peneira Cata-Folha', 
        preco: 35.00, 
        imagem: 'https://via.placeholder.com/400?text=Peneira',
        descricao: 'Peneira com rede reforçada para remoção de folhas e insetos. Encaixe universal para cabos telescópicos.'
    }
];

// Renderiza a vitrine na página loja.html
function renderLoja() {
    const container = document.getElementById('lista-produtos');
    if(!container) return;
    container.innerHTML = '';
    PRODUTOS.forEach(prod => {
        container.innerHTML += `
            <div class="card" style="text-align: center; transition: transform 0.2s;">
                <img src="${prod.imagem}" alt="${prod.nome}" style="width:100%; border-radius:5px;">
                <h3 style="margin:10px 0; height: 50px;">${prod.nome}</h3>
                <h4 style="color:var(--primary-blue); font-size: 1.2rem;">R$ ${prod.preco.toFixed(2)}</h4>
                <a href="produto.html?id=${prod.id}" class="btn" style="width:100%; display:block; margin-top:10px;">Comprar</a>
            </div>`;
    });
    atualizarIconeCarrinho();
}

// Pega o ID da URL (para a página de detalhes)
function getProdutoPorUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    return PRODUTOS.find(p => p.id === id);
}

// --- LÓGICA DO CARRINHO ---
function getCarrinho() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function adicionarAoCarrinho(id) {
    const carrinho = getCarrinho();
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        carrinho.push({ id: id, qtd: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
    atualizarIconeCarrinho();
    alert("✅ Produto adicionado ao carrinho!");
}

function removerDoCarrinho(id) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
    renderCarrinhoPagina(); // Atualiza a tela do carrinho se estiver nela
    atualizarIconeCarrinho();
}

function atualizarIconeCarrinho() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const carrinho = getCarrinho();
        // Soma a quantidade total de itens
        const total = carrinho.reduce((acc, item) => acc + item.qtd, 0);
        badge.innerText = total;
        badge.style.display = total > 0 ? 'block' : 'none';
    }
}

// Renderiza a tabela na página carrinho.html
function renderCarrinhoPagina() {
    const container = document.getElementById('itens-carrinho');
    const totalEl = document.getElementById('total-carrinho');
    if(!container) return;

    const carrinho = getCarrinho();
    container.innerHTML = '';
    let totalGeral = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            const prod = PRODUTOS.find(p => p.id === item.id);
            if (prod) {
                const subtotal = prod.preco * item.qtd;
                totalGeral += subtotal;
                container.innerHTML += `
                    <div class="cart-item">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <img src="${prod.imagem}" style="width:50px; height:50px; border-radius:5px; object-fit:cover;">
                            <div>
                                <strong>${prod.nome}</strong><br>
                                <small>R$ ${prod.preco.toFixed(2)} x ${item.qtd}</small>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <strong>R$ ${subtotal.toFixed(2)}</strong><br>
                            <button onclick="removerDoCarrinho(${item.id})" style="color:red; border:none; background:none; cursor:pointer; font-size:0.8rem;">Remover</button>
                        </div>
                    </div>
                `;
            }
        });
    }
    
    if(totalEl) totalEl.innerText = "R$ " + totalGeral.toFixed(2);
}

function finalizarCompraLoja(metodo, endereco) {
    // Simulação de envio
    alert(`🎉 Pedido Realizado com Sucesso!\n\nEndereço: ${endereco}\nPagamento: ${metodo}\n\nEnviaremos o código de rastreio em breve.`);
    localStorage.removeItem(CART_KEY); // Limpa carrinho
    window.location.href = "index.html";
}

// --- (MANTIDO) FUNÇÕES DE LOGIN E ADMIN ---
// ... (Mantemos as funções getAgendamentos, addAgendamento, addCliente, etc, do código anterior. 
// Se quiser economizar espaço aqui no chat, assuma que o restante do app.js continua igual ao passo anterior, 
// apenas adicionei a parte de E-COMMERCE acima. Mas para garantir, vou deixar as funcoes auxiliares minimas abaixo)

function getMeuPlano(email) { return getClientes().find(c => c.email === email); }
function getClientes() { return JSON.parse(localStorage.getItem(CLIENTES_KEY)) || []; }
function getExtras() { return JSON.parse(localStorage.getItem(EXTRAS_KEY)) || []; }
function confirmarPagamentoMensal(email) { /* Logica anterior */ return true; }
function pagarExtra(id) { /* Logica anterior */ return true; }
function logout() { localStorage.removeItem("@limpapiscina/session"); window.location.href="login.html"; }
