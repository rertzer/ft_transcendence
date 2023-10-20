import React from 'react';
import "./MessageInput.scss"

const MessageInput = () => {

    return (
        <div className='messageinput'>
            <input type="text" placeholder="Message..." />
            <button>Envoi</button>
        </div>
    )
}

export default MessageInput;