import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { WebsocketContext } from "../../context/chatContext";
import { useState, useEffect, useContext } from 'react';
import  ConnectionContext from "../../context/authContext"
import ChatContext, {IChatContext} from "../../context/chatContext";
import { useLogin } from "../../components/user/auth";
import GameContext from "../../context/gameContext";
import ChatIcon from '@mui/icons-material/Chat';

export type Channel = {
    id: number;
    channelName: string;
    chatPicture: string;
    type : string;
    status: string;
    /*---------LastMessageReceive-------*/
    username: string | null; // bien differencier username et uid unique en cas de changement de username
	// login: string ;
    msg: string| null;
    dateSend: Date | null;
}

const ChatComponent = () => {

    const auth = useLogin();
    const {roomId, setRoomId} = useContext(GameContext);
    const [allChannels, setAllChannels] = useState<Channel[]>([])
    const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
    const [needToUpdate, setNeedToUpdate] = useState("");
    const [activeChannel, setActiveChannel] = useState<Channel>({
        id: -1,
        channelName: "PongOffice Chat",
        chatPicture: "",
        type: "",
        status: "",
        username: null,
        dateSend: null,
        msg: null
    })

  const ChatValue: IChatContext = {
    allChannels,
    setAllChannels,
    activeChannel,
    setActiveChannel,
    needToUpdate,
    setNeedToUpdate,
    blockedUsers,
    setBlockedUsers,
  }

//   useEffect(() => {
//     const fetchBlocked = async () => {
//         const result = await getBlockedUsers();
//         if (result)
//             setBlockedUsers(result)
//     }
//     fetchBlocked();
//     console.log(blockedUsers);
//   }, []);

// async function getBlockedUsers() {
//     let blocked: number[] = [];
//     try {
//         const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/listOfBlockedUser/${auth.user.login}`);
//         if (!response.ok) {
//             throw new Error("Request failed");
//         }
//         const data = await response.json();
//         if (data) {
//             return (data);
//         }
//     }
//     catch(error) {
//         console.error("Error while getting blocked users", error);
//     }
// }
useEffect(() => {
    console.log("New room Id", roomId);
  }, [roomId])


    return (
        <div className="chatcomponent">
            <div className='container'>
                <ChatContext.Provider value={ChatValue}>
                    < Sidebar />
                    {activeChannel.id > 0 ? <Chat/> : <NoChat message={activeChannel.channelName}/>}
                </ChatContext.Provider>
            </div>
        </div>
    )
}

export default ChatComponent;


const NoChat = (props: {message: string}) => {

    const auth = useLogin();
    const socket = useContext(WebsocketContext);

    useEffect(() => {

    socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, date: Date, id: number, idOfChat:number, serviceMessage: boolean}) => {

        socket.emit("chatListOfUser",auth.user.login);
    });
    return () => {
        socket.off('newMessage');
    }
}, [])

    return (<div className='noChat'><ChatIcon style={{fontSize:'100px'}}/></div>);
}
