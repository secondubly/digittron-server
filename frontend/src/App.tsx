// import { Routes, Route } from 'react-router'
// import { HomePage } from './pages/Home'
// import { LoginPage } from './pages/Login'
// import "./App.css"
// import IndexButton from './componnts/IndexButton'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router"
import { HomePage } from "./pages/Home"
import { LoginPage } from "./pages/Login"
import { SetupPage } from "./pages/Setup"

const App = () => {
	return (
		<Router>
			<div id="nav">
				<Link to="/">home</Link>
				<Link to="/login">login</Link>
				<Link to="/setup">setup</Link>
				<Link to="/">playlist viewer</Link>
			</div>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/setup" element={<SetupPage />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</Router>
	)
}

export default App
