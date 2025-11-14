import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AdminProducts from './pages/AdminProducts';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        console.log('Usuário recuperado:', parsed);
        setUser(parsed);
      } catch (err) {
        console.error('Erro ao recuperar usuário:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            Fashion Store
          </Link>
          <ul className="nav-menu">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/products" className="nav-link">Produtos</Link>
                </li>
                <li className="nav-item">
                  <Link to="/orders" className="nav-link">Meus Pedidos</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/products" className="nav-link">Admin</Link>
                </li>
                <li className="nav-item">
                  <span className="nav-user">Olá, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-btn">Sair</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Cadastrar</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={user ? <Navigate to="/products" replace /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/products" replace /> : <Register />} />
          <Route path="/products" element={user ? <Products user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/orders" element={user ? <Orders user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/admin/products" element={user ? <AdminProducts /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;