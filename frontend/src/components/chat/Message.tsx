import React from 'react';
import "./Message.scss"

const Message = (props: any) => {

    return (
        <div className='message owner'>
            <div className='messageInfo'>
                <img src="https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg" />
				<span>{props.date}</span>
				<span>{props.username}</span>
            </div>
            <div className='messageContent'>
                <p>{props.msg}</p>
            </div>
        </div>
    )
}

export default Message;
