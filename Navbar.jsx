import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/navbar.css';

// Responsive navbar: links collapse behind a hamburger button on mobile
export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span aria-hidden="true">📚</span> Library<span className="brand-accent">Browser</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`hamburger ${open ? 'is-open' : ''}`} />
        </button>

        <nav className={`nav-links ${open ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          {user?.role === 'user' && <NavLink to="/books" onClick={close}>Browse Books</NavLink>}
          <NavLink to="/login" onClick={close}>Login</NavLink>
        </nav>
      </div>
    </header>
  );
}
