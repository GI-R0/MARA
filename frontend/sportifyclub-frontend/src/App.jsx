import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ReservaProvider } from "./context/ReservaContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ReservaErrorBoundary from "./components/ReservaErrorBoundary";

import Home from "./pages/Home";
import Pistas from "./pages/Pistas";
import PistaDetail from "./pages/PistaDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import MisReservas from "./pages/MisReservas";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ClubPanel from "./pages/ClubPanel";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminReservas from "./pages/AdminReservas";
import GestionPistas from "./pages/GestionPistas";
import NotFound from "./pages/NotFound";

function AppLayout() {
  const location = useLocation();
  const isAuthRoute = ["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pistas" element={<Pistas />} />
          <Route
            path="/pistas/:id"
            element={
              <ReservaErrorBoundary>
                <PistaDetail />
              </ReservaErrorBoundary>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
              <ReservaErrorBoundary>
                <ProtectedRoute>
                  <MisReservas />
                </ProtectedRoute>
              </ReservaErrorBoundary>
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
            path="/admin/users"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservas"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminReservas />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}

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
          <AppLayout />
        </Router>
      </ReservaProvider>
    </AuthProvider>
  );
}
