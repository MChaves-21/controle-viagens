// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;
        const res = await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, senha }) });
        const data = await res.json();
        if (data.success) { localStorage.setItem('usuario', JSON.stringify(data.user)); window.location.href = 'dashboard.html'; }
        else document.getElementById('message').innerText = data.message;
    });
}

// CADASTRO
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = { nome: document.getElementById('nome').value, email: document.getElementById('email').value, senha: document.getElementById('password').value };
        const res = await fetch('/cadastrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) { alert('Sucesso!'); window.location.href = 'login.html'; }
    });
}

// SOLICITAR VIAGEM
const viagemForm = document.getElementById('viagemForm');
if (viagemForm) {
    viagemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('usuario'));
        const dados = { data_ida: document.getElementById('data_ida').value, data_volta: document.getElementById('data_volta').value, viagem_tipo_id: document.getElementById('viagem_tipo_id').value, usuario_id: user.usuario_id };
        const res = await fetch('/api/solicitar-viagem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) window.location.href = 'dashboard.html';
    });
}

// LANÇAR DESPESA
const despesaForm = document.getElementById('despesaForm');
if (despesaForm) {
    despesaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('usuario'));
        const dados = { valor: document.getElementById('valor').value, data_vencimento: document.getElementById('data_vencimento').value, tipo_titulo_id: document.getElementById('tipo_titulo_id').value, usuario_id: user.usuario_id };
        const res = await fetch('/api/lancar-despesa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
        if (res.ok) window.location.href = 'dashboard.html';
    });
}