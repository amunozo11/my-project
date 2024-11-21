import React from 'react';
import { motion } from 'framer-motion';

const ProjectList = ({ project, setActiveProject }) => {
    return (
        <motion.div
            key={project.id}
            layoutId={`project-${project.id}`}
            className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
            onClick={() => setActiveProject(project)}
        >
            <h3 className="font-bold text-xl mb-2 text-blue-400">{project.titulo}</h3>
            <p className="text-gray-300 mb-4">{project.descripcion}</p>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Inicio: {project.fecha_inicio}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Fin: {project.fecha_fin}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectList;
