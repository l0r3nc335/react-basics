import { Link, Outlet } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  return (
    <>
      <header className="layout-header">
        <Link to="/" className="layout-brand">
          React Basics
        </Link>
        <nav className="layout-nav" aria-label="Main">
          <Link to="/">Directory</Link>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  )
}
