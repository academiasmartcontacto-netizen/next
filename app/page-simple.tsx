export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Academia Smart</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>Tu marketplace inteligente</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Categorías</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>🚗 Vehículos</div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>🏠 Inmuebles</div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>📱 Electrónica</div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>👕 Prendas</div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <p style={{ color: '#666' }}>✅ Servidor funcionando correctamente</p>
        <p style={{ color: '#666' }}>✅ Página cargando sin problemas</p>
      </div>
    </div>
  )
}
