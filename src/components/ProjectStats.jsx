import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
    TrendingUp, 
    CheckCircle, 
    Clock, 
    XCircle, 
    BarChart2 
} from 'lucide-react';

const ProjectStats = ({ projects }) => {
    // Conteo de estados de proyectos
    const projectStats = {
        total: projects.length,
        completed: projects.filter(p => p.estado === 'Completado').length,
        inProgress: projects.filter(p => p.estado === 'activo').length,
        delayed: projects.filter(p => new Date(p.fecha_fin) < new Date() && p.estado !== 'Completado').length,
        upcoming: projects.filter(p => new Date(p.fecha_inicio) > new Date()).length
    };

    const pieData = [
        { name: 'Completados', value: projectStats.completed, color: '#00C49F' },
        { name: 'En Progreso', value: projectStats.inProgress, color: '#FFBB28' },
        { name: 'Atrasados', value: projectStats.delayed, color: '#FF8042' },
        { name: 'Próximos', value: projectStats.upcoming, color: '#0088FE' }
    ];

    return (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Resumen de Proyectos</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                    icon={<BarChart2 className="text-blue-400" />} 
                    title="Total Proyectos" 
                    value={projectStats.total} 
                />
                <StatCard 
                    icon={<CheckCircle className="text-green-400" />} 
                    title="Completados" 
                    value={projectStats.completed} 
                />
                <StatCard 
                    icon={<Clock className="text-yellow-400" />} 
                    title="En Progreso" 
                    value={projectStats.inProgress} 
                />
                <StatCard 
                    icon={<XCircle className="text-red-400" />} 
                    title="Atrasados" 
                    value={projectStats.delayed} 
                />
            </div>

            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Componente de tarjeta de estadística
const StatCard = ({ icon, title, value }) => (
    <div className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
        <div className="bg-gray-800 p-3 rounded-full">{icon}</div>
        <div>
            <h3 className="text-sm text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default ProjectStats;