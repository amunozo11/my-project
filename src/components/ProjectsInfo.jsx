// ProjectInfo.jsx
import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Clock, CheckCircle, User, Users, 
  ListTodo, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Timeline from './timeLine';

// Animación para los cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Animación para las secciones
const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

// Estilos CSS personalizados para el scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.5);
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.8);
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(16, 185, 129, 0.5) rgba(31, 41, 55, 0.5);
  }
`;

// Componente InfoCard con animación
const InfoCard = ({ icon: Icon, label, value }) => (
  <motion.div
    variants={cardVariants}
    className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3 hover:shadow-lg hover:shadow-green-500/10 transition-shadow duration-300"
  >
    <Icon className="text-green-400" size={24} />
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-white">
        {typeof value === 'object' ? JSON.stringify(value) : value}
      </p>
    </div>
  </motion.div>
);

// Componente Principal ProjectInfo
const ProjectInfo = ({ project, onClick }) => {
  const [projectData, setProjectData] = useState(project || {});
  const [projectProgress, setProjectProgress] = useState(null);

  useEffect(() => {
    if (project?.id) {
      setProjectData(project);
      fetchProjectProgress(project.id);
    }
  }, [project]);

  const fetchProjectProgress = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:5000/proyecto/${projectId}/avance`);
      if (response.data.avance) {
        setProjectProgress(response.data.avance);
      }
    } catch (error) {
      console.error('Error al obtener el avance del proyecto:', error);
    }
  };

  const handleProjectUpdate = async (updatedFases) => {
    try {
      setProjectData(prevProject => ({
        ...prevProject,
        fases: updatedFases
      }));
      
      if (project?.id) {
        await fetchProjectProgress(project.id);
      }
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
    }
  };

  const getProjectStatus = () => {
    if (!projectData.fases) return 'Sin iniciar';
    
    const allFases = Object.values(projectData.fases);
    const completedFases = allFases.filter(fase => fase.completada);
    
    if (completedFases.length === allFases.length) return 'Completado';
    if (completedFases.length > 0) return 'En progreso';
    return 'Iniciado';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderCollaborator = (collaborator) => {
    if (typeof collaborator === 'string') {
      return collaborator;
    }
    if (typeof collaborator === 'object' && collaborator !== null) {
      return collaborator.nombre || collaborator.email || 'Sin nombre';
    }
    return 'Colaborador sin detalles';
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full bg-gray-900 rounded-lg border border-green-500/30 max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header con información general */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-white"
            >
              {projectData.titulo || 'Sin título'}
            </motion.h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClick}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar
            </motion.button>
          </div>
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <InfoCard icon={Clock} label="Estado" value={getProjectStatus()} />
            <InfoCard icon={CalendarDays} label="Inicio" value={formatDate(projectData.fecha_inicio)} />
            <InfoCard icon={CalendarDays} label="Fin" value={formatDate(projectData.fecha_fin)} />
            <InfoCard icon={User} label="Docente" value={projectData.docente?.nombre || "No asignado"} />
            {projectProgress && (
              <InfoCard 
                icon={CheckCircle} 
                label="Progreso General" 
                value={`${Math.round(
                  Object.values(projectProgress).reduce(
                    (acc, fase) => acc + fase.porcentaje_completado, 
                    0
                  ) / Object.keys(projectProgress).length
                )}%`} 
              />
            )}
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-8">
            {/* Timeline Component */}
            <AnimatePresence>
              {projectData.fases && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Timeline 
                    projectData={projectData}
                    onProjectUpdate={handleProjectUpdate}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sección de Tareas y Colaboradores */}
            <motion.div 
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Panel de Tareas */}
              <motion.div 
                variants={cardVariants}
                className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-green-500/10 transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
                  <ListTodo className="mr-2" size={24} />
                  Tareas del Proyecto
                </h3>
                <AnimatePresence>
                  {projectData.tareas && projectData.tareas.length > 0 ? (
                    <motion.ul className="space-y-3">
                      {projectData.tareas.map((task, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-700 rounded-md p-3 flex justify-between items-center hover:bg-gray-600 transition-colors duration-200"
                        >
                          <span className="text-gray-300">{task.titulo}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            task.estado === 'completada' 
                              ? 'bg-green-900 text-green-300'
                              : 'bg-blue-900 text-blue-300'
                          }`}>
                            {task.estado}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                    <p className="text-gray-400">No hay tareas registradas</p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Panel de Colaboradores */}
              <motion.div 
                variants={cardVariants}
                className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-green-500/10 transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
                  <Users className="mr-2" size={24} />
                  Colaboradores
                </h3>
                <AnimatePresence>
                  {projectData.colaboradores ? (
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {Array.isArray(projectData.colaboradores) ? (
                        projectData.colaboradores.map((colaborador, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-700 rounded-md p-3 hover:bg-gray-600 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <User className="text-green-400" size={20} />
                              <span className="text-gray-300">{renderCollaborator(colaborador)}</span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-700 rounded-md p-3"
                        >
                          <div className="flex items-center space-x-2">
                            <User className="text-green-400" size={20} />
                            <span className="text-gray-300">{renderCollaborator(projectData.colaboradores)}</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <p className="text-gray-400">No hay colaboradores asignados</p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Panel de Comentarios del Docente */}
            <AnimatePresence>
              {projectData.docente && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-green-500/10 transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
                    <MessageSquare className="mr-2" size={24} />
                    Retroalimentación del Docente
                  </h3>
                  <div className="space-y-4">
                    {projectData.comentarios_docente?.length > 0 ? (
                      <AnimatePresence>
                        {projectData.comentarios_docente.map((comment, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                          >
                            <p className="text-gray-300">{comment}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : (
                      <p className="text-gray-400">No hay comentarios del docente</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectInfo;