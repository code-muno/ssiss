
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="navbar" style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '1rem 2rem', 
        background: '#333', 
        color: 'white',
        marginBottom: '20px'
    }}>
      <Link to="/" className="logo" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold'}}>
        SSISS Inventory
      </Link>
      
      <div className="nav-links">
        {isAuthenticated ? (
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <span>Hello, {user?.name}</span>
            <button 
                onClick={logout}
                style={{
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}
            >
                Logout
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', gap: '20px'}}>
            <Link to="/login" style={{color: 'white', textDecoration: 'none'}}>Login</Link>
            <Link to="/register" style={{color: 'white', textDecoration: 'none'}}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;