import '../styles/controls.css';

// Controlled search input (live search, state is held by the parent)
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="search" className="sr-only">Search books</label>
      <span className="search-icon" aria-hidden="true">🔎</span>
      <input
        id="search"
        type="search"
        placeholder="Search by title or author..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
