// import { Routes, Route } from 'react-router'
// import { HomePage } from './pages/Home'
// import { LoginPage } from './pages/Login'
// import "./App.css"
// import IndexButton from './componnts/IndexButton'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import { HomePage } from "./pages/Home"
import { LoginPage } from "./pages/Login"
import { SetupPage } from "./pages/Setup"
import Navbar from "./components/navbar/Navbar"
import { Dashboard } from "./pages/Dashboard"
import { SignupPage } from "./pages/Signup"

const App = () => {
	return (
		<Router>
			<div id="nav">
				{/* <Link to="/">home</Link>
				<Link to="/login">login</Link>
				<Link to="/setup">setup</Link>
				<Link to="/">playlist viewer</Link> */}
				<Navbar />
			</div>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/setup" element={<SetupPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</Router>
	)
}

export default App
