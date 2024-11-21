import React from 'react';
import { TrendingUp, Clock, CheckCircle } from 'lucide-react';

const ExecutiveSummary = ({ projects }) => {
    const calculateMetrics = () => {
        const totalProjects = projects.length;
        const completedProjects = projects.filter(p => p.estado === 'Completado').length;
        const inProgressProjects = projects.filter(p => p.estado === 'activo').length;
        const completionRate = (completedProjects / totalProjects) * 100;

        const averageProjectDuration = projects.reduce((acc, project) => {
            const start = new Date(project.fecha_inicio);
            const end = new Date(project.fecha_fin);
            return acc + ((end - start) / (1000 * 60 * 60 * 24));
        }, 0) / totalProjects;

        return {
            totalProjects,
            completedProjects,
            inProgressProjects,
            completionRate: completionRate.toFixed(2),
            averageProjectDuration: averageProjectDuration.toFixed(2)
        };
    };

    const metrics = calculateMetrics();

    return (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">Resumen Ejecutivo</h2>
            <div className="grid md:grid-cols-3 gap-4">
                <MetricCard 
                    icon={<TrendingUp className="text-blue-400" />}
                    title="Tasa de Completación"
                    value={`${metrics.completionRate}%`}
                />
                <MetricCard 
                    icon={<CheckCircle className="text-green-400" />}
                    title="Proyectos Completados"
                    value={metrics.completedProjects}
                />
                <MetricCard 
                    icon={<Clock className="text-yellow-400" />}
                    title="Duración Promedio (días)"
                    value={metrics.averageProjectDuration}
                />
            </div>
        </div>
    );
};

const MetricCard = ({ icon, title, value }) => (
    <div className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
        <div className="bg-gray-800 p-3 rounded-full">{icon}</div>
        <div>
            <h3 className="text-sm text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default ExecutiveSummary;