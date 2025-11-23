// --- GESTÃO DE AGENDAMENTOS ---
const AGENDAMENTOS_KEY = "@limpapiscina/agendamentos";

function getAgendamentos() {
    const data = localStorage.getItem(AGENDAMENTOS_KEY);
    return data ? JSON.parse(data) : [];
}

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
        // Se tiver observação, o botão fica verde, senão fica cinza
        const temObs = item.obs && item.obs.length > 0;
        const btnStyle = temObs ? "background:#4caf50" : "background:#ccc; cursor:not-allowed";
        
        tbody.innerHTML += `
            <tr>
                <td>${item.data}</td>
                <td><strong>${item.cliente}</strong></td>
                <td>${item.servico}</td>
                <td>
                    <button onclick="verObservacao(${item.id})" class="btn-view" style="${btnStyle}" title="Ver detalhes">👁️ Ver</button>
                    <button onclick="deleteAgendamento(${item.id})" class="btn-delete" title="Excluir">🗑️</button>
                </td>
            </tr>`;
    });
}

function verObservacao(id) {
    const item = getAgendamentos().find(i => i.id === id);
    if(item) {
        if(!item.obs) return alert("Nenhuma observação registrada.");
        alert(`📝 DETALHES DO PEDIDO:\n\n"${item.obs}"\n\n📍 Endereço/Info: ${item.cliente}`);
    }
}

function deleteAgendamento(id) {
    if(confirm("Excluir este agendamento?")) {
        const lista = getAgendamentos().filter(i => i.id !== id);
        localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(lista));
        renderAgendamentos();
    }
}

// --- GESTÃO DE CLIENTES ---
const CLIENTES_KEY = "@limpapiscina/clientes";

function getClientes() {
    const data = localStorage.getItem(CLIENTES_KEY);
    return data ? JSON.parse(data) : [];
}

function addCliente(nome, email, endereco, telefone, valor, descricao) {
    const lista = getClientes();
    if(lista.find(c => c.email === email)) {
        alert("Já existe um contrato para este e-mail!"); return false;
    }
    lista.push({ id: Date.now(), nome, email, endereco, telefone, valor, descricao });
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(lista));
    alert("Contrato salvo com sucesso!");
    return true;
}

function renderClientes() {
    const lista = getClientes();
    const tbody = document.getElementById('lista-clientes');
    if(!tbody) return;
    tbody.innerHTML = '';
    lista.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${item.nome}</strong><br><small>${item.email}</small></td>
                <td>${item.endereco}</td>
                <td style="color:var(--primary-blue);font-weight:bold;">R$ ${item.valor}</td>
                <td><button onclick="deleteCliente(${item.id})" class="btn-delete">🗑️ Excluir</button></td>
            </tr>`;
    });
}

function deleteCliente(id) {
    if(confirm("Tem certeza que deseja EXCLUIR este contrato?\nO cliente perderá acesso à área de pagamento.")) {
        const lista = getClientes().filter(i => i.id !== id);
        localStorage.setItem(CLIENTES_KEY, JSON.stringify(lista));
        renderClientes();
    }
}

function getMeuPlano(emailLogado) {
    return getClientes().find(c => c.email === emailLogado); 
}

// --- LOJA ---
const PRODUTOS = [
    { id: 1, nome: 'Cloro Granulado 10kg', preco: 189.90, imagem: 'https://via.placeholder.com/300?text=Cloro' },
    { id: 2, nome: 'Algicida de Choque', preco: 45.50, imagem: 'https://via.placeholder.com/300?text=Algicida' },
    { id: 3, nome: 'Limpa Bordas', preco: 22.00, imagem: 'https://via.placeholder.com/300?text=Limpa+Bordas' }
];

function renderLoja() {
    const container = document.getElementById('lista-produtos');
    if(!container) return;
    container.innerHTML = '';
    PRODUTOS.forEach(prod => {
        container.innerHTML += `
            <div class="card" style="text-align: center;">
                <img src="${prod.imagem}" alt="${prod.nome}" style="width:100%; border-radius:5px;">
                <h3 style="margin:10px 0;">${prod.nome}</h3>
                <h4 style="color:var(--primary-blue);">R$ ${prod.preco.toFixed(2)}</h4>
            </div>`;
    });
}
