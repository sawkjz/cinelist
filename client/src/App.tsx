import { Routes, Route, Link } from 'react-router-dom'
import Index from './pages/Index'
import Titulos from './pages/Titulos'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="container">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h1>Projeto Filmes</h1>
        <nav style={{display:'flex',gap:12}}>
          <Link to="/">Home</Link>
          <Link to="/titulos">Títulos</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/titulos" element={<Titulos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
