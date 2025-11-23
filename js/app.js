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
        const temObs = item.obs && item.obs.length > 0;
        const btnStyle = temObs ? "background:#4caf50" : "background:#ccc; cursor:not-allowed";
        tbody.innerHTML += `
            <tr>
                <td>${item.data}</td>
                <td><strong>${item.cliente}</strong></td>
                <td>${item.servico}</td>
                <td>
                    <button onclick="verObservacao(${item.id})" class="btn-view" style="${btnStyle}">👁️</button>
                    <button onclick="deleteAgendamento(${item.id})" class="btn-delete">🗑️</button>
                </td>
            </tr>`;
    });
}

function verObservacao(id) {
    const item = getAgendamentos().find(i => i.id === id);
    if(item && item.obs) alert(`📝 DETALHES:\n\n"${item.obs}"`);
}

function deleteAgendamento(id) {
    if(confirm("Excluir agendamento?")) {
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
    alert("Contrato salvo!");
    return true;
}

function renderClientes() {
    const lista = getClientes();
    const tbody = document.getElementById('lista-clientes');
    // Se estivermos na página de clientes, preenche a tabela e o Select de cobrança
    if(tbody) {
        tbody.innerHTML = '';
        lista.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>${item.nome}</strong><br><small>${item.email}</small></td>
                    <td>R$ ${item.valor}</td>
                    <td><button onclick="deleteCliente(${item.id})" class="btn-delete">🗑️</button></td>
                </tr>`;
        });
        
        // Preencher o SELECT da área de cobrança extra
        const select = document.getElementById('cliente-extra');
        if(select) {
            select.innerHTML = '<option value="">Selecione o Cliente...</option>';
            lista.forEach(c => {
                select.innerHTML += `<option value="${c.email}">${c.nome} (${c.email})</option>`;
            });
        }
    }
}

function deleteCliente(id) {
    if(confirm("Excluir contrato?")) {
        const lista = getClientes().filter(i => i.id !== id);
        localStorage.setItem(CLIENTES_KEY, JSON.stringify(lista));
        renderClientes();
    }
}

function getMeuPlano(email) { return getClientes().find(c => c.email === email); }

// --- COBRANÇAS EXTRAS (NOVO!) ---
const EXTRAS_KEY = "@limpapiscina/extras";

function getExtras() {
    return JSON.parse(localStorage.getItem(EXTRAS_KEY)) || [];
}

function addExtra(email, descricao, valor) {
    const lista = getExtras();
    lista.push({ id: Date.now(), email, descricao, valor, status: 'Pendente' });
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(lista));
    alert("Cobrança extra enviada ao cliente!");
}

function getMinhasExtras(email) {
    return getExtras().filter(e => e.email === email && e.status === 'Pendente');
}

function pagarExtra(id) {
    const lista = getExtras();
    const item = lista.find(e => e.id === id);
    if(item) {
        item.status = 'Pago'; // Marca como pago (na vida real removeriamos ou arquivariamos)
        // Ou podemos remover da lista para sumir da tela:
        const novaLista = lista.filter(e => e.id !== id);
        localStorage.setItem(EXTRAS_KEY, JSON.stringify(novaLista));
        return true;
    }
    return false;
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
