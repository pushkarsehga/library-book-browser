import { useMemo, useState } from 'react';

export default function AdminPanel({ books, categories, createBook, updateBook, deleteBook, requests, onApprove, onReject, onDeleteRequest, onIssue, onReturn, onFine, onLogout }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', category: 'Fiction', year: new Date().getFullYear(), rating: 4, description: '' });
  const visibleBooks = useMemo(() => books.filter(b => {
    const q = search.toLowerCase();
    return (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) && (category === 'all' || b.category === category) && (availability === 'all' || (availability === 'available' ? b.available : !b.available));
  }), [books, search, category, availability]);
  const add = e => { e.preventDefault(); createBook({ ...form, available: true, cover: '' }); setForm({ title: '', author: '', category: categories[0] || 'Fiction', year: new Date().getFullYear(), rating: 4, description: '' }); setShowAdd(false); };
  const edit = book => { setEditingId(book.id); setForm({ title: book.title, author: book.author, category: book.category, year: book.year, rating: book.rating, description: book.description }); };
  const saveEdit = e => { e.preventDefault(); updateBook(editingId, { ...form, year: Number(form.year), rating: Number(form.rating) }); setEditingId(null); };
  return <section className="container page">
    <div className="filter-panel"><h1 className="page-title">Admin / Librarian Panel</h1><button className="btn btn-outline" onClick={onLogout}>Logout</button></div>
    <p>Approve requests, issue books, receive returns and charge late fines.</p>
    <button className="btn btn-primary" onClick={() => setShowAdd(v => !v)}>+ Add new book</button>
    {showAdd && <form className="filter-panel" onSubmit={add}>
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select>
      <input type="number" placeholder="Year" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <button className="btn btn-primary">Save book</button>
    </form>}
    {editingId !== null && <form className="filter-panel" onSubmit={saveEdit}>
      <h2>Edit book</h2>
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select>
      <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
      <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <button className="btn btn-primary" type="submit">Save changes</button> <button className="btn btn-outline" type="button" onClick={() => setEditingId(null)}>Cancel</button>
    </form>}
    <h2>Library search</h2>
    <div className="filter-panel"><input placeholder="Search title or author" value={search} onChange={e => setSearch(e.target.value)} /><select value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select><select value={availability} onChange={e => setAvailability(e.target.value)}><option value="all">All status</option><option value="available">Available</option><option value="issued">Issued</option></select></div>
    <h2>All books status</h2>
    <div className="book-grid">{visibleBooks.map(book => <article className="book-card" key={book.id}>
      <div className="book-cover"><img src={book.cover} alt={`Cover of ${book.title}`} loading="lazy" /><span className={`badge ${book.available ? 'badge-available' : 'badge-issued'}`}>{book.available ? 'Available' : 'Issued / Locked'}</span></div>
      <div className="book-info"><h2 className="book-title">{book.title}</h2><p className="book-author">by {book.author}</p><p className="book-category">{book.category}</p><button className="btn btn-outline" onClick={() => edit(book)}>Update</button> <button className="btn btn-outline" onClick={() => deleteBook(book.id)}>Delete</button></div>
    </article>)}</div>
    <h2>Booking requests</h2>
    {requests.length === 0 && <p>No booking requests yet.</p>}
    {requests.map(r => <article className="filter-panel" key={r.id}><div><strong>{r.title}</strong><br />User: {r.user}<br />Requested: {r.requestedAt ? new Date(r.requestedAt).toLocaleString() : '—'}<br />Start: {r.startAt ? new Date(r.startAt).toLocaleString() : '—'}<br />Issued: {r.issuedAt ? new Date(r.issuedAt).toLocaleString() : 'Not issued'}<br />Duration: {r.duration || 7} days<br />Due: {r.dueDate ? new Date(r.dueDate).toLocaleString() : '—'}<br />Status: <strong>{r.status}</strong>{r.fine ? ` · Fine ₹${r.fine}` : ''}</div><div>
      {r.status === 'pending' && <><button className="btn btn-primary" onClick={() => onApprove(r.id)}>Approve</button> <button className="btn btn-outline" onClick={() => onReject(r.id)}>Reject</button></>}
      {r.status === 'approved' && <button className="btn btn-primary" onClick={() => onIssue(r.id)}>Issue book</button>}
      {r.status === 'issued' && <><button className="btn btn-primary" onClick={() => onReturn(r.id)}>Return book</button> <button className="btn btn-outline" onClick={() => onFine(r.id)}>Charge ₹50 fine</button></>}
      <button className="btn btn-outline" onClick={() => onDeleteRequest(r.id)}>Delete request</button>
    </div></article>)}
  </section>;
}
