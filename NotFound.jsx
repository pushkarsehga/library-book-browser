import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function NotFound() {
  return (
    <section className="container page empty-state">
      <h1 className="not-found-code">404</h1>
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </section>
  );
}
