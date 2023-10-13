// import { useContext, useEffect, useState ,ChangeEvent } from "react";
// import { WebsocketContext } from "../contexts/WebsocketContext";


// type MessagePayload ={
// 	content: string;
// 	message: string;
// 	user: string;
// }
// let name: string = '';

// export const Websocket = () => {
// 	console.log("trying to connect")
// 	const [value, setValue] = useState('')
// 	const socket = useContext(WebsocketContext);
// 	const [messages, setMessages] = useState<MessagePayload[]>([]);
// 	const [userName, setUserName] = useState('');

// 	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
// 		const newName = event.target.value;
// 		setUserName(newName);
// 	  };

// 	useEffect(() => {
// 		console.log("in use eff")
// 		// name = prompt('Enter your name: ') || '';
// 		// if (name) {
// 		// 	setUserName(name);
// 		// }
// 		socket.on('connect', () => {
// 			console.log('connected');
// 		});
// 		socket.on('onMessage', (newMessage: MessagePayload) => {
// 			console.log("on message event reveived");
// 			console.log(newMessage);
// 			setMessages((prev) => [...prev, newMessage])
// 		});
// 		return() => {
// 			console.log("Unregistering event...");
// 			socket.off('connect');
// 			socket.off('onMessage');
// 		}
// 	},[])

// 	const onSummit = () => {
// 		socket.emit('newMessage', value);
// 		setValue('');
// 	};
// 	const handleNewMessage = () => {
// 		if (name && value) {
// 		  // Send a new message to the server with the user's name
// 		  socket.emit('newMessage', { username: name, content: value });
// 		  console.log("enter here");
// 		  setValue('');
// 		}
// 	  };

// 	return (
// 		<div>
// 			<div>
// 				<h1>WebSocket Component</h1>
// 				<input
// 				type="text"
// 				value={userName}
// 				onChange={handleNameChange}
// 				placeholder="Your Name"
// 				/>
// 				<div>
// 					{messages.length === 0 ? <div>No Messages</div> : <div>
// 						{/* here we need to insert unique key per message thnks to the data base */}
// 					{messages.map((msg) => <div>
// 					<p>{msg.content}</p>
// 					</div>
// 					)}
// 					</div>
// 					}
// 				</div>
// 				<div>
// 						<input type="text" value = {value} onChange={(e) => setValue(e.target.value)}
// 						/>
// 						<button onClick={handleNewMessage}>Submit</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from "../contexts/WebsocketContext";

type MessagePayload = {
  content: string;
  msg: string;
};

export const Websocket = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [username, setUserName] = useState('')
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      console.log(newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
    };
  }, [socket]);

  const onSubmit = () => {
	const messageData = {
		username: username,
    	content: value,
	}
	socket.emit('newMessage', messageData);
    setValue('');
	setUserName('')
  };

  return (
    <div>
      <div>
        <h1>Websocket Component</h1>
        <div>
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            <div>
              {messages.map((msg) => (
                <div>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
			<p>Your name</p>
			<input
			  type="text"
			  value={username}
			  onChange={(e) => setUserName(e.target.value)}
			  />
			<p>Your message</p>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};
