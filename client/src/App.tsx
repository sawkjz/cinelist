import { BrowserRouter as Router } from 'react-router-dom'
import { LoginPage } from './modules/login'
import { TitulosPage } from './modules/titulos'
import { authService } from './modules/login'
import { useState, useEffect } from 'react'

type Page = 'login' | 'titulos'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login')

  useEffect(() => {
    // Verificar se já existe token salvo
    const token = authService.getToken()
    if (token) {
      setCurrentPage('titulos')
    }
  }, [])

  const handleLoginSuccess = () => {
    setCurrentPage('titulos')
  }

  const handleLogout = () => {
    authService.logout()
    setCurrentPage('login')
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        {currentPage === 'login' && (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
        
        {currentPage === 'titulos' && (
          <div>
            <header style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
              <button onClick={handleLogout} style={{ float: 'right', padding: '5px 15px', cursor: 'pointer' }}>
                Sair
              </button>
              <h1>Sistema de Títulos</h1>
            </header>
            <TitulosPage />
          </div>
        )}
      </div>
    </Router>
  )
}
