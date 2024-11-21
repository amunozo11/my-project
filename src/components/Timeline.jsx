import React from "react";

const Timeline = ({ fases, faseActual }) => {
  const phaseKeys = Object.keys(fases);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between mt-6 w-full max-w-4xl">
        {phaseKeys.map((fase, index) => {
          const isActive = fase === faseActual; // Verificar si es la fase actual
          const isCompleted = fases[fase].completada;

          return (
            <div
              key={fase}
              className="flex flex-col items-center text-center relative"
            >
              {/* Círculo con animación */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all duration-500 ${
                  isCompleted
                    ? "bg-green-500"
                    : isActive
                    ? "bg-blue-500 animate-pulse"
                    : "bg-gray-600"
                }`}
              >
                {index + 1}
              </div>

              {/* Nombre de la fase */}
              <p
                className={`mt-2 text-sm transition-all duration-300 ${
                  isCompleted
                    ? "text-green-400"
                    : isActive
                    ? "text-blue-400"
                    : "text-gray-400"
                }`}
              >
                {fase.charAt(0).toUpperCase() + fase.slice(1)}
              </p>

              {/* Línea entre fases */}
              {index < phaseKeys.length - 1 && (
                <div
                  className={`h-1 w-16 ${
                    isCompleted ? "bg-green-500" : "bg-gray-600"
                  } transition-all duration-500`}
                ></div>
              )}

              {/* Tooltip interactivo */}
              {isActive && (
                <div className="absolute -bottom-12 bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg">
                  <p>
                    <strong>{fase.charAt(0).toUpperCase() + fase.slice(1)}:</strong>{" "}
                    {isCompleted ? "Completada" : "En progreso"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detalles de la fase activa */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-green-400">
          {faseActual.charAt(0).toUpperCase() + faseActual.slice(1)}
        </h3>
        <p className="text-gray-400 mt-2">
          {fases[faseActual]?.completada
            ? "Esta fase ya fue completada con éxito."
            : "Actualmente el proyecto se encuentra en esta fase."}
        </p>
      </div>
    </div>
  );
};

export default Timeline;
