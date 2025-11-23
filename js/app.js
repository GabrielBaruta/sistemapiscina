// --- DADOS GERAIS ---
const AGENDAMENTOS_KEY = "@limpapiscina/agendamentos";
const CLIENTES_KEY = "@limpapiscina/clientes";
const EXTRAS_KEY = "@limpapiscina/extras";
const CART_KEY = "@limpapiscina/carrinho";
const VENDAS_KEY = "@limpapiscina/vendas"; // NOVO!

// --- GESTÃO DE VENDAS (NOVO!) ---
function getVendas() {
    return JSON.parse(localStorage.getItem(VENDAS_KEY)) || [];
}

function salvarVenda(nome, endereco, metodo, total, itens) {
    const lista = getVendas();
    const novaVenda = {
        id: Date.now(),
        data: new Date().toLocaleString(),
        cliente: nome,
        endereco: endereco,
        metodo: metodo,
        total: total,
        itens: itens, // Array com os produtos comprados
        status: 'Pendente' // Pendente -> Enviado -> Entregue
    };
    lista.push(novaVenda);
    localStorage.setItem(VENDAS_KEY, JSON.stringify(lista));
}

function atualizarStatusVenda(id, novoStatus) {
    const lista = getVendas();
    const item = lista.find(v => v.id === id);
    if(item) {
        item.status = novoStatus;
        localStorage.setItem(VENDAS_KEY, JSON.stringify(lista));
        return true;
    }
    return false;
}

function verItensVenda(id) {
    const venda = getVendas().find(v => v.id === id);
    if(venda) {
        let msg = `📦 PEDIDO #${venda.id}\n\n`;
        venda.itens.forEach(i => {
            // Busca nome do produto pelo ID (caso mude preço depois, aqui mantemos histórico simples)
            const prodInfo = PRODUTOS.find(p => p.id === i.id);
            const nomeProd = prodInfo ? prodInfo.nome : "Produto";
            msg += `- ${i.qtd}x ${nomeProd}\n`;
        });
        msg += `\n💰 Total: R$ ${venda.total.toFixed(2)}`;
        msg += `\n📍 Endereço: ${venda.endereco}`;
        alert(msg);
    }
}

// --- LÓGICA DA LOJA (ATUALIZADA) ---
function finalizarCompraLoja(nome, endereco, metodo) {
    const carrinho = getCarrinho();
    let total = 0;
    
    // Calcula total
    carrinho.forEach(item => {
        const prod = PRODUTOS.find(p => p.id === item.id);
        if(prod) total += (prod.preco * item.qtd);
    });

    // Aplica desconto PIX se for o caso
    if(metodo === "PIX") total = total * 0.95;

    // SALVA NO BANCO DE DADOS DO ADMIN
    salvarVenda(nome, endereco, metodo, total, carrinho);

    // Limpa e redireciona
    alert(`🎉 Pedido Realizado com Sucesso!\n\nObrigado, ${nome}.\nVocê pode acompanhar o status pelo WhatsApp.`);
    localStorage.removeItem(CART_KEY);
    window.location.href = "index.html";
}

// --- OUTRAS FUNÇÕES (MANTIDAS) ---
// Agendamentos
function getAgendamentos() { return JSON.parse(localStorage.getItem(AGENDAMENTOS_KEY)) || []; }
function addAgendamento(cliente, data, servico, obs) {
    const lista = getAgendamentos();
    lista.push({ id: Date.now(), cliente, data, servico, obs, status: 'Pendente' });
    localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(lista));
}
function renderAgendamentos() {
    const lista = getAgendamentos();
    const tbody = document.getElementById('lista-agendamentos');
    if(!tbody) return;
    tbody.innerHTML = '';
    lista.forEach(item => {
        const btnStyle = (item.obs && item.obs.length > 0) ? "background:#4caf50" : "background:#ccc; cursor:not-allowed";
        tbody.innerHTML += `
            <tr>
                <td>${item.data}</td>
                <td><strong>${item.cliente}</strong></td>
                <td>${item.servico}</td>
                <td><button onclick="verObservacao(${item.id})" class="btn-view" style="${btnStyle}">👁️</button><button onclick="deleteAgendamento(${item.id})" class="btn-delete">🗑️</button></td>
            </tr>`;
    });
}
function verObservacao(id) { const i = getAgendamentos().find(x => x.id === id); if(i && i.obs) alert(i.obs); }
function deleteAgendamento(id) { if(confirm("Excluir?")) { localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(getAgendamentos().filter(i => i.id !== id))); renderAgendamentos(); } }

