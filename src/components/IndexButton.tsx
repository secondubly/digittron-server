import React from 'react'

export const IndexButton: React.FC<({title: string, url: string})> = ({ title, url }) => {
    return (
        <div>
            <a href={url}>{title}</a>
        </div>
    )
}

export default IndexButton