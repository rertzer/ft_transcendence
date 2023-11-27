import React, { useEffect, useState } from 'react';
import { CreateStyledCell } from '../CreateStyledCell';
import { useLogin } from '../../user/auth';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import { log } from 'console';
import { PageContext } from '../../../context/PageContext';

function alternateLine(size: number) {
	const lines = [];
	for (let i = 0; i < size; i++) {
		if (i % 2 !== 0)
			lines.push(
				<CreateStyledCell key={i}
					coordX={4 + i} coordY={1} width={2} height={1}
					text={''} fontSize={0} className={"linePair"} />);
		else
			lines.push(<CreateStyledCell key={i}
				coordX={4 + i} coordY={1} width={2} height={1}
				text={''} fontSize={0} className={"lineUnpair"} />)
	}
	return (<div key={'alternateLines' + size}>{lines}</div>);
}

export function AddLine(props: {scrollX: number, scrollY: number, toolbar: boolean, zoom: number, name: string, id: number, coordX:number, connected: string, avatar: string, key:string}) {

	const auth = useLogin();
		let add;
		let classname;
		console.log("connected = ", props.connected);
	if (props.connected === "online" || props.connected === "in Game")
	{
		classname = "status_connected";
		if (props.connected === "in Game")
			add = "in Game";
		else
			add = "online"
	}
	else
	{
		add = "offline"
		classname= "status_unconnected"
	}

	async function removeFriend() {
		try {
			const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/friend/deleteFriend/${props.id}/${auth.user.id}`, {
				method: 'DELETE',
				headers: { Authorization: auth.getBearer()},
			});
			if (!response.ok) {
				console.error(`Error fetching friends: ${response.status}`);
				return ;
			}
			const data = await response.json();
			console.log("data receive = ", data);
			if (!data) {
				console.log('No list of friends');
			} else {
				console.log("hey all good");
			}
		} catch (error) {
			console.error('Error removinf friends:', error);
		}
	}
		//creer un bouton on click qui te redirige vers le user ?
	return (
		<div key={props.name}>
			<div key={"img"} style={{ position:'fixed',
                	color:'black',
                	backgroundColor:'red',
                	top: props.toolbar ? '89px' : '166px' }}>
      			<img src={"https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg"} 
            		alt="" className="profilePic" 
            		style={{  width:`${(20 + (props.zoom - 100) / 8) * 1}px`,
                    	height:`${(20 + (props.zoom - 100) / 8) * 1}px`,
                    	objectFit: 'cover',
                    	position: 'absolute',
                    	top: `${(20 + (props.zoom - 100) / 8) * (props.coordX - props.scrollX)}px`,
                    	left: `${-(20 + (props.zoom - 100) / 8) * 1 + (80 + (props.zoom - 100) / 2) * (1 - props.scrollY)}px`, }} />
			</div>
			<div key={"1"}><CreateStyledCell
				coordX={props.coordX} coordY={1} width={1} height={1} 
				text={props.name} fontSize={12} className={classname} />
			</div>
			<div key={"2"}><CreateStyledCell
				coordX={props.coordX} coordY={2} width={1} height={1}
				text={add} fontSize={12} className={classname} />
			</div>
			<div key={"removeFriend"} onClick={removeFriend}>
				<CreateStyledCell
					coordX={props.coordX} coordY={3} width={1} height={1} key={"3"}
					text={'unfriend'} fontSize={12} className={"delete_contacts"} />
			</div>
		</div>)
}

type listOfFriend = {
	avatar: string,
	username: string,
	connected: string,
	id: number,
}

export function Contacts(props: { sx: number, sy: number, zoom: number, toolbar: boolean }) {
	const [listOfFriend, setListOfFriend] = useState<listOfFriend[]>([]);
	const [sizeOfList, setSizeOfList] = useState(0);
	const auth = useLogin();

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/friend/listFriends/${auth.user.login}`, {
					method: 'GET',
					headers: { Authorization: auth.getBearer()},
				});
				if (!response.ok) {
					console.error(`Error fetching friends: ${response.status}`);
					return;
				}

				const data = await response.json();
				console.log("data receive = ", data);
				if (!data) {
					console.log('No list of friends');
				} else {
					console.log("hey all good");
					setListOfFriend(data);
				}
			} catch (error) {
				console.error('Error fetching friends:', error);
			}
		}
		getUser();
		const intervalId = setInterval(getUser, 1000);

		return () => clearInterval(intervalId);
	}, [])

	useEffect(() => {
		setSizeOfList(listOfFriend.length);
	}, [listOfFriend])

	return (
		<div key={"contact"}>
			{alternateLine(sizeOfList !== 0 ? sizeOfList : 1)}
			
			<CreateStyledCell
			coordX={3} coordY={1} width={1} height={1}
			text={"Username"} fontSize={12} className={"title_contacts"} />
			<CreateStyledCell
			coordX={3} coordY={2} width={1} height={1}
			text={"Status"} fontSize={12} className={"title_contacts"} />
			{sizeOfList === 0 && <CreateStyledCell coordX={4} coordY={1} width={2} height={1} text={"You have no friends :("} fontSize={12} className={"no_friends"} />}
			{listOfFriend.map((friend, index) => {
      console.log(friend);
      const variableToPass = 4 + index; // Commence à 4 et s'incrémente à chaque itération
      return (<AddLine scrollX={props.sx} scrollY={props.sy} toolbar={props.toolbar} zoom={props.zoom} name={friend.username} id={friend.id} coordX={variableToPass} connected={friend.connected} avatar={friend.avatar} key={`${friend.id}`}/>)
    })}
			<CreateStyledCell coordX={3} coordY={1} width={2} height={sizeOfList === 0 ? 2 : sizeOfList + 1} text={''} fontSize={0} className={"border"} key={"border"}/>
		</div>);
}
