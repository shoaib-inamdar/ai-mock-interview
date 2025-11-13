import React from 'react'
import ReactMarkdown from 'react-markdown'

function SummeryBox({summary}) {
    return (
        <div className='h-[60vh] overflow-auto'>
            <ReactMarkdown>{summary}</ReactMarkdown>

        </div>
    )
}

export default SummeryBox;