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
					coordX={4 + i} coordY={1} width={6} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
					text={''} fontSize={0} className={"linePair"} />);
		else
			lines.push(<CreateStyledCell key={i}
				coordX={4 + i} coordY={1} width={6} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
				text={''} fontSize={0} className={"lineUnpair"} />)
	}
	return (<div key={"alternateLines"}>{lines}</div>);
}

function AddLine(sx: number, sy: number, zoom: number, key: number, coordX:number, username: string, numberGames: number, numberWon: number, numberLost: number, totalGameDuration: number) {

  const classname= "dataItem";

	return (<div key={key}>
          <CreateStyledCell
            coordX={coordX} coordY={1} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
            text={key.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={2} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
            text={username} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={3} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
            text={numberGames.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={4} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
            text={numberWon.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={5} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
            text={numberLost.toString()} fontSize={12} className={classname} />
          <CreateStyledCell
            coordX={coordX} coordY={6} width={1} height={1} scroll_x={sx} scroll_y={sy} zoom={zoom}
            text={totalGameDuration.toString()} fontSize={12} className={classname} />
        </div>)
}

export function Data(props: {sx: number, sy: number, zoom: number}) {

  const [userList, setUserList] = useState<User[]>([{userLogin: "tgrasset",
    userUsername: "Thib",       
    userId: 1,        
    numberGames: 3,         
    numberGamesBasic: 2,         
    numberGamesAdvanced: 1,         
    numberWon: 3,         
    numberLost: 0,         
    numberWonBasic: 2,        
    numberLostBasic: 0,         
    numberWonAdvanced: 1,         
    numberLostAdvanced: 0,         
    totalGameDurationInSec: 350, 
    totalGameDurationBasicInSec: 200, 
    totalGameDurationAdvancedInSec: 150,}, 
    {userLogin: "toto",
    userUsername: "toto",       
    userId: 2,        
    numberGames: 3,         
    numberGamesBasic: 2,         
    numberGamesAdvanced: 1,         
    numberWon: 0,         
    numberLost: 3,         
    numberWonBasic: 0,        
    numberLostBasic: 2,         
    numberWonAdvanced: 0,         
    numberLostAdvanced: 1,         
    totalGameDurationInSec: 350, 
    totalGameDurationBasicInSec: 200, 
    totalGameDurationAdvancedInSec: 150,    },
    {userLogin: "jojo",
    userUsername: "jojo",       
    userId: 12353,        
    numberGames: 341,         
    numberGamesBasic: 2214,         
    numberGamesAdvanced: 1142,         
    numberWon: 241,         
    numberLost: 34,         
    numberWonBasic: 235,        
    numberLostBasic: 2,         
    numberWonAdvanced: 23523,         
    numberLostAdvanced: 1,         
    totalGameDurationInSec: 350, 
    totalGameDurationBasicInSec: 200, 
    totalGameDurationAdvancedInSec: 150,    }]);
  const auth = useLogin();

  // useEffect(() => {
	// 	const getUsers = async () => {
	// 		try {
	// 			const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/gameStats`, {
	// 				method: 'GET',
	// 				headers: { Authorization: auth.getBearer()},
	// 			});
	// 			if (!response.ok) {
	// 				console.error(`Error fetching users: ${response.status}`);
	// 				return;
	// 			}

	// 			const data = await response.json();
	// 			console.log("data received = ", data);
	// 			if (!data) {
	// 				console.log('No list of users');
	// 			} else {
	// 				console.log("got list of users", data);
	// 				setUserList(data);
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching user list:', error);
	// 		}
	// 	}
	// 	getUsers();
	// 	const intervalId = setInterval(getUsers, 5000);

	// 	return () => clearInterval(intervalId);
	// }, [])

// function sortUsers(by: string) {
//     let sorted: User[];
//     if (by === "Games Won")
//       sorted = userList.sort((a: User, b: User) => {
//         if (a.numberWon > b.numberWon)
// });
//     else if (by === "Games Played")
//       sorted = userList.sort((a: User, b: User) => {
//         return 0;
//       })
// }

  return (
    <div key={"contact"}>
      {alternateLine(props.sx, props.sy, props.zoom, userList.length)}
      <CreateStyledCell
      coordX={3} coordY={1} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
      text={"Rank"} fontSize={12} className={"title_data"} />
      <CreateStyledCell
      coordX={3} coordY={2} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
      text={"Username"} fontSize={12} className={"title_data"} />
      <CreateStyledCell
      coordX={3} coordY={3} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
      text={"Games Played"} fontSize={12} className={"title_data"} />
      <CreateStyledCell
      coordX={3} coordY={4} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
      text={"Games Won"} fontSize={12} className={"title_data"} />
      <CreateStyledCell
      coordX={3} coordY={5} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
      text={"Games Lost"} fontSize={12} className={"title_data"} />
      <CreateStyledCell
      coordX={3} coordY={6} width={1} height={1} scroll_x={props.sx} scroll_y={props.sy} zoom={props.zoom}
      text={"Play Time"} fontSize={12} className={"title_data"} />
      {userList.map((user, index) => {
        const variableToPass = 4 + index;
        return AddLine(props.sx, props.sy, props.zoom, index + 1, variableToPass, user.userUsername, user.numberGames, user.numberWon, user.numberLost, user.totalGameDurationInSec)
      })}
     </div>);
}
