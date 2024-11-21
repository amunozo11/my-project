import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProjectTimelineAnalysis = ({ projects }) => {
    // Procesar proyectos en línea de tiempo
    const processProjectTimeline = () => {
        const monthlyProjects = {};
        
        projects.forEach(project => {
            const startDate = new Date(project.fecha_inicio);
            const key = `${startDate.getFullYear()}-${startDate.getMonth() + 1}`;
            monthlyProjects[key] = (monthlyProjects[key] || 0) + 1;
        });

        return Object.entries(monthlyProjects)
            .map(([month, count]) => ({ month, proyectos: count }))
            .sort((a, b) => {
                const [aYear, aMonth] = a.month.split('-');
                const [bYear, bMonth] = b.month.split('-');
                return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
            });
    };

    const timelineData = processProjectTimeline();

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Proyectos por Mes</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="proyectos" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProjectTimelineAnalysis;