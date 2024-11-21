import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { LogOut, FolderOpen, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
=======
import { LogOut, FolderOpen, ChevronRight } from 'lucide-react';
>>>>>>> 7bd7ba2935cc7479efae9f4e3d032e225c1a4b3c
import ProjectInfo from '../components/ProjectsInfo';
import axios from 'axios';

const TeacherDashboard = () => {
<<<<<<< HEAD
    const [projects, setProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
=======
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
>>>>>>> 7bd7ba2935cc7479efae9f4e3d032e225c1a4b3c

    const teacherId = JSON.parse(localStorage.getItem('user'));

    // Cargar proyectos al inicio
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Utilizamos el mismo endpoint que el líder pero filtramos por docente_id
                const response = await axios.get(`http://localhost:5000/docente/mis-proyectos/${teacherId}`);
                if (response.data) {
                    setProjects(response.data);
                } else {
                    console.error("La respuesta no contiene un array de proyectos:", response.data);
                    setProjects([]);
                }
            } catch (error) {
                console.error("Error al cargar proyectos:", error);
                setProjects([]);
            }
        };
        fetchProjects();
    }, [teacherId]);

    // Manejar comentarios en las fases
    const handlePhaseComment = async (projectId, phase, comment) => {
        try {
            await axios.post(`http://localhost:5000/docente/proyecto/${projectId}/fase/${phase}/comentar`, {
                comentario: comment
            });
            
            // Actualizar el proyecto en el estado local
            setProjects(prevProjects => 
                prevProjects.map(project => 
                    project.id === projectId
                        ? {
                            ...project,
                            fases: {
                                ...project.fases,
                                [phase]: {
                                    ...project.fases[phase],
                                    comentarios: [
                                        ...(project.fases[phase]?.comentarios || []),
                                        { texto: comment, fecha: new Date() }
                                    ]
                                }
                            }
                        }
                        : project
                )
            );
        } catch (error) {
            console.error("Error al agregar comentario:", error);
            alert("Error al agregar el comentario");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

<<<<<<< HEAD
    // Filtrar proyectos según el término de búsqueda
    const filteredProjects = projects.filter(project => {
        const searchLower = searchTerm.toLowerCase();
        return (
            project.titulo?.toLowerCase().includes(searchLower) ||
            project.descripcion?.toLowerCase().includes(searchLower) ||
            project.lider?.toLowerCase().includes(searchLower)
        );
    });
=======
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <p>Cargando proyectos...</p>
            </div>
        );
    }
>>>>>>> 7bd7ba2935cc7479efae9f4e3d032e225c1a4b3c

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
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                            Proyectos Asignados
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Search className="text-blue-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar proyecto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    <AnimatePresence>
                        {filteredProjects.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredProjects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        layoutId={`project-${project.id}`}
                                        className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group"
                                        onClick={() => setActiveProject(project)}
                                    >
<<<<<<< HEAD
                                        <h3 className="font-bold text-xl mb-2 text-blue-400 group-hover:text-blue-300">
                                            {project.titulo}
                                        </h3>
                                        <p className="text-gray-300 mb-4">{project.descripcion}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Líder:</span>
                                                <span className="text-gray-300">{project.lider}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Inicio:</span>
                                                <span className="text-gray-300">{project.fecha_inicio}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Fin:</span>
                                                <span className="text-gray-300">{project.fecha_fin}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Estado:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    project.estado === 'Completado' 
                                                        ? 'bg-green-900 text-green-300' 
                                                        : 'bg-blue-900 text-blue-300'
                                                }`}>
                                                    {project.estado || 'En progreso'}
                                                </span>
=======
                                        <h3 className="font-bold text-xl mb-2 text-blue-400">{project.titulo}</h3>
                                        <p className="text-gray-300 mb-4">{project.descripcion}</p>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-300">Inicio: {project.fecha_inicio}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-300">Fin: {project.fecha_fin}</span>
>>>>>>> 7bd7ba2935cc7479efae9f4e3d032e225c1a4b3c
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <FolderOpen size={48} className="mb-4" />
                                <p>No hay proyectos asignados</p>
                            </div>
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
<<<<<<< HEAD
                            <ProjectInfo 
                                project={activeProject}
                                onClick={() => setActiveProject(null)}
                                onCommentSubmit={handlePhaseComment}
                                isTeacher={true}
                            />
=======
                            <ProjectInfo project={activeProject} onClick={handleCommentSubmit} />
>>>>>>> 7bd7ba2935cc7479efae9f4e3d032e225c1a4b3c
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherDashboard;
