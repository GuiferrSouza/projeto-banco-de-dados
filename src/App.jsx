import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AdminProducts from './pages/AdminProducts';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
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
            <Route path="/" element={user ? <Navigate to="/products" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={user ? <div>teste</div> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <Orders user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin/products" element={user ? <AdminProducts /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;