import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import API from "../api/axiosConfig";
import "../styles/Dashboard.css";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingUserId, setSavingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching admin users:", err);
        setError("No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!newRole || !["user", "club", "admin"].includes(newRole)) return;
    setSavingUserId(userId);
    try {
      const res = await API.put(`/auth/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? res.data.user : user)),
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("No se pudo actualizar el rol del usuario.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (currentUser?._id === userId) {
      setError("No puedes eliminar tu propia cuenta.");
      return;
    }

    if (!window.confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingUserId(userId);
    try {
      await API.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("No se pudo eliminar el usuario.");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Usuarios</h1>
            <p className="dashboard-subtitle">
              Lista de usuarios registrados en el sistema
            </p>
          </div>
          <Link to="/admin" className="btn-secondary">
            Volver al panel
          </Link>
        </div>

        {loading ? (
          <div className="loading-screen">
            <p>Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="error-alert">{error}</div>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Registrado</th>
                  <th>Última actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6">No hay usuarios registrados.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          disabled={
                            currentUser?._id === user._id || savingUserId === user._id
                          }
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        >
                          <option value="user">user</option>
                          <option value="club">club</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString("es-ES")}</td>
                      <td>{new Date(user.updatedAt).toLocaleDateString("es-ES")}</td>
                      <td>
                        <button
                          className="btn-delete small"
                          disabled={
                            currentUser?._id === user._id || deletingUserId === user._id
                          }
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          {deletingUserId === user._id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
