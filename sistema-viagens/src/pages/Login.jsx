import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Lock, Mail } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Aqui entrará a lógica de autenticação com o Node futuramente
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-3 rounded-full mb-4">
                        <Plane className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Sistema de Viagens</h1>
                    <p className="text-slate-500">Entre com suas credenciais</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="seu@email.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        Acessar Sistema
                    </button>
                </form>
            </div>
        </div>
    );
}