import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiCalendar, FiCheck, FiFileText, FiUpload, FiX } from 'react-icons/fi';
import carreras from '../data/carreras';
import facultades from '../data/facultades';
import axios from 'axios';

const ProjectForm = ({ onCreate, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [faculty, setFaculty] = useState('');
    const [career, setCareer] = useState('');
    const [file, setFile] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [users, setUsers] = useState([]);
    // Estados para docentes
    const [searchTextTeacher, setSearchTextTeacher] = useState('');
    const [filteredUsersTeacher, setFilteredUsersTeacher] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Estados para colaboradores
    const [searchTextCollaborator, setSearchTextCollaborator] = useState('');
    const [filteredUsersCollaborator, setFilteredUsersCollaborator] = useState([]);
    const [selectedCollaborator, setSelectedCollaborator] = useState(null);

    // Obtener la lista de usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/admin/usuarios');
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        fetchUsers();
    }, []);

    // Búsqueda de docentes
    const handleSearchTeacher = (text) => {
        setSearchTextTeacher(text);
        const filtered = users.filter(
            (user) =>
                user.email.toLowerCase().includes(text.toLowerCase()) &&
                user.rol === 'docente_guia' &&
                user.aprobado
        );
        setFilteredUsersTeacher(filtered);
    };

    // Búsqueda de colaboradores
    const handleSearchCollaborator = (text) => {
        setSearchTextCollaborator(text);
        const filtered = users.filter(
            (user) =>
                user.email.toLowerCase().includes(text.toLowerCase()) &&
                user.rol === 'colaborador' &&
                user.aprobado
        );
        setFilteredUsersCollaborator(filtered);
    };

    // Seleccionar docente
    const handleSelectTeacher = (user) => {
        setSelectedTeacher(user);
        setSearchTextTeacher(user.email);
        setFilteredUsersTeacher([]);
    };

    // Seleccionar colaborador
    const handleSelectCollaborator = (user) => {
        setSelectedCollaborator(user);
        setSearchTextCollaborator(user.email);
        setFilteredUsersCollaborator([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !description || !startDate || !endDate || !faculty || !career || !selectedTeacher) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        const newProject = {
            lider_id: JSON.parse(localStorage.getItem('user')),
            id: Date.now(),
            titulo: title,
            descripcion: description,
            fecha_inicio: startDate,
            fecha_fin: endDate,
            facultad: faculty,
            carrera: career,
            archivo: file,
            colaboradores_id: selectedCollaborator?.uid,
            docente_id: selectedTeacher.uid,
            estado: 'activo',
            fases: {
                desarrollo: { completada: false, entregas: [] },
                evaluacion: { completada: false, entregas: [] },
                planificacion: { completada: false, entregas: [] },
            },
            fecha_creacion: new Date().toISOString(),
            tareas: [],
        };

        onCreate(newProject);
        onClose();
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.form
                onSubmit={handleSubmit}
                className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl border border-green-500/30"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Crear Nuevo Proyecto</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white hover:text-green-200 transition-colors focus:outline-none"
                    >
                        <FiX size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <label className="block">
                            <span className="text-green-400 font-semibold flex items-center">
                                <FiFileText className="mr-2" />
                                Título del Proyecto
                            </span>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Ingrese el título del proyecto"
                            />
                        </label>
                        <label className="block">
                            <span className="text-green-400 font-semibold flex items-center">
                                <FiFileText className="mr-2" />
                                Descripción
                            </span>
                            <textarea
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="Describa brevemente el proyecto"
                            ></textarea>
                        </label>
                    </motion.div>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="block">
                            <span className="text-green-400 font-semibold flex items-center">
                                <FiCalendar className="mr-2" />
                                Fecha de Inicio
                            </span>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block">
                            <span className="text-green-400 font-semibold flex items-center">
                                <FiCalendar className="mr-2" />
                                Fecha de Fin
                            </span>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </label>
                    </motion.div>
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block">
                            <span className="text-green-400 font-semibold flex items-center">
                                <FiBookOpen className="mr-2" />
                                Facultad
                            </span>
                            <select
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                                value={faculty}
                                onChange={(e) => {
                                    setFaculty(e.target.value);
                                    setCareer('');
                                }}
                                required
                            >
                                <option value="">Seleccione una Facultad</option>
                                {facultades.map((fac, index) => (
                                    <option key={index} value={fac}>
                                        {fac}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {faculty && carreras[faculty] && (
                            <label className="block">
                                <span className="text-green-400 font-semibold flex items-center">
                                    <FiBookOpen className="mr-2" />
                                    Carrera
                                </span>
                                <select
                                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                                    value={career}
                                    onChange={(e) => setCareer(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione una Carrera</option>
                                    {carreras[faculty].map((car, index) => (
                                        <option key={index} value={car}>
                                            {car}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                        <label className="block relative">
                            <span className="text-green-400 font-semibold flex items-center">
                                Docentes (Correo)
                            </span>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500"
                                value={searchTextTeacher}
                                onChange={(e) => handleSearchTeacher(e.target.value)}
                                placeholder="Buscar docente por correo"
                            />
                            {filteredUsersTeacher.length > 0 && (
                                <div className="absolute bg-gray-800 w-full z-10 rounded-md shadow-lg max-h-40 overflow-auto">
                                    {filteredUsersTeacher.map((user) => (
                                        <div
                                            key={user.uid}
                                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                            onClick={() => handleSelectTeacher(user)}
                                        >
                                            {user.email}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </label>
                        <label className="block relative">
                            <span className="text-green-400 font-semibold flex items-center">
                                Colaboradores (Correo)
                            </span>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-green-500"
                                value={searchTextCollaborator}
                                onChange={(e) => handleSearchCollaborator(e.target.value)}
                                placeholder="Buscar colaborador por correo"
                            />
                            {filteredUsersCollaborator.length > 0 && (
                                <div className="absolute bg-gray-800 w-full z-10 rounded-md shadow-lg max-h-40 overflow-auto">
                                    {filteredUsersCollaborator.map((user) => (
                                        <div
                                            key={user.uid}
                                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                            onClick={() => handleSelectCollaborator(user)}
                                        >
                                            {user.email}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </label>

                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="block">
                            <span className="text-green-400 font-semibold flex items-center">
                                <FiUpload className="mr-2" />
                                Subir Documento (PDF/Word/Rar/Zip)
                            </span>
                            <div className="mt-1">
                                <label className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 border-gray-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-green-500 focus:outline-none">
                                    <span className="flex items-center space-x-2">
                                        <FiUpload className="w-6 h-6 text-green-400" />
                                        <span className="font-medium text-green-400">
                                            {file ? file.name : 'Haga clic para seleccionar un archivo'}
                                        </span>
                                    </span>
                                    <input
                                        type="file"
                                        name="file-upload"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.rar,.zip"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </label>
                            </div>
                        </label>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >

                    </motion.div>
                </div>
                <motion.div
                    className="bg-gray-800 px-6 py-4 flex justify-end space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                    >
                        <FiCheck className="mr-2" />
                        Crear Proyecto
                    </button>
                </motion.div>
            </motion.form>
        </motion.div>
    );

}
export default ProjectForm;
