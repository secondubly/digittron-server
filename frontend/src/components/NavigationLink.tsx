import React from "react"

export const NavigationLink: React.FC<{ title: string; url: string }> = ({
	title,
	url,
}) => {
	return <a href={url}>{title}</a>
}
