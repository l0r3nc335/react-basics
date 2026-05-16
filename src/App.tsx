import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/About'
import DirectoryPage from './pages/Directory'
import HomePage from './pages/Home'
import UseStatePage from './pages/UseState/UseStatePage'
import UseEffectPage from './pages/UseEffect/UseEffectPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DirectoryPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="use-state" element={<UseStatePage />} />
          <Route path="use-effect" element={<UseEffectPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
