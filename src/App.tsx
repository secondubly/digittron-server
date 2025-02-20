import { Routes, Route } from 'react-router'
import { HomePage } from './pages/Home'
import { LoginPage } from './pages/Login'
import './App.css'
// import IndexButton from './componnts/IndexButton'
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
