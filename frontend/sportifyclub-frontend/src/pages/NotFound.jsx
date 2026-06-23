import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
        Página no encontrada
      </h2>
      <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '2rem', textAlign: 'center' }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        style={{
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
