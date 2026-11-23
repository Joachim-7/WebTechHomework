
import './App.css'
import { useState } from 'react'
import OfficeForm from './components/OfficeForm'
import Offices from './components/Offices'

function App() {
  const [page, setPage] = useState('save')

  return (
    <div className="app-shell">
      <nav className="app-nav" aria-label="Office pages">
        <button
          className={page === 'save' ? 'nav-button active' : 'nav-button'}
          type="button"
          onClick={() => setPage('save')}
        >
          Save Office
        </button>
        <button
          className={page === 'list' ? 'nav-button active' : 'nav-button'}
          type="button"
          onClick={() => setPage('list')}
        >
          Available Offices
        </button>
      </nav>

      <main className="page-content">
        {page === 'save' ? (
          <>
            <h1 className="section-title">Save Office</h1>
            <OfficeForm />
          </>
        ) : (
          <Offices />
        )}
      </main>
    </div>
  )
}

export default App
