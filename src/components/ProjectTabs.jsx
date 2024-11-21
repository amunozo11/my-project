import React, { useState } from "react";
import Tabs from "./Tabs";
import Timeline from "./Timeline";
import ProjectInfo from "./ProjectInfo";

const ProjectTabs = ({ project }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["General", "Tareas", "Colaboradores", "Comentarios", "Línea de Tiempo"];

  return (
    <div className="w-full bg-gray-900 rounded-lg p-6 shadow-lg">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-green-500">{project.titulo}</h1>
        <p className="text-gray-400 text-sm mb-6">{project.descripcion}</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 0 && <ProjectInfo project={project} />}
        {activeTab === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Tareas</h2>
            <ul>
              {project.tareas.map((tarea) => (
                <li key={tarea.id} className="p-4 bg-gray-800 rounded-lg mb-4">
                  <p className="text-white">{tarea.titulo}</p>
                  <p className="text-sm text-gray-400">{tarea.estado}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Colaboradores</h2>
            <ul>
              {project.colaboradores.map((colaborador) => (
                <li key={colaborador.id} className="p-4 bg-gray-800 rounded-lg mb-4">
                  <p className="text-white">{colaborador.name}</p>
                  <p className="text-sm text-gray-400">{colaborador.role}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Comentarios</h2>
            <ul>
              {project.comentarios_docente.map((comment, index) => (
                <li key={index} className="p-4 bg-gray-800 rounded-lg mb-4">
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

export default ProjectTabs;
