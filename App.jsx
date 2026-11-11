
import { useCallback, useMemo, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import BookDetails from './pages/BookDetails.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import UserPanel from './pages/UserPanel.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

const makeCover = (title, category) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420"><rect width="300" height="420" fill="#334155"/><text x="150" y="190" text-anchor="middle" fill="white" font-size="24" font-family="Arial">${title.slice(0, 18)}</text><text x="150" y="390" text-anchor="middle" fill="#cbd5e1" font-size="14" font-family="Arial">${category}</text></svg>`)}`;

const initialBooks = [
  ['The Silent Harbor', 'Elena Marlowe', 'Fiction', 2018, 4.3, true],
  ['Orbit of Dust', 'Rajiv Menon', 'Science Fiction', 2021, 4.6, true],
  ['The Ember Crown', 'Aria Valenti', 'Fantasy', 2019, 4.5, false],
  ['Midnight at Rosewood Manor', 'Charles Whitcombe', 'Mystery', 2015, 4.1, true],
  ['Letters Across the Monsoon', 'Meera Kapoor', 'Romance', 2022, 4.2, true],
  ['Empires of the Indus', 'Dr. Harpreet Gill', 'History', 2012, 4.4, true],
  ['The Curious Cell', 'Dr. Naomi Fischer', 'Science', 2020, 4.7, false],
  ['Clean Code in Practice', 'Marcus Reed', 'Technology', 2017, 4.8, true],
  ['A Life in Letters', 'Sofia Alvarez', 'Biography', 2016, 3.9, true],
  ['Small Habits, Big Change', 'Daniel Okafor', 'Self-Help', 2023, 4.0, true],
  ['The Glass Orchard', 'Lena Hoffmann', 'Fiction', 2010, 3.8, false],
  ['Neon Meridian', 'Kenji Tanaka', 'Science Fiction', 2024, 4.4, true],
  ['Shadow of the Frost Giant', 'Bjorn Halvorsen', 'Fantasy', 2014, 4.0, true],
  ['The Cartographer’s Alibi', 'Isabel Moreau', 'Mystery', 2020, 4.5, false],
  ['Autumn in Lisbon', 'Priya Nair', 'Romance', 2013, 3.7, true],
  ['The Silk Road Chronicles', 'Prof. Ahmed Rahimi', 'History', 2019, 4.3, true],
  ['Cosmos for Curious Minds', 'Dr. Lucia Bianchi', 'Science', 2022, 4.6, true],
  ['Learning React the Right Way', 'Anita Desai', 'Technology', 2025, 4.7, true],
  ['Beyond the Finish Line', 'Tom Brennan', 'Biography', 2011, 4.1, false],
  ['Focus in a Noisy World', 'Hannah Lindqvist', 'Self-Help', 2021, 3.9, true],
  ['The Last Lighthouse Keeper', 'Ronan Doyle', 'Fiction', 2024, 4.5, true],
  ['Data Structures Made Simple', 'Vikram Sharma', 'Technology', 2018, 4.2, false],
].map(([title, author, category, year, rating, available], index) => ({
  id: index + 1,
  title,
  author,
  category,
  year,
  rating,
  available,
  description: `A library book about ${category.toLowerCase()} by ${author}.`,
  cover: makeCover(title, category),
}));

// Central book store: CRUD operations are kept here so every routed page sees
// the same live collection. The browser's local storage keeps changes on reload.
function useBooks() {
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('library-books');
      return saved ? JSON.parse(saved) : initialBooks;
    } catch {
      return initialBooks;
    }
  });

  const save = useCallback((next) => {
    setBooks(next);
    localStorage.setItem('library-books', JSON.stringify(next));
  }, []);

  const createBook = useCallback((book) => {
    const nextId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    save([
      ...books,
      {
        ...book,
        id: nextId,
        rating: Number(book.rating) || 0,
        year: Number(book.year) || new Date().getFullYear(),
      },
    ]);
  }, [books, save]);

  const updateBook = useCallback((id, changes) => {
    save(books.map((book) => book.id === id ? { ...book, ...changes } : book));
  }, [books, save]);

  const deleteBook = useCallback((id) => {
    save(books.filter((book) => book.id !== id));
  }, [books, save]);

  const resetBooks = useCallback(() => save(initialBooks), [save]);

  const categories = useMemo(
    () => [...new Set(books.map((b) => b.category))].sort(),
    [books]
  );

  return { books, categories, createBook, updateBook, deleteBook, resetBooks };
}

