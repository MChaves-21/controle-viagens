async function apiPost(url, data) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
}

// Handler de Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = await apiPost('/login', { email: e.target.email.value, senha: e.target.password.value });
    if (data.success) { localStorage.setItem('user', JSON.stringify(data.user)); window.location.href = 'dashboard.html'; }
    else alert('Erro no login');
});

// Handler de Cadastro
document.getElementById('cadastroForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = await apiPost('/cadastrar', { nome: e.target.nome.value, email: e.target.email.value, senha: e.target.password.value });
    if (data.success) { alert('Sucesso!'); window.location.href = 'login.html'; }
});

// Handler Solicitar Viagem
document.getElementById('viagemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const data = await apiPost('/api/solicitar-viagem', {
        data_ida: e.target.data_ida.value, data_volta: e.target.data_volta.value,
        viagem_tipo_id: e.target.viagem_tipo_id.value, usuario_id: user.usuario_id
    });
    if (data.success) window.location.href = 'dashboard.html';
});

// Handler Lançar Despesa
document.getElementById('despesaForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const data = await apiPost('/api/lancar-despesa', {
        valor: e.target.valor.value, data_vencimento: e.target.data_vencimento.value,
        tipo_titulo_id: e.target.tipo_titulo_id.value, usuario_id: user.usuario_id
    });
    if (data.success) window.location.href = 'dashboard.html';
});