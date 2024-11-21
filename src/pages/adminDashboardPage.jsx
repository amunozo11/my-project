import { AnimatePresence, motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { FiBell, FiCheckCircle, FiChevronRight, FiClock, FiFolder, FiLogOut, FiMenu, FiSearch, FiSettings, FiUsers } from 'react-icons/fi'
import axios from 'axios'
import UserTable from '../components/userTable'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])  // Estado vacío al inicio
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)  // Para mostrar loading
  const [error, setError] = useState(null)  // Para mostrar posibles errores

  // Función para cargar los usuarios desde el backend
  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/admin/usuarios') // Asegúrate de tener esta URL correcta
      setUsers(response.data)  // Los usuarios del backend se almacenan en el estado
      setLoading(false)
    } catch (err) {
      setError('Error al cargar los usuarios')  // Si hay un error, lo almacenamos
      setLoading(false)
    }
  }

  // Llamar a loadUsers cuando el componente se monta
  useEffect(() => {
    loadUsers()
  }, [])

  // Filtrar los usuarios según búsqueda y estado de aprobación
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      (filter === 'approved' && user.aprobado) ||
      (filter === 'pending' && !user.aprobado)

    return matchesSearch && matchesFilter
  })

  // Aprobar un usuario
  const approveUser = async (userId) => {
    try {
      // Actualizar inmediatamente el estado para reflejar el cambio
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, aprobado: true } : user
        )
      );

      // Luego, realizar la solicitud al backend
      const response = await axios.post(`http://localhost:5000/auth/admin/aprobar/${userId}`);

      if (response.status !== 200) {
        // Si la respuesta del servidor no es exitosa, revertimos el cambio
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.uid === userId ? { ...user, aprobado: false } : user
          )
        );
        setError("Error al aprobar el usuario");
      }
    } catch (err) {
      console.error('Error al aprobar el usuario:', err);
      setError('Error al aprobar el usuario');
    }
  };


  // Manejo de logout
  const handleLogout = () => {
    alert('Sesión cerrada')
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden w-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        {/* Header */}
        <header className="bg-gray-800 shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mr-4 text-white">
                <FiMenu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
              </button>
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center space-x-2 p-2 rounded-lg hover:bg-green-700 transition-colors group"
              >
                <FiLogOut className="text-green-400 group-hover:text-white transition-colors" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          {/* Mostrar loading o error */}
          {loading && <div className="text-center text-white">Cargando usuarios...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}

          {/* Tarjetas de estadísticas */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <div className="bg-gray-800 rounded-lg shadow-md p-6 flex items-center border border-green-500/30">
              <div className="p-3 rounded-full bg-blue-500 bg-opacity-75 text-white mr-4">
                <FiUsers className="text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-400">Total Usuarios</h2>
                <p className="text-3xl font-semibold text-green-400">{users.length}</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-md p-6 flex items-center border border-green-500/30">
              <div className="p-3 rounded-full bg-green-500 bg-opacity-75 text-white mr-4">
                <FiCheckCircle className="text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-400">Usuarios Aprobados</h2>
                <p className="text-3xl font-semibold text-green-400">{users.filter(user => user.aprobado).length}</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-md p-6 flex items-center border border-green-500/30">
              <div className="p-3 rounded-full bg-yellow-500 bg-opacity-75 text-white mr-4">
                <FiClock className="text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-400">Usuarios Pendientes</h2>
                <p className="text-3xl font-semibold text-green-400">{users.filter(user => !user.aprobado).length}</p>
              </div>
            </div>
          </motion.div>

          {/* Filtro y búsqueda */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-gray-800 rounded-lg shadow-md p-6 border border-green-500/30"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-grow md:mr-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="approved">Aprobados</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>
          </motion.div>

          {/* Tabla de usuarios */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <UserTable users={filteredUsers} onApprove={approveUser} />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
