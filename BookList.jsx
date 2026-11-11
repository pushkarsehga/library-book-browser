import BookCard from './BookCard.jsx';
import '../styles/bookcard.css';

// Renders an array of books in a responsive grid
export default function BookList({ books, onDelete, onToggleAvailability }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon" aria-hidden="true">🔍</p>
        <h3>No books found</h3>
        <p>Try a different search or clear the filters.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onDelete={onDelete} onToggleAvailability={onToggleAvailability} />
      ))}
    </div>
  );
}
