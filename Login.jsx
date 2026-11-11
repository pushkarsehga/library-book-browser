import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const valid = role === 'admin'
      ? username === 'admin' && password === 'admin123'
      : username === 'user' && password === 'user123';
    if (!valid) return setError(`Demo ${role} login: ${role === 'admin' ? 'admin / admin123' : 'user / user123'}`);
    onLogin({ username, role });
    navigate(role === 'admin' ? '/admin' : '/user');
  };

  return <section className="container page" style={{ maxWidth: 520 }}>
    <h1 className="page-title">Library Login</h1>
    <div className="filter-panel">
      <button className={`btn ${role === 'user' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setRole('user')}>User Login</button>
      <button className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setRole('admin')}>Admin Login</button>
    </div>
    <form className="filter-panel" onSubmit={submit}>
      <label>Username<input value={username} onChange={e => setUsername(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      {error && <p role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit">Login</button>
    </form>
  </section>;
}
