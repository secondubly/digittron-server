import { NavLink } from "react-router"

const Navbar = () => {
	return (
		<>
			<NavLink to="/">home</NavLink>
			<NavLink to="/setup">setup</NavLink>
			<NavLink to="/signup">signup</NavLink>
			<NavLink to="/dashboard">dashboard</NavLink>
			<NavLink to="/">playlist viewer</NavLink>
		</>
	)
}

export default Navbar
