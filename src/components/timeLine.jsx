// Timeline.jsx
import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const phaseVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const expandedContentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const Timeline = ({ projectData, onProjectUpdate }) => {
  const [expandedPhases, setExpandedPhases] = useState({});
  const [newAdvances, setNewAdvances] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePhase = (phaseName) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseName]: !prev[phaseName]
    }));
  };

  const handleNewAdvanceChange = (phaseName, value) => {
    setNewAdvances(prev => ({
      ...prev,
      [phaseName]: value
    }));
  };

  const handleCompletePhase = async (phaseName) => {
    try {
      console.log('Completing phase:', phaseName, 'for project:', projectData.id);
      const response = await axios.post(
        `http://localhost:5000/proyecto/${projectData.id}/fase/${phaseName}/completar`
      );

      if (response.status === 200) {
        const updatedFases = {
          ...projectData.fases,
          [phaseName]: {
            ...projectData.fases[phaseName],
            completada: true
          }
        };
        onProjectUpdate(updatedFases);
      }
    } catch (error) {
      console.error('Error al completar la fase:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Error al completar la fase');
    }
  };

  const handleAddAdvance = async (phaseName) => {
    if (!newAdvances[phaseName]?.trim()) {
      alert('Por favor, ingresa una descripción del avance');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/proyecto/${projectData.id}/fase/${phaseName}/avance`,
        {
          descripcion: newAdvances[phaseName],
          fecha: new Date().toISOString().split('T')[0]
        }
      );

      if (response.status === 200) {
        const updatedFases = {
          ...projectData.fases,
          [phaseName]: {
            ...projectData.fases[phaseName],
            avances: [
              ...(projectData.fases[phaseName].avances || []),
              {
                descripcion: newAdvances[phaseName],
                fecha: new Date().toISOString().split('T')[0]
              }
            ]
          }
        };
        onProjectUpdate(updatedFases);
        setNewAdvances(prev => ({
          ...prev,
          [phaseName]: ''
        }));
      }
    } catch (error) {
      console.error('Error al agregar avance:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Error al agregar el avance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPhase = (phaseName, phase, index) => {
    const isCompleted = phase.completada;
    const isExpanded = expandedPhases[phaseName];
    
    return (
      <motion.div
        key={phaseName}
        variants={phaseVariants}
        className="relative flex flex-col mb-8 group"
      >
        {/* Timeline line */}
        {index !== Object.keys(projectData.fases).length - 1 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            className="absolute w-0.5 bg-gradient-to-b from-green-500 to-green-500/30 left-6 top-6"
          />
        )}
        
        {/* Phase header */}
        <motion.div 
          className="flex items-center mb-2 hover:bg-gray-800/50 rounded-lg p-2 transition-colors duration-200"
          whileHover={{ x: 10 }}
        >
          <motion.div 
            className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 
              ${isCompleted ? 'bg-green-500' : 'bg-gray-700'} transition-colors duration-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle 
              className={isCompleted ? 'text-white' : 'text-green-500'} 
              size={24} 
            />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center">
              <h4 className="text-lg font-semibold text-white capitalize mr-4">
                {phaseName}
              </h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePhase(phaseName)}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="text-gray-400" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400" size={20} />
                )}
              </motion.button>
            </div>
            <p className="text-sm text-gray-400 flex items-center">
              <Clock size={14} className="mr-2" />
              {phase.descripcion || `Fase de ${phaseName}`}
            </p>
          </div>
          {!isCompleted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCompletePhase(phaseName)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-lg hover:shadow-green-500/50"
            >
              Completar Fase
            </motion.button>
          )}
        </motion.div>
        
        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={expandedContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="ml-16 space-y-6 overflow-hidden"
            >
              {/* Deliverables section */}
              {phase.entregas && phase.entregas.length > 0 && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h5 className="text-sm font-semibold text-green-400 flex items-center">
                    <Clock className="mr-2" size={16} />
                    Entregas:
                  </h5>
                  {phase.entregas.map((entrega, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gray-800 p-3 rounded-md border border-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
                    >
                      <p className="text-white">{entrega.descripcion}</p>
                      <p className="text-sm text-gray-400">
                        Fecha límite: {new Date(entrega.fecha_entrega).toLocaleDateString('es-ES')}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Advances section */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h5 className="text-sm font-semibold text-green-400 flex items-center">
                  <Clock className="mr-2" size={16} />
                  Avances:
                </h5>
                
                {/* Existing advances */}
                <AnimatePresence>
                  {phase.avances && phase.avances.length > 0 ? (
                    <motion.div className="space-y-3">
                      {phase.avances.map((avance, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gray-800 p-3 rounded-md border border-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
                        >
                          <p className="text-white">{avance.descripcion}</p>
                          <p className="text-sm text-gray-400">
                            Fecha: {new Date(avance.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="text-gray-400">No hay avances registrados</p>
                  )}
                </AnimatePresence>

                {/* Add new advance */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex gap-2">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      value={newAdvances[phaseName] || ''}
                      onChange={(e) => handleNewAdvanceChange(phaseName, e.target.value)}
                      placeholder="Describe el avance..."
                      className="flex-1 px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddAdvance(phaseName)}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
                    >
                      <Plus size={18} />
                      <span>Agregar</span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.h3 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-green-400 mb-6"
      >
        Línea de Tiempo del Proyecto
      </motion.h3>
      <div className="relative">
        {Object.entries(projectData.fases || {}).map(([phaseName, phase], index) => 
          renderPhase(phaseName, phase, index)
        )}
      </div>
    </motion.div>
  );
};

export default Timeline;