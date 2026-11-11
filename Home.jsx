import { Link } from 'react-router-dom';
import BookList from '../components/BookList.jsx';
import '../styles/pages.css';

// Landing page: hero section, quick stats and a few top-rated books
export default function Home({ books, categories }) {
  const topRated = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const availableCount = books.filter((b) => b.available).length;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Find your next great read</h1>
          <p>Browse, search and filter our collection by title, author, category and availability.</p>
          <Link to="/books" className="btn btn-light">Browse all books</Link>
        </div>
      </section>

      <section className="container stats">
        <div className="stat"><strong>{books.length}</strong><span>Books</span></div>
        <div className="stat"><strong>{categories.length}</strong><span>Categories</span></div>
        <div className="stat"><strong>{availableCount}</strong><span>Available now</span></div>
      </section>

      <section className="container page">
        <h2 className="section-title">Top rated books</h2>
        <BookList books={topRated} />
      </section>
    </>
  );
}
