
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        SSISS
      </Link>
      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        {/* We will add the Logout button logic later */}
      </div>
    </nav>
  );
};

export default Navbar;