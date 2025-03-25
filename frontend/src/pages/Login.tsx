import React, { ChangeEvent, useState } from "react"

interface LoginForm {
	username: string
	password: string
}

export const LoginPage = () => {
	const [formData, setFormData] = useState<LoginForm>({
		username: "",
		password: "",
	})

	const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
		const element = e.target
		setFormData({
			...formData,
			[element.name]: element.value,
		})
	}

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			const response = await fetch("http://localhost:8080/handleLogin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ formData }),
			})

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`)
			} else {
				console.log(response.body)
			}
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<>
			<div>Login</div>
			<form onSubmit={onSubmit}>
				<div>
					username:{" "}
					<input type="text" name="username" onChange={handleFormData} />
				</div>
				<div>
					password:{" "}
					<input type="password" name="password" onChange={handleFormData} />
				</div>
				<button type="submit">login</button>
			</form>
		</>
	)
}
