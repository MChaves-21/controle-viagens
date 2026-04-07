import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [viagens, setViagens] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', { login, senha });
      if (res.data.message === "Sucesso") {
        setIsLoggedIn(true);
        fetchViagens();
      }
    } catch (error) {
      alert("Login ou senha incorretos");
    }
  };

  const fetchViagens = async () => {
    const res = await axios.get('http://localhost:3001/viagens');
    setViagens(res.data);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sistema de Gestão de Viagens</h2>
          <input type="text" placeholder="Login" onChange={e => setLogin(e.target.value)} />
          <input type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Painel de Viagens</h1>
        <button onClick={() => setIsLoggedIn(false)}>Sair</button>
      </header>
      <main>
        <h3>Viagens Cadastradas</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data Ida</th>
              <th>Data Volta</th>
            </tr>
          </thead>
          <tbody>
            {viagens.map(v => (
              <tr key={v.viagem_id}>
                <td>{v.viagem_id}</td>
                <td>{v.data_ida}</td>
                <td>{v.data_volta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;