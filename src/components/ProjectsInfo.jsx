import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle, User, Users, ListTodo, MessageSquare } from 'lucide-react';
import axios from 'axios';

// Datos de ejemplo por defecto
const defaultProject = {
  titulo: "Proyecto de Ejemplo",
  fase: "Desarrollo",
  fecha_inicio: "2024-01-01",
  fecha_fin: "2024-12-31",
  leader: "Juan Pérez",
  estado: "En Progreso",
  tareas: [
    { id: 1, titulo: "Tarea de ejemplo", estado: "Pendiente" }
  ],
  colaboradores: [
    { id: 1, name: "María García", role: "Desarrollador" }
  ],
  comentarios_docente: [
    "Comentario de ejemplo del docente"
  ],
  docente_id: 123 // Agregar ID del docente
};

const ProjectInfo = ({ project = defaultProject }) => {
  if (!project) return null;

  // Estado para el nombre del docente
  const [docenteName, setDocenteName] = useState("");

  useEffect(() => {
    // Si tienes el docente_id en el proyecto, realiza una solicitud para obtener el nombre del docente
    if (project.docente_id) {
      const fetchDocente = async () => {
        try {
          // Suponiendo que tienes un endpoint que devuelve los datos del docente por su ID
          const response = await axios.get(`http://localhost:5000/docente/docente/${project.docente_id}`);
          setDocenteName(response.data.nombre); // Se asume que la respuesta contiene un campo 'nombre'
          console.log("docente", response.data);
        } catch (error) {
          console.error("Error al obtener nombre del docente:", error);
        }
      };
      fetchDocente();
    }
  }, [project.docente_id]); // Solo lo hace cuando el docente_id cambia

  // Definición del componente InfoCard
  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
      <Icon className="text-green-400" size={24} />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-900 rounded-lg border border-green-500/30">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-lg p-6 shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-4">{project.titulo}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard icon={Clock} label="Fase" value={project.fases} />
          <InfoCard icon={CalendarDays} label="Inicio" value={project.fecha_inicio} />
          <InfoCard icon={CalendarDays} label="Fin" value={project.fecha_fin} />
          <InfoCard icon={User} label="Líder" value={project.leader} />
          <InfoCard icon={CheckCircle} label="Estado" value={project.estado} />
          {/* Mostrar el nombre del docente si está disponible */}
          <InfoCard icon={User} label="Docente" value={docenteName || "Cargando..."} />
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <ListTodo className="mr-2" size={24} />
              Tareas del Proyecto
            </h3>
            <ul className="space-y-3">
              {project.tareas?.map((task) => (
                <li key={task.id} className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                  <span className="text-gray-300">{task.titulo}</span>
                  <span className="text-sm px-2 py-1 rounded-full bg-blue-900 text-blue-300">
                    {task.estado}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <Users className="mr-2" size={24} />
              Colaboradores
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.colaboradores?.map((collaborator) => (
                <li key={collaborator.id} className="bg-gray-700 rounded-md p-3">
                  <div className="flex items-center space-x-2">
                    <User className="text-green-400" size={20} />
                    <span className="text-gray-300">{collaborator.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{collaborator.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
            <MessageSquare className="mr-2" size={24} />
            Comentarios del Docente
          </h3>
          <ul className="space-y-3">
            {project.comentarios_docente?.map((comment, index) => (
              <li key={index} className="bg-gray-700 rounded-md p-4 text-gray-300">
                {comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
