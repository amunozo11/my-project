import { motion } from 'framer-motion';
import React from 'react';
import { FiChevronRight, FiFolder, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const Profile = () => {
    const navigate = useNavigate(); // Usar el hook de navegación

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="w-64 bg-green-800 p-6 flex flex-col"
            >
                <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Dashboard</h2>
                <nav className="flex-grow">
                    <ul className="space-y-4">
                        {[{ icon: FiFolder, text: "Proyectos", to: "/leader-dashboard" }]
                            .map((item, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevenir la acción predeterminada del enlace
                                            if (item.to) {
                                                navigate(item.to); // Navegar programáticamente
                                            }
                                        }}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-700 transition-colors group"
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
                        alert('Sesión cerrada');
                        window.location.href = '/'; // Cerrar sesión y redirigir a la página de inicio
                    }}
                >
                    <FiLogOut className="text-green-400 group-hover:text-white transition-colors" />
                    <span>Cerrar Sesión</span>
                </button>
            </motion.aside>

            {/* Profile Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 p-4 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            Perfil del Líder
                        </h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
                    <div className="space-y-6">
                        {/* Aquí puedes agregar los detalles del perfil del líder */}
                        <h2 className="text-2xl font-bold text-green-400">Detalles del Perfil</h2>
                        <p className="text-gray-300">Nombre: Líder del Proyecto</p>
                        <p className="text-gray-300">Correo: lider@proyecto.com</p>
                        {/* Puedes agregar más detalles de perfil aquí */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
