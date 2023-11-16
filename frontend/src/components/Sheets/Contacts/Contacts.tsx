import React,{useContext, useEffect, useState} from 'react';
import { CreateStyledCell } from '../CreateStyledCell';
import userContext from '../../../context/userContext';

function alternateLine(sx: number, sy: number, zoom: number)
{
  const lines = [];
  for (let i = 0; i < 100; i++)
  {
    if (i % 2 === 0)
      lines.push(
        <CreateStyledCell
          coordX={3 + i} coordY={1} width={5} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
          text={''} fontSize={0} className={"linePair"} />);
    else
      lines.push(<CreateStyledCell
        coordX={3 + i} coordY={1} width={5} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
        text={''} fontSize={0} className={"lineUnpair"} />)
  }
  return (<div>{lines}</div>);
}

function addLine(sx: number, sy:number, zoom:number, name:string)
{
	// return (<div><CreateStyledCell
    //     coordX={4} coordY={1} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
    //     text={name} fontSize={12} className={"text"} />
    //   <CreateStyledCell
    //   coordX={4} coordY={3} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
    //   text={'invite'} fontSize={12} className={"invite"} />
    //   <CreateStyledCell
    //   coordX={4} coordY={4} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
    //   text={'message'} fontSize={12} className={"message"} />
    //   <CreateStyledCell
    //   coordX={4} coordY={5} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
    //   text={'block'} fontSize={12} className={"block"} /></div>)
}

type listOfFriend = {
	avatar: string,
	username:string,
	login:string,
	connected: boolean,
}

export function Contacts(sx: number, sy: number, zoom: number) {
  const [listOfFriend, setListOfFriend] = useState<listOfFriend[]>([]);
  const {user} = useContext(userContext);

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await fetch(`http://localhost:4000/friend/listFiends/${user.login}`, {
				  method: 'GET',
				});

				if (!response.ok) {
				  console.error(`Error fetching friends: ${response.status}`);
				  return;
				}

				const data = await response.json();

				if (!data) {
				  console.log('No list of friends');
				} else {
					setListOfFriend(data);
				}
			  } catch (error) {
				console.error('Error fetching friends:', error);
			  }
		}
	}, [])

	return (
    <div key={"contact"}>
      {alternateLine(sx, sy, zoom)}
		{/* {addLine(sx,sy,zoom,"pierrick")} */}
    </div>);
}
