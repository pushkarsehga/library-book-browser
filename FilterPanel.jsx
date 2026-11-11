import '../styles/controls.css';

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'issued', label: 'Issued' },
];

const SORT_OPTIONS = [
  { value: 'none', label: 'Default' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'rating', label: 'Rating (High-Low)' },
  { value: 'year', label: 'Year (Newest)' },
];

// Category dropdown, availability select and sort select. All values come from props.
export default function FilterPanel({
  categories,
  category,
  availability,
  sortBy,
  onCategoryChange,
  onAvailabilityChange,
  onSortChange,
  onClear,
}) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="availability">Availability</label>
        <select id="availability" value={availability} onChange={(e) => onAvailabilityChange(e.target.value)}>
          {AVAILABILITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <button type="button" className="btn btn-outline" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
