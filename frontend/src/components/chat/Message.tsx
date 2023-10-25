import "./Message.scss"
import { useContext } from "react";
import  ConnectionContext from "../../context/authContext"

const Message = (props: {username: string, date: string, msg: string}) => {

    const {username} = useContext(ConnectionContext);

    return (
        <div className={username === props.username ? "message owner" : "message"}>
            <div className='messageInfo'>
                <img src="https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg" />
            </div>
            <div className='messageContent'>
                <p>{props.msg}</p>
                <div className="name-time">
                    {username === props.username ? <span></span> : <span>{props.username},</span>}
                    <span>{props.date}</span>
                </div>
            </div>
        </div>
    )
}

export default Message;
