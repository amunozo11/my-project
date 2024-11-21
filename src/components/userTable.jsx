import { motion } from 'framer-motion';
import React from 'react';
import { FiCheck, FiTrash2, FiX } from 'react-icons/fi';

const UserTable = ({ users, onApprove, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md border border-green-500/30">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Correo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {users.map((user, index) => (
            <motion.tr
              key={user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-200">{user.nombre}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-400">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-400">{user.rol || 'Sin Asignar'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.aprobado ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                    <FiCheck className="mr-1 mt-1" /> Aprobado
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                    <FiX className="mr-1 mt-1" /> Pendiente
                  </span>
                )}
              </td>
              <td className="px-2 py-2 whitespace-nowrap text-sm font-medium p-2 space-x-2">
                {!user.aprobado && (
                  <button
                    className="bg-green-600 text-white px-2 py-2 rounded-3xl hover:bg-green-700 transition duration-300 ease-in-out inline-flex items-center w-28 justify-center"
                    onClick={() => onApprove(user.uid)}
                  >
                    <FiCheck className="mr-1" /> Aprobar
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
