import { Link } from 'react-router-dom';
import '../styles/bookcard.css';

// Reusable card for a single book. Props: book
export default function BookCard({ book, onDelete, onToggleAvailability }) {
  const { id, title, author, category, rating, available, cover } = book;

  return (
    <article className="book-card">
      <div className="book-cover">
        <img src={cover} alt={`Cover of ${title}`} loading="lazy" />
        <span className={`badge ${available ? 'badge-available' : 'badge-issued'}`}>
          {available ? 'Available' : 'Borrowed'}
        </span>
      </div>
      <div className="book-info">
        <span className="book-category">{category}</span>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">by {author}</p>
        <p className="book-rating" aria-label={`Rating ${rating} out of 5`}>
          ★ {rating.toFixed(1)}
        </p>
        <Link to={`/books/${id}`} className="btn btn-primary btn-block">
          View Details
        </Link>
        {onToggleAvailability && <button type="button" className="btn btn-outline btn-block" onClick={() => onToggleAvailability(id, !available)}>
          {available ? 'Borrow book' : 'Return book'}
        </button>}
        {onDelete && <button type="button" className="btn btn-outline btn-block" onClick={() => window.confirm('Delete this book?') && onDelete(id)}>
          Delete
        </button>}
      </div>
    </article>
  );
}
