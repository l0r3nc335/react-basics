import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/About'
import DirectoryPage from './pages/Directory'
import HomePage from './pages/Home'
import UseStatePage from './pages/UseState/UseStatePage'
import UseEffectPage from './pages/UseEffect/UseEffectPage'
import UseMemoPage from './pages/UseMemo/UseMemoPage'
import UseCallbackPage from './pages/UseCallback/UseCallbackPage'
import UseContextPage from './pages/UseContext/UseContextPage'
import HRISRootLayout from './hris/layouts/HRISRootLayout'

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
          <Route path="use-memo" element={<UseMemoPage />} />
          <Route path="use-callback" element={<UseCallbackPage />} />
          <Route path="use-context" element={<UseContextPage />} />
        </Route>
        <Route path="hris/*" element={<HRISRootLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
