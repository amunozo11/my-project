import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FacultyProjectAnalysis = ({ projects }) => {
    // Agrupar proyectos por facultad
    const facultyProjects = projects.reduce((acc, project) => {
        acc[project.facultad] = (acc[project.facultad] || 0) + 1;
        return acc;
    }, {});

    const facultyData = Object.entries(facultyProjects).map(([facultad, count]) => ({
        facultad,
        proyectos: count
    }));

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Proyectos por Facultad</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facultyData}>
                        <XAxis dataKey="facultad" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="proyectos" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FacultyProjectAnalysis;