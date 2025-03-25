import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react"

interface SignupForm {
	username: string
	password: string
}

export const SignupPage = () => {
	const [formData, setFormData] = useState<SignupForm>({
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

	const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			const response = await fetch("http://localhost:8080/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ formData }),
			})
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`)
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
			<div>Signup</div>
			<form onSubmit={handleSignup}>
				<div>
					username: <input name="username" onChange={handleFormData} />
				</div>
				<div>
					password:{" "}
					<input name="password" type="password" onChange={handleFormData} />
				</div>
				<button type="submit">sign up</button>
			</form>
		</>
	)
}
