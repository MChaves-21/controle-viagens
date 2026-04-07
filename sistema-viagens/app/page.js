'use client';

import { useState, useEffect } from 'react';

export default function Home() {
    const [viagens, setViagens] = useState([]);
    const [tiposViagem, setTiposViagem] = useState([]);
    const [formData, setFormData] = useState({ data_ida: '', data_volta: '', viagem_tipo_id: '' });
    const [loading, setLoading] = useState(false);

    const fetchDados = async () => {
        const res = await fetch('/api/viagens');
        const data = await res.json();
        if (data.viagens) setViagens(data.viagens);
        if (data.tipos) setTiposViagem(data.tipos);
    };

    useEffect(() => {
        fetchDados();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await fetch('/api/viagens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // atualizado_por = 1 representa o usuário ID 1 (Murilo) criado no SQL inicial
            body: JSON.stringify({ ...formData, atualizado_por: 1 }),
        });

        setFormData({ data_ida: '', data_volta: '', viagem_tipo_id: '' });
        setLoading(false);
        fetchDados();
    };

    return (
        <main className="min-h-screen bg-slate-50 p-8 text-slate-800">
            <div className="max-w-5xl mx-auto space-y-8">

                <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900">Gestão de Viagens</h1>
                    <p className="text-slate-500 mt-2">Módulo de Cadastro e Acompanhamento de Roteiros</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <section className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                        <h2 className="text-xl font-semibold mb-6 text-blue-600">Registrar Viagem</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Data de Ida</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.data_ida}
                                    onChange={(e) => setFormData({ ...formData, data_ida: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Data de Volta</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.data_volta}
                                    onChange={(e) => setFormData({ ...formData, data_volta: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Tipo de Viagem</label>
                                <select
                                    required
                                    value={formData.viagem_tipo_id}
                                    onChange={(e) => setFormData({ ...formData, viagem_tipo_id: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Selecione...</option>
                                    {tiposViagem.map((tipo) => (
                                        <option key={tipo.viagem_tipo_id} value={tipo.viagem_tipo_id}>
                                            {tipo.descricao}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
                            >
                                {loading ? 'Registrando...' : 'Salvar Viagem'}
                            </button>
                        </form>
                    </section>

                    <section className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-6 text-blue-600">Histórico de Viagens</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Período</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Responsável</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {viagens.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-sm text-slate-500">Nenhum registro encontrado no banco de dados.</td>
                                        </tr>
                                    ) : (
                                        viagens.map((v) => (
                                            <tr key={v.viagem_id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                                    {v.data_ida} até {v.data_volta}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.tipo_viagem}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.responsavel}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}