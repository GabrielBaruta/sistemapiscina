// --- CHAVES DO BANCO DE DADOS ---
const AGENDAMENTOS_KEY = "@limpapiscina/agendamentos";
const CLIENTES_KEY = "@limpapiscina/clientes";
const EXTRAS_KEY = "@limpapiscina/extras";
const CART_KEY = "@limpapiscina/carrinho";
const VENDAS_KEY = "@limpapiscina/vendas";
const ESTOQUE_KEY = "@limpapiscina/produtos"; // NOVO!

// --- INICIALIZAÇÃO (Cria produtos padrão se for a 1ª vez) ---
function initEstoque() {
    if(!localStorage.getItem(ESTOQUE_KEY)) {
        const padrao = [
            { id: 1, nome: 'Cloro Granulado 10kg', preco: 189.90, imagem: 'https://via.placeholder.com/400?text=Cloro', descricao: 'Cloro de alta performance.', estoque: 10 },
            { id: 2, nome: 'Algicida de Choque 1L', preco: 45.50, imagem: 'https://via.placeholder.com/400?text=Algicida', descricao: 'Elimina algas rapidamente.', estoque: 5 },
            { id: 3, nome: 'Limpa Bordas Gel', preco: 22.00, imagem: 'https://via.placeholder.com/400?text=Limpa+Bordas', descricao: 'Remove gordura das bordas.', estoque: 8 },
            { id: 4, nome: 'Peneira Cata-Folha', preco: 35.00, imagem: 'https://via.placeholder.com/400?text=Peneira', descricao: 'Rede reforçada.', estoque: 3 }
        ];
        localStorage.setItem(ESTOQUE_KEY, JSON.stringify(padrao));
    }
}
// Roda a inicialização assim que o script carrega
initEstoque();

// --- GESTÃO DE PRODUTOS (ESTOQUE) ---
function getProdutos() {
    return JSON.parse(localStorage.getItem(ESTOQUE_KEY)) || [];
}

function salvarProduto(nome, preco, imagem, descricao, estoque) {
    const lista = getProdutos();
    const novo = {
        id: Date.now(),
        nome, 
        preco: parseFloat(preco), 
        imagem, 
        descricao, 
        estoque: parseInt(estoque)
    };
    lista.push(novo);
    localStorage.setItem(ESTOQUE_KEY, JSON.stringify(lista));
    alert("Produto salvo com sucesso!");
}

function excluirProduto(id) {
    if(confirm("Tem certeza que deseja remover este produto da loja?")) {
        const lista = getProdutos().filter(p => p.id !== id);
        localStorage.setItem(ESTOQUE_KEY, JSON.stringify(lista));
        return true;
    }
    return false;
}

// --- LOJA (Vitrine) ---
function renderLoja() {
    const container = document.getElementById('lista-produtos');
    if(!container) return;
    
    const produtos = getProdutos();
    container.innerHTML = '';
    
    if(produtos.length === 0) {
        container.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        return;
    }

    produtos.forEach(p => {
        // Lógica de Estoque: Se for 0, bloqueia o botão
        const semEstoque = p.estoque <= 0;
        const btnTexto = semEstoque ? "Esgotado 🚫" : "Comprar";
        const btnStyle = semEstoque ? "background:#ccc; cursor:not-allowed;" : "";
        const link = semEstoque ? "#" : `produto.html?id=${p.id}`;

        container.innerHTML += `
            <div class="card" style="text-align: center; opacity: ${semEstoque ? 0.7 : 1}">
                <img src="${p.imagem}" alt="${p.nome}" style="width:100%; border-radius:5px;">
                <h3 style="margin:10px 0; height: 50px;">${p.nome}</h3>
                <h4 style="color:var(--primary-blue); font-size: 1.2rem;">R$ ${p.preco.toFixed(2)}</h4>
                <small style="color:${semEstoque ? 'red' : 'green'}">Estoque: ${p.estoque} un</small>
                <a href="${link}" class="btn" style="width:100%; display:block; margin-top:10px; ${btnStyle}">${btnTexto}</a>
            </div>`;
    });
    atualizarIconeCarrinho();
}

function getProdutoPorUrl() { 
    const p = new URLSearchParams(window.location.search); 
    return getProdutos().find(x => x.id == p.get('id')); 
}

// --- CARRINHO & CHECKOUT ---
function getCarrinho() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }

function adicionarAoCarrinho(id) {
    const produto = getProdutos().find(p => p.id === id);
    const carrinho = getCarrinho();
    const itemNoCarrinho = carrinho.find(i => i.id === id);
    
    // Verifica estoque antes de adicionar
    const qtdAtual = itemNoCarrinho ? itemNoCarrinho.qtd : 0;
    if(qtdAtual + 1 > produto.estoque) {
        alert("Desculpe, não temos mais estoque deste item!");
        return;
    }

    if(itemNoCarrinho) itemNoCarrinho.qtd++; else carrinho.push({id, qtd:1});
    localStorage.setItem(CART_KEY, JSON.stringify(carrinho)); 
    atualizarIconeCarrinho(); 
    alert("Adicionado!");
}

