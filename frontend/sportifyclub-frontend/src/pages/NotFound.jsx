import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Página no encontrada</h2>
      <p className="text-gray-600 text-lg mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
