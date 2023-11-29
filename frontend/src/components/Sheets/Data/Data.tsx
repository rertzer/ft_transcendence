import {useState, useEffect} from 'react';
import { useLogin } from '../../user/auth';
import { CreateStyledCell } from '../CreateStyledCell';

type User = {
  userId: number,        
  userLogin: string,
  userUsername: string,       
  numberGames: number,         
  numberGamesBasic: number,         
  numberGamesAdvanced: number,         
  numberWon: number,         
  numberLost: number,         
  numberWonBasic: number,        
  numberLostBasic: number,         
  numberWonAdvanced: number,         
  numberLostAdvanced: number,         
  totalGameDurationInSec: number, 
  totalGameDurationBasicInSec: number, 
  totalGameDurationAdvancedInSec: number,    
}

function alternateLine(sx: number, sy: number, zoom: number, size: number) {
	const lines = [];
	for (let i = 0; i < size; i++) {
		if (i % 2 === 0)
			lines.push(
				<CreateStyledCell key={i}
					coordX={4 + i} coordY={1} width={7} height={1}
					text={''} fontSize={0} className={"linePair"} />);
		else
			lines.push(<CreateStyledCell key={i}
				coordX={4 + i} coordY={1} width={7} height={1} 
				text={''} fontSize={0} className={"lineUnpair"} />)
	}
	return (<div key={"alternateLines"}>{lines}</div>);
}

function AddLine(sx: number, sy: number, zoom: number, key: number, coordX:number, username: string, numberGames: number, numberWon: number, numberLost: number, totalGameDuration: number) {

  const classname= "dataItem";


	return (<div key={key}>
          <CreateStyledCell
            coordX={coordX} coordY={1} width={1} height={1}
            text={key.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={2} width={1} height={1}
            text={username} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={3} width={1} height={1}
            text={numberGames.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={4} width={1} height={1}
            text={numberWon.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={5} width={1} height={1}
            text={numberLost.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={6} width={1} height={1}
            text={numberLost.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={7} width={1} height={1}
            text={Math.floor(totalGameDuration).toString()+"s"} fontSize={12} className={classname} />
        </div>)
}

export function Data(props: {sx: number, sy: number, zoom: number}) {

  const [userList, setUserList] = useState<User[]>([]);
  const [listBy, setListBy] = useState("Won");
  const auth = useLogin();

  useEffect(() => {
		const getUsers = async () => {
			try {
				const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/gameStats`, {
					method: 'GET',
					headers: { Authorization: auth.getBearer()},
				});
				if (!response.ok) {
					console.error(`Error fetching users: ${response.status}`);
					return;
				}

				const data = await response.json();
				if (data) {
					setUserList(data);
				}
			} catch (error) {
				console.error('Error fetching user list:', error);
			}
		}
		getUsers();
		const intervalId = setInterval(getUsers, 10000);

		return () => clearInterval(intervalId);
	}, [])

function sortUsers(users: User[], by: string) {
    if (by === "Won")
      users.sort((a: User, b: User) => {
        if (a.numberWon < b.numberWon)
          return 1;
        if (a.numberWon > b.numberWon)
          return -1;
        return 0;
      });
    else if (by === "Played")
      users.sort((a: User, b: User) => {
        if (a.numberGames < b.numberGames)
          return 1;
        if (a.numberGames > b.numberGames)
          return -1;
        return 0;
      });
    else if (by === "Username")
      users.sort((a: User, b: User)=>{
        if (a.userUsername < b.userUsername)
          return -1;
        if (a.userUsername > b.userUsername)
          return 1;
        return 0;
      });
    else if (by === "Lost")
      users.sort((a: User, b: User)=>{
        if (a.numberLost < b.numberLost)
          return 1;
        if (a.numberLost > b.numberLost)
          return -1;
        return 0;
      });
    else if (by === "Play Time")
      users.sort((a: User, b: User)=>{
        if (a.totalGameDurationInSec < b.totalGameDurationInSec)
          return 1;
        if (a.totalGameDurationInSec > b.totalGameDurationInSec)
          return -1;
        return 0;
      });
  return (users);
}
  console.log("USERLIST", userList);
  return (
    <div key={"contact"}>
      {alternateLine(props.sx, props.sy, props.zoom, userList.length)}
      <CreateStyledCell
      coordX={3} coordY={1} width={1} height={1}
      text={"Rank"} fontSize={12} className={"title_data"} />
      <div  onClick={()=>{setListBy("Username")}}><CreateStyledCell
        coordX={3} coordY={2} width={1} height={1}
        text={"Username"} fontSize={12} className={"title_data"} /></div>
      <div onClick={()=>{setListBy("Played")}}><CreateStyledCell
        coordX={3} coordY={3} width={1} height={1}
        text={"Played"} fontSize={12} className={"title_data"} /></div>
      <div onClick={()=>{setListBy("Won")}}><CreateStyledCell
        coordX={3} coordY={4} width={1} height={1}
        text={"Won"} fontSize={12} className={"title_data"} /></div>
      <div onClick={()=>{setListBy("Lost")}}><CreateStyledCell
        coordX={3} coordY={5} width={1} height={1}
        text={"Lost"} fontSize={12} className={"title_data"} /></div>
      <div onClick={()=>{setListBy("Ratio")}}><CreateStyledCell
        coordX={3} coordY={6} width={1} height={1}
        text={"Ratio"} fontSize={12} className={"title_data"} /></div>
      <div onClick={()=>{setListBy("Play Time")}}><CreateStyledCell
        coordX={3} coordY={7} width={1} height={1}
        text={"Play Time"} fontSize={12} className={"title_data"} /></div>
      {sortUsers(userList, listBy).map((user, index) => {
        const variableToPass = 4 + index;
        return AddLine(props.sx, props.sy, props.zoom, index + 1, variableToPass, user.userUsername, user.numberGames, user.numberWon, user.numberLost, user.totalGameDurationInSec)
      })}
      <CreateStyledCell coordX={3} coordY={1} width={7} height={userList.length + 1} text={''} fontSize={0} className={'border'}/>
     </div>);
}
