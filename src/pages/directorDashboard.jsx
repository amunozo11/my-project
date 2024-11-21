import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { LogOut, FolderOpen, ChevronRight, BarChart } from 'lucide-react';
import ProjectStats from '../components/ProjectStats';
import FacultyProjectAnalysis from '../components/FacultyProjectAnalysis';
import ProjectTimelineAnalysis from '../components/ProjectTimelineAnalysis';
import ExecutiveSummary from '../components/ExecutiveSummary';
import ProjectList from '../components/projectList';
import ProjectInfo from '../components/ProjectsInfo';
import axios from 'axios';

const DirectorDashboard = () => {
    const [projects, setProjects] = useState([]); // Arreglo de proyectos
    const [activeProject, setActiveProject] = useState(null); // Proyecto activo
    const [isLoading, setIsLoading] = useState(true); // Estado para carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true); // Inicia la carga
                const response = await axios.get('http://localhost:5000/director/proyectos');
                setProjects(response.data || []); // Si no hay datos, se asigna un arreglo vacío
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Hubo un error al cargar los proyectos. Intenta de nuevo más tarde.');
                setProjects([]); // Maneja los errores
            } finally {
                setIsLoading(false); // Finaliza la carga
            }
        };

        fetchProjects();
    }, []); // No es necesario el directorId en este caso

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

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <p>{error}</p>
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
                    Director de Programa
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
                        <li>
                            <a href="#" className="flex items-center space-x-2 hover:text-blue-300 transition-colors group">
                                <BarChart className="text-blue-400 group-hover:text-blue-300" />
                                <span>Estadísticas</span>
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
                        Dashboard del Director
                    </h1>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    <AnimatePresence>
                        {/* Estadísticas de Proyectos */}
                        <div className="space-y-6">
                            <ExecutiveSummary projects={projects} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <ProjectStats projects={projects} />
                                <FacultyProjectAnalysis projects={projects} />
                            </div>
                            <ProjectTimelineAnalysis projects={projects} />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <ProjectStats projects={projects} />
                        </motion.div>

                        {/* Lista de Proyectos */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {projects.map((project) => (
                                <ProjectList
                                    key={project.id}  // Asignamos una clave única para cada proyecto
                                    project={project} // Pasamos un solo proyecto al componente
                                    setActiveProject={setActiveProject}
                                />
                            ))}
                        </motion.div>
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
                            layoutId={`project-${activeProject.id}`}  // Usamos el ID del proyecto para layoutId
                            className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl overflow-y-auto max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ProjectInfo project={activeProject} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DirectorDashboard;