// Clientes e Extras
function getClientes() { return JSON.parse(localStorage.getItem(CLIENTES_KEY)) || []; }
function addCliente(nome, email, endereco, telefone, valor, descricao) {
    const lista = getClientes();
    if(lista.find(c => c.email === email)) { alert("E-mail já existe!"); return false; }
    lista.push({ id: Date.now(), nome, email, endereco, telefone, valor, descricao, ultimoPagamento: null });
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(lista));
    alert("Salvo!"); return true;
}
function renderClientes() {
    const lista = getClientes();
    const tbody = document.getElementById('lista-clientes');
    const hoje = new Date();
    if(tbody) {
        tbody.innerHTML = '';
        lista.forEach(item => {
            let statusHtml = '<span style="color:orange;">⚠️ PENDENTE</span>';
            if (item.ultimoPagamento) {
                const diffDays = Math.ceil(Math.abs(hoje - new Date(item.ultimoPagamento)) / (1000 * 60 * 60 * 24)); 
                if(diffDays <= 30) statusHtml = '<span style="color:green;">✅ PAGO</span>';
            }
            tbody.innerHTML += `<tr><td><strong>${item.nome}</strong><br><small>${item.email}</small></td><td>R$ ${item.valor}</td><td>${statusHtml}</td><td><button onclick="deleteCliente(${item.id})" class="btn-delete">🗑️</button></td></tr>`;
        });
        // Preenche select extra
        const sel = document.getElementById('cliente-extra');
        if(sel) { sel.innerHTML='<option value="">Selecione...</option>'; lista.forEach(c=>{sel.innerHTML+=`<option value="${c.email}">${c.nome}</option>`}); }
    }
}
function deleteCliente(id) { if(confirm("Excluir?")) { localStorage.setItem(CLIENTES_KEY, JSON.stringify(getClientes().filter(i => i.id !== id))); renderClientes(); } }
function confirmarPagamentoMensal(email) {
    const l = getClientes(); const i = l.findIndex(c => c.email === email);
    if(i >= 0) { l[i].ultimoPagamento = Date.now(); localStorage.setItem(CLIENTES_KEY, JSON.stringify(l)); return true; } return false;
}
function getMeuPlano(email) { return getClientes().find(c => c.email === email); }

// Extras
function getExtras() { return JSON.parse(localStorage.getItem(EXTRAS_KEY)) || []; }
function addExtra(email, desc, valor) {
    const l = getExtras(); l.push({ id: Date.now(), email, descricao: desc, valor, status: 'Pendente' });
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(l)); alert("Enviado!");
}
function getMinhasExtras(email) { return getExtras().filter(e => e.email === email && e.status === 'Pendente'); }
function pagarExtra(id) { localStorage.setItem(EXTRAS_KEY, JSON.stringify(getExtras().filter(e => e.id !== id))); return true; }

