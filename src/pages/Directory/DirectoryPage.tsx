import { Link } from 'react-router-dom'
import { pages } from '../../routes/pages'
import './DirectoryPage.css'

export default function DirectoryPage() {
  return (
    <section className="directory">
      <h1>Page directory</h1>
      <p className="directory-lead">
        Pick a page to explore. Add new entries in{' '}
        <code>src/routes/pages.ts</code> and create a matching folder under{' '}
        <code>src/pages/</code>.
      </p>
      <ul className="directory-list">
        <li>
          <Link to="/hris" className="directory-card directory-card--hris">
            <span className="directory-card-title">Acme HRIS</span>
            <span className="directory-card-desc">
              Enterprise HR app — employees, payroll, leave, recruitment, and more.
            </span>
            <span className="directory-card-path">/hris</span>
          </Link>
        </li>
        {pages.map((page) => (
          <li key={page.path}>
            <Link to={page.path} className="directory-card">
              <span className="directory-card-title">{page.title}</span>
              <span className="directory-card-desc">{page.description}</span>
              <span className="directory-card-path">{page.path}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
