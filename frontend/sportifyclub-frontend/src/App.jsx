import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ReservaProvider } from "./context/ReservaContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Pistas from "./pages/Pistas";
import PistaDetail from "./pages/PistaDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import MisReservas from "./pages/MisReservas";
import ClubPanel from "./pages/ClubPanel";
import AdminPanel from "./pages/AdminPanel";
import GestionPistas from "./pages/GestionPistas";

export default function App() {
  return (
    <AuthProvider>
      <ReservaProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pistas" element={<Pistas />} />
                <Route path="/pistas/:id" element={<PistaDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-reservas"
                  element={
                    <ProtectedRoute>
                      <MisReservas />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/club"
                  element={
                    <ProtectedRoute requireRole="club">
                      <ClubPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/club/pistas"
                  element={
                    <ProtectedRoute requireRole="club">
                      <GestionPistas />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pistas"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <GestionPistas />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ReservaProvider>
    </AuthProvider>
  );
}
