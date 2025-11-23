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
                <td><button onclick="deleteAgendamento(${item.id})" style="color:red;border:none;background:none;cursor:pointer;">X</button></td>
            </tr>`;
    });
}

function deleteAgendamento(id) {
    if(confirm("Excluir?")) {
        const lista = getAgendamentos().filter(i => i.id !== id);
        localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(lista));
        renderAgendamentos();
    }
}