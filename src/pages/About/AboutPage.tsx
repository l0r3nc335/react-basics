import './AboutPage.css'

export default function AboutPage() {
  return (
    <article className="page about">
      <h1>About</h1>
      <p className="page-lead">
        This is your first custom page. Edit{' '}
        <code>src/pages/About/AboutPage.tsx</code> to make it yours.
      </p>
      <section className="page-section">
        <h2>Next steps</h2>
        <ol>
          <li>
            Duplicate the <code>About</code> folder under <code>src/pages/</code>
          </li>
          <li>
            Add a route in <code>App.tsx</code> and an entry in{' '}
            <code>src/routes/pages.ts</code>
          </li>
          <li>
            Build out your UI with components from <code>src/components/</code>
          </li>
        </ol>
      </section>
    </article>
  )
}
