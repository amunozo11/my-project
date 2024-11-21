import React, { useState } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserCheck } from 'react-icons/fi';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Manejo del cambio en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Enviar datos de registro al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Enviar la solicitud POST al backend
      const response = await axios.post('http://localhost:5000/auth/registro', formData);

      // Si la respuesta es exitosa
      setSuccess('¡Registro exitoso! Puedes iniciar sesión ahora.');
      setFormData({ nombre: '', email: '', password: '', rol: '' }); // Limpiar formulario
    } catch (err) {
      // En caso de error
      setError(err.response ? err.response.data.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-800 shadow-lg rounded-lg border border-green-500/30">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Registro
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
              Nombre Completo
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 rounded-md"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo Electrónico
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 rounded-md"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-10 py-2 rounded-md"
                placeholder="********"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <FiEye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Rol */}
          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-300">
              Rol
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUserCheck className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 rounded-md"
              >
                <option value="">Selecciona un rol</option>
                <option value="admin">Administrador</option>
                <option value="director_programa">Director de Programa</option>
                <option value="lider_proyecto">Líder del Proyecto</option>
                <option value="colaborador">Colaborador</option>
                <option value="docente_guia">Docente Guía</option>
              </select>
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}

          {/* Botón de registro */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'}`}
            >
              {loading ? 'Cargando...' : 'Registrarse'}
            </button>
          </div>
        </form>

        {/* Enlace para iniciar sesión */}
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <a href="/" className="font-medium text-green-400 hover:text-green-300">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
}
