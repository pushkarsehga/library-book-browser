import '../styles/navbar.css';

// Computed once at module load (keeps render pure)
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {YEAR} Library Book Browser. Built with React and React Router.</p>
      </div>
    </footer>
  );
}
