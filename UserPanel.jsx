import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserPanel({ user, books, categories, requests, onRequest, onLogout }) {
  const [selected, setSelected] = useState('');
  const mine = requests.filter(r => r.user === user.username);
  const request = () => { if (selected) onRequest(Number(selected), user.username); };
  return <section className="container page">
    <div className="filter-panel"><h1 className="page-title">User Panel</h1><button className="btn btn-outline" onClick={onLogout}>Logout</button></div>
    <p>Welcome, <strong>{user.username}</strong>. Request a book and wait for librarian approval.</p>
    <p>Available books: <strong>{books.filter(book => book.available).length}</strong> / {books.length}</p>
    <div className="filter-panel"><Link className="btn btn-primary" to="/books">Browse books and view details</Link></div>
    <h2>My requests</h2>
    {mine.map(r => <p key={r.id}>{r.title} — <strong>{r.status}</strong>{r.fine ? ` — Fine: ₹${r.fine}` : ''}{r.status === 'approved' || r.status === 'issued' ? <> — <Link to={`/books/${r.bookId}`}>Read</Link></> : ''}</p>)}
  </section>;
}
