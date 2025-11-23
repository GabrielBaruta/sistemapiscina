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

// --- GESTÃO DE CLIENTES (NOVO) ---
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