// Produtos e Carrinho
const PRODUTOS = [
    { id: 1, nome: 'Cloro Granulado 10kg', preco: 189.90, imagem: 'https://via.placeholder.com/400?text=Cloro', descricao: 'Cloro de alta performance.' },
    { id: 2, nome: 'Algicida de Choque 1L', preco: 45.50, imagem: 'https://via.placeholder.com/400?text=Algicida', descricao: 'Elimina algas rapidamente.' },
    { id: 3, nome: 'Limpa Bordas Gel', preco: 22.00, imagem: 'https://via.placeholder.com/400?text=Limpa+Bordas', descricao: 'Remove gordura das bordas.' },
    { id: 4, nome: 'Peneira Cata-Folha', preco: 35.00, imagem: 'https://via.placeholder.com/400?text=Peneira', descricao: 'Rede reforçada.' }
];
function renderLoja() {
    const c = document.getElementById('lista-produtos'); if(!c) return; c.innerHTML = '';
    PRODUTOS.forEach(p => { c.innerHTML += `<div class="card" style="text-align:center;"><img src="${p.imagem}" style="width:100%;border-radius:5px;"><h3 style="margin:10px 0;">${p.nome}</h3><h4 style="color:var(--primary-blue);">R$ ${p.preco.toFixed(2)}</h4><a href="produto.html?id=${p.id}" class="btn" style="width:100%;margin-top:10px;">Comprar</a></div>`; });
    atualizarIconeCarrinho();
}
function getProdutoPorUrl() { const p = new URLSearchParams(window.location.search); return PRODUTOS.find(x => x.id == p.get('id')); }
function getCarrinho() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
function adicionarAoCarrinho(id) {
    const c = getCarrinho(); const exists = c.find(i => i.id === id);
    if(exists) exists.qtd++; else c.push({id, qtd:1});
    localStorage.setItem(CART_KEY, JSON.stringify(c)); atualizarIconeCarrinho(); alert("Adicionado!");
}
function removerDoCarrinho(id) { localStorage.setItem(CART_KEY, JSON.stringify(getCarrinho().filter(i => i.id !== id))); renderCarrinhoPagina(); atualizarIconeCarrinho(); }
function atualizarIconeCarrinho() { const b = document.getElementById('cart-count'); if(b) { const t = getCarrinho().reduce((a,i)=>a+i.qtd,0); b.innerText=t; b.style.display=t>0?'block':'none'; } }
function renderCarrinhoPagina() {
    const c = document.getElementById('itens-carrinho'); const t = document.getElementById('total-carrinho'); if(!c) return;
    const cart = getCarrinho(); c.innerHTML=''; let tot=0;
    if(cart.length===0) c.innerHTML='<p style="text-align:center;">Vazio.</p>';
    else cart.forEach(i => { const p = PRODUTOS.find(x => x.id === i.id); if(p) { const s = p.preco*i.qtd; tot+=s; c.innerHTML+=`<div class="cart-item"><div style="display:flex;gap:15px;"><img src="${p.imagem}" style="width:50px;"><div><strong>${p.nome}</strong><br><small>${i.qtd}x</small></div></div><div><strong>R$ ${s.toFixed(2)}</strong><br><button onclick="removerDoCarrinho(${i.id})" style="color:red;border:none;background:none;cursor:pointer;">X</button></div></div>`; } });
    if(t) t.innerText = "R$ "+tot.toFixed(2);
}

// Backup
function exportarDados() {
    const b = { c: localStorage.getItem(CLIENTES_KEY), a: localStorage.getItem(AGENDAMENTOS_KEY), e: localStorage.getItem(EXTRAS_KEY), v: localStorage.getItem(VENDAS_KEY), u: localStorage.getItem("@limpapiscina/users") };
    const s = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(b));
    const a = document.createElement('a'); a.href = s; a.download = "backup.json"; document.body.appendChild(a); a.click(); a.remove();
}
function importarDados(e) {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = function(ev) {
        try { const d = JSON.parse(ev.target.result); if(confirm("Restaurar?")) {
            if(d.c) localStorage.setItem(CLIENTES_KEY, d.c); if(d.a) localStorage.setItem(AGENDAMENTOS_KEY, d.a);
            if(d.e) localStorage.setItem(EXTRAS_KEY, d.e); if(d.v) localStorage.setItem(VENDAS_KEY, d.v);
            if(d.u) localStorage.setItem("@limpapiscina/users", d.u); alert("Restaurado!"); location.reload();
        }} catch(er){alert("Erro.");}
    }; r.readAsText(f);
}
function logout() { localStorage.removeItem("@limpapiscina/session"); window.location.href="login.html"; }
