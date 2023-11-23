import React, { useContext, useEffect, useState } from 'react';
import { CreateStyledCell } from '../CreateStyledCell';
import { useLogin } from '../../user/auth';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import { log } from 'console';

function alternateLine(sx: number, sy: number, zoom: number, size: number) {
	const lines = [];
	for (let i = 0; i < size; i++) {
		if (i % 2 === 0)
			lines.push(
				<CreateStyledCell key={i}
					coordX={4 + i} coordY={1} width={3} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
					text={''} fontSize={0} className={"linePair"} />);
		else
			lines.push(<CreateStyledCell key={i}
				coordX={4 + i} coordY={1} width={3} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
				text={''} fontSize={0} className={"lineUnpair"} />)
	}
	return (<div key={"alternateLines"}>{lines}</div>);
}

function AddLine(sx: number, sy: number, zoom: number, name: string, key: number, coordX:number, connected: string) {

	const auth = useLogin();
		let add;
		let classname;
		console.log("connected = ", connected);
	if (connected === "online" || connected === "in Game")
	{
		classname = "status_connected";
		if (connected === "in Game")
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
			const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/friend/deleteFriend/${key}/${auth.user.id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${auth.user.access_token}`},
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
	return (<div key={key}>
		<p>avatar here ? </p>
		<CreateStyledCell
			coordX={coordX} coordY={1} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
			text={name} fontSize={12} className={classname} />
		<CreateStyledCell
			coordX={coordX} coordY={2} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
			text={add} fontSize={12} className={classname} />
		<div onClick={removeFriend}>
		<CreateStyledCell
			coordX={coordX} coordY={3} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
			text={'delete'} fontSize={12} className={"delete_contacts"} /></div></div>)
}

type listOfFriend = {
	avatar: string,
	username: string,
	connected: string,
	id: number,
}

export function Contacts(props: { sx: number, sy: number, zoom: number }) {
	const [listOfFriend, setListOfFriend] = useState<listOfFriend[]>([]);
	const [sizeOfList, setSizeOfList] = useState(0);
	const auth = useLogin();

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/friend/listFriends/${auth.user.login}`, {
					method: 'GET',
					headers: { Authorization: `Bearer ${auth.user.access_token}`},
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
			{alternateLine(props.sx, props.sy, props.zoom, sizeOfList)}
			<CreateStyledCell
			coordX={3} coordY={1} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
			text={"Username"} fontSize={12} className={"title_contacts"} />
			<CreateStyledCell
			coordX={3} coordY={2} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
			text={"Status"} fontSize={12} className={"title_contacts"} />
			{listOfFriend.map((friend, index) => {
      console.log(friend);
      const variableToPass = 4 + index; // Commence à 4 et s'incrémente à chaque itération
      return AddLine(props.sx, props.sy, props.zoom, friend.username, friend.id, variableToPass, friend.connected)
    })}
		</div>);
}
