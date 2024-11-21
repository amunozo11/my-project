import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { LogOut, FolderOpen, ChevronRight } from 'lucide-react';
import ProjectInfo from '../components/ProjectsInfo';
import axios from 'axios';

const TeacherDashboard = () => {
    const [projects, setProjects] = useState([]); // Inicializar como un arreglo vacío
    const [activeProject, setActiveProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar carga
    const docenteId = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true); // Inicia la carga
                const response = await axios.get(
                    `http://localhost:5000/docente/mis-proyectos/${docenteId}`
                );
                console.log(docenteId);
                setProjects(response.data || []); // Asegurarse de que sea un arreglo
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
            } finally {
                setIsLoading(false); // Finaliza la carga
            }
        };

        fetchProjects();
    }, [docenteId]);

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <p>Cargando proyectos...</p>
            </div>
        );
    }

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
                        onClick={() => setActiveProject()}
                    >
                        <motion.div
                            layoutId={`project-${activeProject.id}`}
                            className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl overflow-y-auto max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ProjectInfo project={activeProject} onClick={handleCommentSubmit} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherDashboard;
