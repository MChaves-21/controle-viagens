import React from 'react';
import {
    LayoutDashboard, PlaneTakeoff, Receipt, Users,
    Settings, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

export default function Dashboard() {
    const stats = [
        { label: 'Viagens Ativas', value: '12', icon: PlaneTakeoff, color: 'text-blue-600' },
        { label: 'Aguardando Aprovação', value: '05', icon: Clock, color: 'text-amber-500' },
        { label: 'Reembolsos Pendentes', value: 'R$ 1.250', icon: Receipt, color: 'text-green-600' },
        { label: 'Alertas/Exceções', value: '02', icon: AlertCircle, color: 'text-red-500' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:block">
                <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-2">
                    <PlaneTakeoff className="text-blue-400" /> TravelSys
                </div>
                <nav className="p-4 space-y-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                    <NavItem icon={PlaneTakeoff} label="Minhas Viagens" />
                    <NavItem icon={Receipt} label="Despesas" />
                    <NavItem icon={Users} label="Colaboradores" />
                    <NavItem icon={Settings} label="Configurações" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Painel de Controle</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">Bem-vindo, <strong>João Silva</strong> (Gestor)</span>
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">JS</div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                            <stat.icon className={`${stat.color} w-8 h-8 opacity-80`} />
                        </div>
                    ))}
                </div>

                {/* Tabela de Atividades Recentes */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Solicitações Recentes</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Colaborador</th>
                                <th className="px-6 py-3 font-semibold">Destino</th>
                                <th className="px-6 py-3 font-semibold">Data</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <TableRow name="Ana Martins" dest="São Paulo - SP" date="15 Out 2023" status="Pendente" />
                            <TableRow name="Carlos Weber" dest="Curitiba - PR" date="12 Out 2023" status="Aprovado" />
                            <TableRow name="Bia Souza" dest="Rio de Janeiro - RJ" date="10 Out 2023" status="Rejeitado" />
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon: Icon, label, active = false }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </div>
    );
}

function TableRow({ name, dest, date, status }) {
    const statusColors = {
        Pendente: 'bg-amber-100 text-amber-700',
        Aprovado: 'bg-green-100 text-green-700',
        Rejeitado: 'bg-red-100 text-red-700',
    };

    return (
        <tr className="hover:bg-slate-50 transition">
            <td className="px-6 py-4 font-medium text-slate-700">{name}</td>
            <td className="px-6 py-4 text-slate-600">{dest}</td>
            <td className="px-6 py-4 text-slate-600">{date}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[status]}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
}