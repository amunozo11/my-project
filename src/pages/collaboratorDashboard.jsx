import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FiCheckCircle, FiChevronRight, FiLogOut, FiMessageSquare, FiSearch } from 'react-icons/fi';

const CollaboratorDashboard = () => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Revisar la documentación inicial',
            description: 'Revisar y validar el análisis funcional del proyecto.',
            status: 'En progreso',
            comment: '',
        },
        {
            id: 2,
            title: 'Implementar prototipo inicial',
            description: 'Crear el diseño básico de la interfaz principal.',
            status: 'Pendiente',
            comment: '',
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTaskId, setActiveTaskId] = useState(null);

    const handleLogout = () => {
        alert('Sesión cerrada');
        window.location.href = '/';
    };

    const handleTaskStatus = (taskId, status) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status } : task
            )
        );
    };

    const handleTaskCommentChange = (taskId, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, comment: value } : task
            )
        );
    };

    const handleTaskCommentSubmit = (taskId) => {
        const task = tasks.find((task) => task.id === taskId);
        if (task.comment.trim()) {
            alert('Comentario guardado');
            // Aquí podrías guardar el comentario en una base de datos o en un estado global
            setActiveTaskId(null);  // Cierra el campo de comentario después de enviar
        } else {
            alert('Por favor ingresa un comentario');
        }
    };

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="w-64 bg-blue-800 p-6 flex flex-col"
            >
                <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
                    Dashboard
                </h2>
                <nav className="flex-grow">
                    <ul className="space-y-4">
                        <li>
                            <a
                                href="#"
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors group"
                            >
                                <FiCheckCircle className="text-blue-400 group-hover:text-white transition-colors" />
                                <span>Tareas</span>
                                <FiChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                    </ul>
                </nav>
                <button
                    className="mt-auto flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors group"
                    onClick={handleLogout}
                >
                    <FiLogOut className="text-blue-400 group-hover:text-white transition-colors" />
                    <span>Cerrar Sesión</span>
                </button>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 p-4 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
                            Dashboard Colaborador
                        </h1>
                        <span className="text-blue-400">Colaborador</span>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Search Bar */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <FiSearch className="text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar tareas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Task List */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
                                Tareas Asignadas
                            </h2>
                            {filteredTasks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-blue-500/50 transition-all duration-300 border border-blue-500/30"
                                            onClick={() => setActiveTaskId(task.id)}
                                        >
                                            <h3 className="font-bold text-xl mb-2 text-blue-400">
                                                {task.title}
                                            </h3>
                                            <p className="text-gray-300 mb-4">{task.description}</p>
                                            <p className="text-sm text-gray-400 mb-2">
                                                <strong className="text-blue-400">Estado:</strong> {task.status}
                                            </p>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() =>
                                                        handleTaskStatus(task.id, 'En progreso')
                                                    }
                                                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                                                        task.status === 'En progreso'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-blue-700'
                                                    }`}
                                                >
                                                    En progreso
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleTaskStatus(task.id, 'Completada')
                                                    }
                                                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                                                        task.status === 'Completada'
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-green-700'
                                                    }`}
                                                >
                                                    Completada
                                                </button>
                                            </div>

                                            {/* Comment input field for the active task */}
                                            {activeTaskId === task.id && (
                                                <div className="mt-4">
                                                    <textarea
                                                        value={task.comment}
                                                        onChange={(e) =>
                                                            handleTaskCommentChange(task.id, e.target.value)
                                                        }
                                                        placeholder="Escribe tu comentario sobre esta tarea..."
                                                        className="w-full p-4 bg-gray-700 text-gray-300 rounded-md resize-none focus:outline-none"
                                                        rows="4"
                                                    />
                                                    <button
                                                        onClick={() => handleTaskCommentSubmit(task.id)}
                                                        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    >
                                                        <FiMessageSquare /> Enviar comentario
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No hay tareas asignadas.</p>
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default CollaboratorDashboard;
