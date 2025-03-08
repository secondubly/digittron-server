import React from "react"
import { useNavigate } from "react-router"

export const LoginPage = () => {
	const navigate = useNavigate()
	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		navigate("/")
	}

	return (
		<>
			<div>Login</div>
			<form onSubmit={onSubmit}>
				<div>
					username: <input />
				</div>
				<div>
					password: <input type="password" />
				</div>
				<button type="submit">login</button>
			</form>
		</>
	)
}
