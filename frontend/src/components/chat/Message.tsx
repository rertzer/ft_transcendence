import React from 'react';
import "./Message.scss"

const Message = () => {

    return (
        <div className='message owner'>
            <div className='messageInfo'>
                <img src="https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg" />
                <span>A l'instant</span>

            </div>
            <div className='messageContent'>
                <p>hello</p>
            </div>
        </div>
    )
}

export default Message;