function removerDoCarrinho(id) { 
    localStorage.setItem(CART_KEY, JSON.stringify(getCarrinho().filter(i => i.id !== id))); 
    renderCarrinhoPagina(); 
    atualizarIconeCarrinho(); 
}

function atualizarIconeCarrinho() { 
    const b = document.getElementById('cart-count'); 
    if(b) { 
        const t = getCarrinho().reduce((a,i)=>a+i.qtd,0); 
        b.innerText=t; b.style.display=t>0?'block':'none'; 
    } 
}

function renderCarrinhoPagina() {
    const c = document.getElementById('itens-carrinho'); 
    const t = document.getElementById('total-carrinho'); 
    if(!c) return;
    const cart = getCarrinho(); 
    const estoque = getProdutos(); // Pega dados atualizados (nome, preço)
    
    c.innerHTML=''; let tot=0;
    if(cart.length===0) c.innerHTML='<p style="text-align:center;">Vazio.</p>';
    else cart.forEach(i => { 
        const p = estoque.find(x => x.id === i.id); 
        if(p) { 
            const s = p.preco*i.qtd; tot+=s; 
            c.innerHTML+=`<div class="cart-item"><div style="display:flex;gap:15px;"><img src="${p.imagem}" style="width:50px;"><div><strong>${p.nome}</strong><br><small>${i.qtd}x</small></div></div><div><strong>R$ ${s.toFixed(2)}</strong><br><button onclick="removerDoCarrinho(${i.id})" style="color:red;border:none;background:none;cursor:pointer;">X</button></div></div>`; 
        } 
    });
    if(t) t.innerText = "R$ "+tot.toFixed(2);
}

function finalizarCompraLoja(nome, endereco, metodo) {
    const carrinho = getCarrinho();
    const produtosDB = getProdutos();
    let total = 0;
    let itensVenda = [];

    // 1. Calcula Total e Prepara Itens
    carrinho.forEach(item => {
        const prodIndex = produtosDB.findIndex(p => p.id === item.id);
        if(prodIndex >= 0) {
            // Deduz do estoque
            if(produtosDB[prodIndex].estoque >= item.qtd) {
                produtosDB[prodIndex].estoque -= item.qtd;
                total += (produtosDB[prodIndex].preco * item.qtd);
                itensVenda.push({ ...item, nome: produtosDB[prodIndex].nome });
            } else {
                alert(`Erro: O produto ${produtosDB[prodIndex].nome} acabou de esgotar.`);
                return;
            }
        }
    });

    if(metodo === "PIX") total = total * 0.95;

    // 2. Salva Venda
    const vendas = getVendas();
    vendas.push({ id: Date.now(), data: new Date().toLocaleString(), cliente: nome, endereco, metodo, total, itens: itensVenda, status: 'Pendente' });
    localStorage.setItem(VENDAS_KEY, JSON.stringify(vendas));

    // 3. Atualiza Estoque no Banco
    localStorage.setItem(ESTOQUE_KEY, JSON.stringify(produtosDB));

    // 4. Limpa e Redireciona
    localStorage.removeItem(CART_KEY);
    alert(`🎉 Pedido Confirmado!\nEstoque atualizado.`);
    window.location.href = "index.html";
}

// --- VENDAS ---
function getVendas() { return JSON.parse(localStorage.getItem(VENDAS_KEY)) || []; }
function atualizarStatusVenda(id, novoStatus) {
    const lista = getVendas(); const item = lista.find(v => v.id === id);
    if(item) { item.status = novoStatus; localStorage.setItem(VENDAS_KEY, JSON.stringify(lista)); return true; }
    return false;
}
function verItensVenda(id) {
    const venda = getVendas().find(v => v.id === id);
    if(venda) {
        let msg = `📦 PEDIDO #${venda.id}\n\n`;
        venda.itens.forEach(i => { msg += `- ${i.qtd}x ${i.nome || 'Produto'}\n`; });
        msg += `\n💰 Total: R$ ${venda.total.toFixed(2)}\n📍 ${venda.endereco}`;
        alert(msg);
    }
}

