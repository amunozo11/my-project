import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle, User, Users, ListTodo, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Componente de pestañas
const Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex space-x-4 border-b-2 border-gray-700 pb-2">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => onTabChange(index)}
        className={`px-4 py-2 font-semibold ${
          activeTab === index
            ? "text-green-500 border-b-2 border-green-500"
            : "text-gray-400 hover:text-green-400"
        } transition-all duration-300`}
      >
        {tab}
      </button>
    ))}
  </div>
);

// Componente de línea de tiempo
const Timeline = ({ fases }) => {
  const phaseKeys = Object.keys(fases);

  return (
    <div className="flex items-center justify-between mt-6">
      {phaseKeys.map((fase, index) => (
        <div key={fase} className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              fases[fase].completada ? "bg-green-500" : "bg-gray-600"
            } text-white font-bold transition-all duration-500`}
          >
            {index + 1}
          </div>
          <p
            className={`mt-2 text-sm ${
              fases[fase].completada ? "text-green-400" : "text-gray-400"
            }`}
          >
            {fase.charAt(0).toUpperCase() + fase.slice(1)}
          </p>
          {index < phaseKeys.length - 1 && (
            <div
              className={`h-1 w-12 ${
                fases[fase].completada ? "bg-green-500" : "bg-gray-600"
              } mt-6`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Datos de ejemplo por defecto
const defaultProject = {
  titulo: "Proyecto de Ejemplo",
  fase: "Desarrollo",
  descripcion: "Descripción del proyecto",
  fecha_inicio: "2024-01-01",
  fecha_fin: "2024-12-31",
  leader: "Juan Pérez",
  estado: "En Progreso",
  fases: {
    planificacion: { completada: true, entregas: [] },
    desarrollo: { completada: false, entregas: [] },
    evaluacion: { completada: false, entregas: [] }
  },
  tareas: [
    { id: 1, titulo: "Tarea de ejemplo", estado: "Pendiente" }
  ],
  colaboradores: [
    { id: 1, name: "María García", role: "Desarrollador" }
  ],
  comentarios_docente: [
    "Comentario de ejemplo del docente"
  ],
  docente_id: 123 // ID del docente
};

// Componente principal
const ProjectInfo = ({ project = defaultProject }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // Controla la pestaña activa
  const [docenteName, setDocenteName] = useState("");

  useEffect(() => {
    // Obtener el nombre del docente
    if (project.docente_id) {
      const fetchDocente = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/docente/docente/${project.docente_id}`);
          setDocenteName(response.data.nombre);
        } catch (error) {
          console.error("Error al obtener nombre del docente:", error);
        }
      };
      fetchDocente();
    }
  }, [project.docente_id]);

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
      <Icon className="text-green-400" size={24} />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  // Renderizado principal
  const tabs = ["General", "Tareas", "Colaboradores", "Comentarios", "Línea de Tiempo"];

  return (
    <div className="w-full bg-gray-900 rounded-lg border border-green-500/30 p-6">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-green-500">{project.titulo}</h1>
        <p className="text-gray-400 text-sm mb-6">{project.descripcion}</p>
      </div>

      {/* Pestañas */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={CalendarDays} label="Inicio" value={project.fecha_inicio} />
            <InfoCard icon={CalendarDays} label="Fin" value={project.fecha_fin} />
            <InfoCard icon={User} label="Líder" value={project.leader} />
            <InfoCard icon={CheckCircle} label="Estado" value={project.estado} />
            <InfoCard icon={User} label="Docente" value={docenteName} />
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <ListTodo className="mr-2" size={24} />
              Tareas del Proyecto
            </h3>
            <ul className="space-y-3">
              {project.tareas.map((task) => (
                <li key={task.id} className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                  <span className="text-gray-300">{task.titulo}</span>
                  <span className="text-sm px-2 py-1 rounded-full bg-blue-900 text-blue-300">
                    {task.estado}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <Users className="mr-2" size={24} />
              Colaboradores
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.colaboradores.map((collaborator) => (
                <li key={collaborator.id} className="bg-gray-700 rounded-md p-3">
                  <div className="text-gray-300">{collaborator.name}</div>
                  <div className="text-sm text-gray-400">{collaborator.role}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <MessageSquare className="mr-2" size={24} />
              Comentarios del Docente
            </h3>
            <ul className="space-y-3">
              {project.comentarios_docente.map((comment, index) => (
                <li key={index} className="bg-gray-700 rounded-md p-4 text-gray-300">
                  {comment}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 4 && <Timeline fases={project.fases} />}
      </div>
    </div>
  );
};

export default ProjectInfo;
