import { Plane, Calendar, DollarSign, FileText, Plus, ChevronRight, LogOut } from 'lucide-react';

interface HomePageProps {
  onLogout: () => void;
}

const HomePage = ({ onLogout }: HomePageProps) => {
    const stats = [
        { title: 'Viagens Ativas', value: '12', icon: Plane, color: 'bg-blue-500' },
        { title: 'Aguardando Aprovação', value: '05', icon: FileText, color: 'bg-amber-500' },
        { title: 'Gastos no Mês', value: 'R$ 4.250', icon: DollarSign, color: 'bg-green-500' },
        { title: 'Próximas Viagens', value: '03', icon: Calendar, color: 'bg-purple-500' },
    ];

    const recentTrips = [
        { id: 1, destination: 'São Paulo, SP', date: '15 Mar 2026', status: 'Aprovado', user: 'Ana Silva' },
        { id: 2, destination: 'Curitiba, PR', date: '22 Mar 2026', status: 'Pendente', user: 'Carlos M.' },
        { id: 3, destination: 'Fortaleza, CE', date: '10 Abr 2026', status: 'Em análise', user: 'Renan O.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Sistema de Gestão de Viagens</h1>
                    <p className="text-gray-600">Bem-vindo de volta! Aqui está o resumo das operações.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg">
                        <Plus size={20} />
                        Nova Solicitação
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-all"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`${stat.color} p-3 rounded-lg text-white`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Solicitações Recentes</h2>
                        <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                            Ver todas <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">Destino</th>
                                    <th className="px-6 py-4">Viajante</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentTrips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{trip.destination}</td>
                                        <td className="px-6 py-4 text-gray-600">{trip.user}</td>
                                        <td className="px-6 py-4 text-gray-600">{trip.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trip.status === 'Aprovado' ? 'bg-green-100 text-green-700' :
                                                trip.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {trip.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Shortcuts */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center gap-3">
                                <FileText className="text-blue-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">Prestar Contas (Reembolso)</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center gap-3">
                                <Calendar className="text-blue-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">Consultar Agenda</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Precisa de Ajuda?</h3>
                        <p className="text-blue-100 text-sm mb-4">Confira nossa central de ajuda para políticas de viagem da empresa.</p>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded font-bold text-sm">
                            Ver Manuais
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;