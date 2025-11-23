const DB_KEY = "@limpapiscina/users";
const SESSION_KEY = "@limpapiscina/session";

function getUsers() {
    const usersStr = localStorage.getItem(DB_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
}

function registerUser(nome, email, senha, tipo = "cliente") {
    const users = getUsers();
    if (users.find(user => user.email === email)) {
        alert("E-mail já cadastrado!"); return false;
    }
    users.push({ id: Date.now(), nome, email, senha, tipo });
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    alert("Conta criada! Faça login."); return true;
}

function loginUser(email, senha) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.senha === senha);
    if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, nome: user.nome, email: user.email, tipo: user.tipo }));
        alert(`Bem-vindo, ${user.nome}!`);
        window.location.href = user.tipo === 'admin' ? "agendamentos.html" : "index.html";
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

function checkAuth(pageType) {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session) { window.location.href = "login.html"; return; }
    if (pageType === 'admin' && session.tipo !== 'admin') {
        alert("Acesso restrito a administradores!"); window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}
