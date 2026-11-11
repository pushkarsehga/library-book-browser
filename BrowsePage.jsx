import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import BookList from '../components/BookList.jsx';
import '../styles/pages.css';

// Sorting functions keyed by the sort option value
const SORTERS = {
  none: null,
  title: (a, b) => a.title.localeCompare(b.title),
  rating: (a, b) => b.rating - a.rating,
  year: (a, b) => b.year - a.year,
};

// Browse page: owns all search/filter/sort state (state is lifted up here)
export default function BrowsePage({ books, categories, createBook, updateBook, deleteBook, resetBooks, user, requests, onRequest }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  // Search + filters + sort are applied together
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = books.filter((b) => {
      const matchesSearch =
        !query || b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || b.category === category;
      const matchesAvailability =
        availability === 'all' || (availability === 'available' ? b.available : !b.available);
      return matchesSearch && matchesCategory && matchesAvailability;
    });

    const sorter = SORTERS[sortBy];
    return sorter ? [...result].sort(sorter) : result;
  }, [search, category, availability, sortBy]);

  const hasActiveFilters =
    search !== '' || category !== 'all' || availability !== 'all' || sortBy !== 'none';

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setAvailability('all');
    setSortBy('none');
  };

  const addBook = () => {
    const title = window.prompt('Book title?');
    if (!title?.trim()) return;
    const author = window.prompt('Author?') || 'Unknown author';
    createBook({ title: title.trim(), author, category: 'Fiction', year: new Date().getFullYear(), rating: 0, available: true, description: 'New library book', cover: '' });
  };

  const requestBook = (book) => {
    if (requests.some(r => r.bookId === book.id && r.user === user.username && ['pending', 'approved', 'issued'].includes(r.status))) return;
    onRequest(book.id, user.username);
  };

  return (
    <section className="container page">
      <h1 className="page-title">Browse Books</h1>

      <div className="filter-panel">
        <button type="button" className="btn btn-primary" onClick={addBook}>Add book</button>
        <button type="button" className="btn btn-outline" onClick={resetBooks}>Reset books</button>
      </div>

      <SearchBar value={search} onChange={setSearch} />
      <FilterPanel
        categories={categories}
        category={category}
        availability={availability}
        sortBy={sortBy}
        onCategoryChange={setCategory}
        onAvailabilityChange={setAvailability}
        onSortChange={setSortBy}
        onClear={clearFilters}
      />

      <p className="results-count" aria-live="polite">
        Showing <strong>{filteredBooks.length}</strong> of {books.length} books
        {hasActiveFilters && ' (filters applied)'}
      </p>

      <BookList books={filteredBooks} onDelete={user.role === 'admin' ? deleteBook : undefined} onToggleAvailability={user.role === 'admin' ? (id, available) => updateBook(id, { available }) : undefined} />
      {false && user.role === 'user' && <div className="book-grid" style={{ marginTop: 24 }}>
        {filteredBooks.map(book => {
          const existing = requests.find(r => r.bookId === book.id && r.user === user.username && ['pending', 'approved', 'issued'].includes(r.status));
          return <button key={book.id} type="button" className="btn btn-primary" disabled={!book.available || Boolean(existing)} onClick={() => requestBook(book)}>
            {existing ? `Request ${existing.status}` : book.available ? `Issue ${book.title}` : 'Currently unavailable'}
          </button>;
        })}
      </div>}
    </section>
  );
}
