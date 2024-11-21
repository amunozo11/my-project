import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [newDelivery, setNewDelivery] = useState({ title: '', phase: '', deliveryDate: '' });

    useEffect(() => {
        // Obtener detalles del proyecto
        fetch(`/proyecto/${id}`)
            .then((res) => res.json())
            .then((data) => setProject(data.proyecto))
            .catch((err) => console.error(err));
    }, [id]);

    const handleAddDelivery = () => {
        if (!newDelivery.title || !newDelivery.phase || !newDelivery.deliveryDate) {
            alert('Todos los campos son obligatorios');
            return;
        }

        fetch(`/proyecto/${id}/fase/${newDelivery.phase}/entrega`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: newDelivery.title,
                fecha_entrega: newDelivery.deliveryDate,
                archivo: null, // Agrega soporte para subir archivos si es necesario
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert('Entrega creada con éxito');
                setNewDelivery({ title: '', phase: '', deliveryDate: '' });
                setProject((prev) => ({
                    ...prev,
                    fases: {
                        ...prev.fases,
                        [newDelivery.phase]: {
                            ...prev.fases[newDelivery.phase],
                            entregas: [...prev.fases[newDelivery.phase].entregas, data.entrega],
                        },
                    },
                }));
            })
            .catch((err) => console.error(err));
    };

    if (!project) return <p>Cargando...</p>;

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">{project.titulo}</h1>
            <p className="mb-4">{project.descripcion}</p>

            <div className="space-y-6">
                {Object.entries(project.fases).map(([phase, details]) => {
                    const total = details.entregas.length;
                    const completed = details.entregas.filter(
                        (e) => e.fecha_entrega <= new Date().toISOString().split('T')[0]
                    ).length;
                    const progress = total ? (completed / total) * 100 : 0;

                    return (
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-800 p-4 rounded-lg shadow-md"
                        >
                            <h2 className="text-xl font-bold text-green-400 capitalize">{phase}</h2>
                            <div className="w-full bg-gray-700 h-4 rounded-lg mt-2 overflow-hidden">
                                <div
                                    style={{ width: `${progress}%` }}
                                    className="bg-green-500 h-full"
                                ></div>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                {completed} de {total} entregas completadas
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Formulario para agregar entrega */}
            <div className="mt-6">
                <h3 className="text-xl font-bold text-green-400">Agregar Entrega</h3>
                <div className="space-y-4 mt-4">
                    <input
                        type="text"
                        placeholder="Título"
                        value={newDelivery.title}
                        onChange={(e) => setNewDelivery({ ...newDelivery, title: e.target.value })}
                        className="w-full p-2 rounded-md bg-gray-800 text-white"
                    />
                    <select
                        value={newDelivery.phase}
                        onChange={(e) => setNewDelivery({ ...newDelivery, phase: e.target.value })}
                        className="w-full p-2 rounded-md bg-gray-800 text-white"
                    >
                        <option value="">Seleccione una fase</option>
                        {Object.keys(project.fases).map((phase) => (
                            <option key={phase} value={phase}>
                                {phase}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={newDelivery.deliveryDate}
                        onChange={(e) =>
                            setNewDelivery({ ...newDelivery, deliveryDate: e.target.value })
                        }
                        className="w-full p-2 rounded-md bg-gray-800 text-white"
                    />
                    <button
                        onClick={handleAddDelivery}
                        className="bg-gradient-to-r from-green-500 to-blue-500 px-4 py-2 rounded-md text-white flex items-center space-x-2"
                    >
                        <FiPlus />
                        <span>Agregar Entrega</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
