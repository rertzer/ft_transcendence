import React from 'react';
import "./MessageInput.scss"

const MessageInput = () => {

    return (
        <div className='messageinput'>
            <input type="text" placeholder="Type your message..." />
            <button>Send</button>
        </div>
    )
}

export default MessageInput;