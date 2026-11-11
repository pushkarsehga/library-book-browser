import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/pages.css';

// Full details of a single book, looked up from the :id route parameter
export default function BookDetails({ books, user, requests, onRequest, updateBook, deleteBook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === Number(id));
  const canRead = user?.role === 'admin' || requests?.some(r => r.bookId === Number(id) && r.user === user?.username && ['approved', 'issued'].includes(r.status));
  const [duration, setDuration] = useState(7);
  const [startAt, setStartAt] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  const existingRequest = requests?.find(r => r.bookId === Number(id) && r.user === user?.username && ['pending', 'approved', 'issued'].includes(r.status));

  const toggleAvailability = () => updateBook(book.id, { available: !book.available });
  const removeBook = () => {
    if (window.confirm('Delete this book?')) {
      deleteBook(book.id);
      navigate('/books');
    }
  };

  if (!book) {
    return (
      <section className="container page empty-state">
        <h2>Book not found</h2>
        <p>We could not find a book with that ID.</p>
        <Link to="/books" className="btn btn-primary">Back to books</Link>
      </section>
    );
  }

  return (
    <section className="container page">
      <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details">
        <img className="details-cover" src={book.cover} alt={`Cover of ${book.title}`} />
        <div className="details-info">
          <span className="book-category">{book.category}</span>
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>

          <ul className="details-meta">
            <li><span>Year</span>{book.year}</li>
            <li><span>Rating</span>★ {book.rating.toFixed(1)} / 5</li>
            <li>
              <span>Status</span>
              <span className={`badge ${book.available ? 'badge-available' : 'badge-issued'}`}>
                {book.available ? 'Available' : 'Borrowed'}
              </span>
            </li>
          </ul>

          <h2 className="section-title">About this book</h2>
          <p>{book.description}</p>
          {user?.role === 'user' && !canRead && <div className="filter-panel">
            <strong>{existingRequest ? `Request status: ${existingRequest.status}` : 'Book this title'}</strong>
            {!existingRequest && <><label>Start date & time<input type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} /></label><label>Borrow for (days)<input type="number" min="1" max="30" value={duration} onChange={e => setDuration(e.target.value)} /></label><button className="btn btn-primary" disabled={!book.available} onClick={() => onRequest(book.id, user.username, duration, startAt)}>{book.available ? 'Send booking request' : 'Book unavailable'}</button></>}
          </div>}
          {user?.role === 'admin' && <div className="filter-panel">
            <button type="button" className="btn btn-primary" onClick={toggleAvailability}>
              {book.available ? 'Mark issued' : 'Mark available'}
            </button>
            <button type="button" className="btn btn-outline" onClick={removeBook}>Delete book</button>
          </div>}
        </div>
      </div>
    </section>
  );
}