// App shell: Navbar + routed page + Footer
export default function App() {
  const bookStore = useBooks();

  const [auth, setAuth] = useState(() =>
    JSON.parse(localStorage.getItem('library-auth') || 'null')
  );

  const [requests, setRequests] = useState(() =>
    JSON.parse(localStorage.getItem('library-requests') || '[]')
  );

  const persistRequests = (next) => {
    setRequests(next);
    localStorage.setItem('library-requests', JSON.stringify(next));
  };

  const login = (account) => {
    setAuth(account);
    localStorage.setItem('library-auth', JSON.stringify(account));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('library-auth');
  };

  const updateRequest = (id, changes) => {
    persistRequests(requests.map(r => r.id === id ? { ...r, ...changes } : r));
  };

  const requestBook = (bookId, user, duration = 7, startAt) => {
    const book = bookStore.books.find(b => b.id === bookId);

    if (book) {
      const start = startAt ? new Date(startAt) : new Date();
      const dueDate = new Date(start.getTime() + Number(duration) * 86400000).toISOString();

      persistRequests([
        ...requests,
        {
          id: Date.now(),
          bookId,
          title: book.title,
          user,
          duration: Number(duration),
          startAt: start.toISOString(),
          dueDate,
          requestedAt: new Date().toISOString(),
          status: 'pending',
          fine: 0,
        },
      ]);
    }
  };

  const approve = id => updateRequest(id, { status: 'approved' });
  const reject = id => updateRequest(id, { status: 'rejected' });

  const deleteRequest = id => {
    persistRequests(requests.filter(r => r.id !== id));
  };

  const issue = id => {
    const r = requests.find(x => x.id === id);
    updateRequest(id, { status: 'issued', issuedAt: new Date().toISOString() });
    bookStore.updateBook(r.bookId, { available: false });
  };

  const returnBook = id => {
    const r = requests.find(x => x.id === id);
    updateRequest(id, { status: 'returned' });
    bookStore.updateBook(r.bookId, { available: true });
  };

  const fine = id => updateRequest(id, { fine: 50 });

  return (
    <div className="app">
      <Navbar user={auth} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              auth
                ? <Navigate to={auth.role === 'admin' ? '/admin' : '/user'} replace />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/books"
            element={
              auth?.role === 'user'
                ? <BrowsePage {...bookStore} user={auth} requests={requests} onRequest={requestBook} />
                : <Navigate to={auth ? '/admin' : '/login'} replace />
            }
          />

          <Route
            path="/books/:id"
            element={
              auth
                ? <BookDetails books={bookStore.books} user={auth} requests={requests} onRequest={requestBook} updateBook={bookStore.updateBook} deleteBook={bookStore.deleteBook} />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login"
            element={
              auth
                ? <Navigate to={auth.role === 'admin' ? '/admin' : '/user'} replace />
                : <Login onLogin={login} />
            }
          />

          <Route
            path="/user"
            element={
              auth?.role === 'user'
                ? <UserPanel user={auth} books={bookStore.books} categories={bookStore.categories} requests={requests} onRequest={requestBook} onLogout={logout} />
                : <Login onLogin={login} />
            }
          />

          <Route
            path="/admin"
            element={
              auth?.role === 'admin'
                ? <AdminPanel books={bookStore.books} categories={bookStore.categories} createBook={bookStore.createBook} updateBook={bookStore.updateBook} deleteBook={bookStore.deleteBook} requests={requests} onApprove={approve} onReject={reject} onDeleteRequest={deleteRequest} onIssue={issue} onReturn={returnBook} onFine={fine} onLogout={logout} />
                : <Login onLogin={login} />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
