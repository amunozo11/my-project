import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { LogOut, FolderOpen, ChevronRight } from 'lucide-react';
import ProjectInfo from '../components/ProjectsInfo';

const TeacherDashboard = () => {
    const [projects, setProjects] = useState([
        {
            id: 1,
            title: 'Sistema de Gestión Académica',
            description: 'Proyecto para mejorar la gestión académica de la facultad.',
            startDate: '2024-09-01',
            endDate: '2024-12-01',
            deliveries: {
                firstDelivery: { comment: '' },
                secondDelivery: { comment: '' },
                thirdDelivery: { comment: '' },
            },
            comments: [],
            status: 'En Progreso',
            leader: 'Juan Pérez'
        },
        {
            id: 2,
            title: 'Plataforma de Seguimiento de Tesis',
            description: 'Herramienta para dar seguimiento a las tesis en desarrollo.',
            startDate: '2024-10-01',
            endDate: '2025-01-15',
            deliveries: {
                firstDelivery: { comment: '' },
                secondDelivery: { comment: '' },
                thirdDelivery: { comment: '' },
            },
            comments: [],
            status: 'Planificación',
            leader: 'María Rodriguez'
        },
    ]);

    const [activeProject, setActiveProject] = useState(null);

    const handleCommentSubmit = (projectId, deliveryKey, commentValue) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId
                    ? {
                          ...project,
                          deliveries: {
                              ...project.deliveries,
                              [deliveryKey]: { comment: commentValue },
                          },
                      }
                    : project
            )
        );
    };

    const handleLogout = () => {
        alert('Sesión cerrada');
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="w-64 bg-blue-900 p-6"
            >
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                    Docente Guía
                </h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <a href="#" className="flex items-center space-x-2 hover:text-blue-300 transition-colors group">
                                <FolderOpen className="text-blue-400 group-hover:text-blue-300" />
                                <span>Proyectos</span>
                                <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="mt-10 flex items-center space-x-2 hover:text-blue-300 transition-colors group"
                >
                    <LogOut className="text-blue-400 group-hover:text-blue-300" />
                    <span>Cerrar Sesión</span>
                </button>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 shadow-lg p-4">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                        Proyectos Asociados
                    </h1>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    <AnimatePresence>
                        {projects.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {projects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        layoutId={`project-${project.id}`}
                                        className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                                        onClick={() => setActiveProject(project)}
                                    >
                                        <h3 className="font-bold text-xl mb-2 text-blue-400">{project.title}</h3>
                                        <p className="text-gray-300 mb-4">{project.description}</p>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-300">Inicio: {project.startDate}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-300">Fin: {project.endDate}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-gray-400">No hay proyectos asociados aún.</p>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {activeProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setActiveProject(null)}
                    >
                        <motion.div
                            layoutId={`project-${activeProject.id}`}
                            className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl overflow-y-auto max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ProjectInfo 
                                onCommentSubmit={handleCommentSubmit}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherDashboard;