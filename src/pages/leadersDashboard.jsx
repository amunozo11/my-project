import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { FiChevronRight, FiFolder, FiLogOut, FiPlus, FiSearch, FiSettings, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import axios from "axios";
import ProjectInfo from "../components/ProjectsInfo";

const LeaderDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    let id;
    id = JSON.parse(localStorage.getItem('user'));
    // Obtener proyectos al cargar el componente
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/proyecto/lider/${id}`);
                // Accede a la propiedad "proyectos" y verifica que sea un array
                if (Array.isArray(response.data.proyectos)) {
                    setProjects(response.data.proyectos);
                } else {
                    console.error("La propiedad 'proyectos' no es un array:", response.data.proyectos);
                    setProjects([]); // Maneja el caso en que no sea un array
                }
            } catch (error) {
                console.error("Error al cargar proyectos:", error);
                setProjects([]); // En caso de error, establece un array vacío
            }
        };
        fetchProjects();
    }, []);

    const logoutUser = () => {
        localStorage.removeItem('user');
        navigate('/login');  // O la ruta que desees para redirigir al usuario después de cerrar sesión
    };


    const handleCreateProject = async (project) => {
        try {
            console.log(project);
            const response = await axios.post("http://localhost:5000/proyecto/crear", project);
            console.log(response	);
            setProjects((prevProjects) => Array.isArray(prevProjects) ? [...prevProjects, { ...project, id: response.data.id }] : [{ ...project, id: response.data.id }]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al crear proyecto:", error);
        }
    };

    const handleSelectProject = (project) => {
        setSelectedProject(project);
    };

    const handleCloseProjectDetails = () => {
        setSelectedProject(null);
    };

    const filteredProjects = Array.isArray(projects) ? projects.filter((project) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (project.titulo && project.titulo.toLowerCase().includes(searchLower)) ||
            (project.descripcion && project.descripcion.toLowerCase().includes(searchLower))
        );
    }) : [];



    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="w-64 bg-green-800 p-6 flex flex-col"
            >
                <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    Dashboard
                </h2>
                <nav className="flex-grow">
                    <ul className="space-y-4">
                        {[{ icon: FiFolder, text: "Proyectos" }, { icon: FiUser, text: "Perfil", to: "/profile" }, { icon: FiSettings, text: "Configuración" }]
                            .map((item, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-700 transition-colors group"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item.to) navigate(item.to);
                                        }}
                                    >
                                        <item.icon className="text-green-400 group-hover:text-white transition-colors" />
                                        <span>{item.text}</span>
                                        <FiChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                    </ul>
                </nav>
                <button
                    className="mt-auto flex items-center space-x-2 p-2 rounded-lg hover:bg-green-700 transition-colors group"
                    onClick={() => {
                        logoutUser
                        alert("Sesión cerrada");
                        window.location.href = "/";
                    }}
                >
                    <FiLogOut className="text-green-400 group-hover:text-white transition-colors" />
                    <span>Cerrar Sesión</span>

                </button>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 p-4 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            Dashboard Líder del Proyecto
                        </h1>
                        <span className="text-green-400">Líder del Proyecto</span>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <FiSearch className="text-green-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título, descripción, fecha..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none"
                                />
                            </div>
                            <button
                                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-green-500/50"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FiPlus />
                                <span>Crear Proyecto</span>
                            </button>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                                Proyectos Creados
                            </h2>
                            {filteredProjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProjects.map((project) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-green-500/50 transition-all duration-300 border border-green-500/30 cursor-pointer"
                                            onClick={() => handleSelectProject(project)}
                                        >
                                            <h3 className="font-bold text-xl mb-2 text-green-400">{project.titulo}</h3>
                                            <p className="text-gray-300 mb-4">{project.descripcion}</p>
                                            <p className="text-sm text-gray-400">
                                                <strong className="text-green-400">Fechas:</strong> {project.fecha_inicio} - {project.fecha_fin}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No hay proyectos creados aún.</p>
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>

            {/* Modal para crear proyecto */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-green-500/30"
                        >
                            <ProjectForm
                                onCreate={handleCreateProject}
                                onClose={() => setIsModalOpen(false)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal para detalles del proyecto */}
            <AnimatePresence>
            {selectedProject && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-3xl border border-green-500/30"
                    >
                        <ProjectInfo 
                            project={selectedProject}
                            onClick={handleCloseProjectDetails}
                        />
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

        </div>
    );
};

export default LeaderDashboard;
