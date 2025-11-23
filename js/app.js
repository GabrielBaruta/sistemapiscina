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
        tbody.innerHTML += `
            <tr>
                <td>${item.data}</td>
                <td><strong>${item.cliente}</strong></td>
                <td>${item.servico}</td>
                <td>${item.status}</td>
                <td><button onclick="deleteAgendamento(${item.id})" class="btn-delete">X</button></td>
            </tr>`;
    });
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

function addCliente(nome, endereco, telefone) {
    const lista = getClientes();
    lista.push({ id: Date.now(), nome, endereco, telefone });
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(lista));
    alert("Cliente salvo!");
}

function renderClientes() {
    const lista = getClientes();
    const tbody = document.getElementById('lista-clientes');
    if(!tbody) return;

    tbody.innerHTML = '';
    lista.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${item.nome}</strong></td>
                <td>${item.endereco}</td>
                <td>${item.telefone}</td>
                <td><button onclick="deleteCliente(${item.id})" class="btn-delete">X</button></td>
            </tr>`;
    });
}

function deleteCliente(id) {
    if(confirm("Remover este cliente?")) {
        const lista = getClientes().filter(i => i.id !== id);
        localStorage.setItem(CLIENTES_KEY, JSON.stringify(lista));
        renderClientes();
    }
}

// --- LOJA (NOVO) ---
const PRODUTOS = [
    {
        id: 1,
        nome: 'Cloro Granulado 10kg',
        descricao: 'Cloro estabilizado de alta qualidade.',
        preco: 189.90,
        imagem: 'https://via.placeholder.com/300?text=Cloro'
    },
    {
        id: 2,
        nome: 'Algicida de Choque',
        descricao: 'Elimina algas e previne água verde.',
        preco: 45.50,
        imagem: 'https://via.placeholder.com/300?text=Algicida'
    },
    {
        id: 3,
        nome: 'Limpa Bordas',
        descricao: 'Detergente especial para bordas.',
        preco: 22.00,
        imagem: 'https://via.placeholder.com/300?text=Limpa+Bordas'
    }
];

function renderLoja() {
    const container = document.getElementById('lista-produtos');
    if(!container) return;

    container.innerHTML = '';
    PRODUTOS.forEach(prod => {
        container.innerHTML += `
            <div class="card" style="text-align: center;">
                <img src="${prod.imagem}" alt="${prod.nome}" style="width:100%; border-radius: 5px;">
                <h3 style="margin: 10px 0;">${prod.nome}</h3>
                <p style="font-size: 0.9rem; color: #666;">${prod.descricao}</p>
                <h4 style="color: var(--primary-blue); margin: 10px 0;">R$ ${prod.preco.toFixed(2)}</h4>
                <button class="btn" onclick="alert('Adicionado ao carrinho!')">Comprar</button>
            </div>
        `;
    });
}
