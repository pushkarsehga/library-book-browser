# Library Book Browser

A responsive library interface built with React (Vite) and React Router where users can browse, search and filter books.

## Setup

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal (usually http://localhost:5173).

Other commands:

```bash
npm run build     # production build in /dist
npm run preview   # preview the production build
npm run lint      # lint the code
```

## Features

- **Routing** (React Router): `/` Home, `/books` Browse, `/books/:id` Book details, `*` Not found page
- **Reusable components**: `BookCard`, `BookList`, `SearchBar`, `FilterPanel`, `Navbar`, `Footer`
- **Live search** by title or author (case-insensitive)
- **Filters**: category dropdown, availability (All / Available / Issued)
- **Sorting**: title A-Z, rating high-low, year newest
- Search, filters and sorting work together, with a **Clear filters** button and a **results count**
- "No books found" message for empty results
- **Book details page** with full information and a Back button
- **Responsive design** (mobile-first): 1 column on mobile, 2 on tablet, 3-4 on desktop; collapsible navbar on mobile
- 22 sample books with generated SVG covers (works offline)

## Project structure

```
src/
  components/   BookCard, BookList, SearchBar, FilterPanel, Navbar, Footer
  pages/        Home, BrowsePage, BookDetails, NotFound
  data/         books.js (sample data)
  styles/       global.css, navbar.css, controls.css, bookcard.css, pages.css
  App.jsx       routes and layout
  main.jsx      entry point with BrowserRouter
```

## Code notes

- Search, filter and sort state lives in `BrowsePage` and is passed down to child components as props (lifting state up).
- The filtered list is computed with `useMemo`, so it only recalculates when an input changes.
- Only functional components and hooks are used.