// --- OUTRAS FUNÇÕES (MANTIDAS SIMPLIFICADAS) ---
// Agendamentos
function getAgendamentos() { return JSON.parse(localStorage.getItem(AGENDAMENTOS_KEY)) || []; }
function addAgendamento(c, d, s, o) { const l=getAgendamentos(); l.push({id:Date.now(), cliente:c, data:d, servico:s, obs:o, status:'Pendente'}); localStorage.setItem(AGENDAMENTOS_KEY,JSON.stringify(l)); }
function renderAgendamentos() { const l=getAgendamentos(); const t=document.getElementById('lista-agendamentos'); if(t){ t.innerHTML=''; l.forEach(i=>{ const bs=(i.obs)?'background:#4caf50':'background:#ccc'; t.innerHTML+=`<tr><td>${i.data}</td><td><strong>${i.cliente}</strong></td><td>${i.servico}</td><td><button onclick="verObservacao(${i.id})" class="btn-view" style="${bs}">👁️</button><button onclick="deleteAgendamento(${i.id})" class="btn-delete">🗑️</button></td></tr>`; }); } }
function verObservacao(id) { const i=getAgendamentos().find(x=>x.id===id); if(i&&i.obs)alert(i.obs); }
function deleteAgendamento(id) { if(confirm("Excluir?")){localStorage.setItem(AGENDAMENTOS_KEY,JSON.stringify(getAgendamentos().filter(i=>i.id!==id))); renderAgendamentos();}}

// Clientes
function getClientes() { return JSON.parse(localStorage.getItem(CLIENTES_KEY)) || []; }
function addCliente(n,e,en,t,v,d) { const l=getClientes(); if(l.find(c=>c.email===e)){alert("Email existe!");return;} l.push({id:Date.now(), nome:n, email:e, endereco:en, telefone:t, valor:v, descricao:d, ultimoPagamento:null}); localStorage.setItem(CLIENTES_KEY,JSON.stringify(l)); alert("Salvo!"); }
function renderClientes() {
    const l=getClientes(); const t=document.getElementById('lista-clientes'); const h=new Date();
    if(t){ t.innerHTML=''; l.forEach(i=>{ 
        let st='<span style="color:orange;">PENDENTE</span>'; 
        if(i.ultimoPagamento && Math.ceil(Math.abs(h-new Date(i.ultimoPagamento))/(864e5))<=30) st='<span style="color:green;">PAGO</span>';
        t.innerHTML+=`<tr><td><strong>${i.nome}</strong><br><small>${i.email}</small></td><td>R$ ${i.valor}</td><td>${st}</td><td><button onclick="deleteCliente(${i.id})" class="btn-delete">🗑️</button></td></tr>`;
    }); const s=document.getElementById('cliente-extra'); if(s){s.innerHTML='<option value="">Selecione...</option>'; l.forEach(c=>s.innerHTML+=`<option value="${c.email}">${c.nome}</option>`);}}
}
function deleteCliente(id) { if(confirm("Excluir?")){localStorage.setItem(CLIENTES_KEY,JSON.stringify(getClientes().filter(i=>i.id!==id))); renderClientes();}}
function confirmarPagamentoMensal(e) { const l=getClientes(); const i=l.findIndex(c=>c.email===e); if(i>=0){l[i].ultimoPagamento=Date.now(); localStorage.setItem(CLIENTES_KEY,JSON.stringify(l)); return true;} return false;}
function getMeuPlano(e) { return getClientes().find(c=>c.email===e); }

// Extras
function getExtras(){ return JSON.parse(localStorage.getItem(EXTRAS_KEY))||[]; }
function addExtra(e,d,v){ const l=getExtras(); l.push({id:Date.now(), email:e, descricao:d, valor:v, status:'Pendente'}); localStorage.setItem(EXTRAS_KEY,JSON.stringify(l)); alert("Enviado!"); }
function getMinhasExtras(e){ return getExtras().filter(x=>x.email===e && x.status==='Pendente'); }
function pagarExtra(id){ localStorage.setItem(EXTRAS_KEY,JSON.stringify(getExtras().filter(x=>x.id!==id))); return true; }

// Backup & Auth
function exportarDados(){ const b={c:localStorage.getItem(CLIENTES_KEY), a:localStorage.getItem(AGENDAMENTOS_KEY), e:localStorage.getItem(EXTRAS_KEY), v:localStorage.getItem(VENDAS_KEY), p:localStorage.getItem(ESTOQUE_KEY), u:localStorage.getItem("@limpapiscina/users")}; const s="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(b)); const a=document.createElement('a'); a.href=s; a.download="backup.json"; document.body.appendChild(a); a.click(); a.remove(); }
function importarDados(ev){ const f=ev.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=function(e){ try{const d=JSON.parse(e.target.result); if(confirm("Restaurar?")){ if(d.c)localStorage.setItem(CLIENTES_KEY,d.c); if(d.a)localStorage.setItem(AGENDAMENTOS_KEY,d.a); if(d.e)localStorage.setItem(EXTRAS_KEY,d.e); if(d.v)localStorage.setItem(VENDAS_KEY,d.v); if(d.p)localStorage.setItem(ESTOQUE_KEY,d.p); if(d.u)localStorage.setItem("@limpapiscina/users",d.u); alert("Restaurado!"); location.reload(); }}catch(er){alert("Erro.");}}; r.readAsText(f); }
function logout(){ localStorage.removeItem("@limpapiscina/session"); window.location.href="login.html"; }
