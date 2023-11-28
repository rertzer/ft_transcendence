import "./ChatComponent.scss"
import Sidebar from './Sidebar';
import Chat from './Chat'
import { WebsocketContext } from "../../context/chatContext";
import { useState, useEffect, useContext } from 'react';
import ChatContext, {IChatContext} from "../../context/chatContext";
import { useLogin } from "../../components/user/auth";
import ConversationBar from "./ConversationBar";
import { PageContext } from "../../context/PageContext";

export type Channel = {
    id: number;
    channelName: string;
    chatPicture: string;
    type : string;
    status: string;
    /*---------LastMessageReceive-------*/
    username: string | null; // bien differencier username et uid unique en cas de changement de username
    msg: string| null;
    dateSend: Date | null;
    userId: number | null;
}

const ChatComponent = (props: {newDM: string}) => {
    const context = useContext(PageContext);
	if (!context) {
		throw new Error('useContext must be used within a MyProvider');
	}
	const { updateChat, chat } = context;
    const auth = useLogin();
    const socket = useContext(WebsocketContext);
    const [DM, setDM] = useState(props.newDM.search("New DM") !== -1 ? true : false)
    const [allChannels, setAllChannels] = useState<Channel[]>([])
    const [blockedUsers, setBlockedUsers] = useState<{idUser: number, username: string, login: string}[]>([]);
    const [needToUpdate, setNeedToUpdate] = useState("");
    const [activeChannel, setActiveChannel] = useState<Channel>({
        id: -1,
        channelName: "PongOffice Chat",
        chatPicture: "",
        type: "",
        status: "",
        username: null,
        dateSend: null,
        msg: null,
        userId: null,
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
useEffect(() => {
    if (allChannels.length === 0) {
        socket.emit('chatListOfUser', auth.user.login);
        socket.on("ListOfChatOfUser", (channelsListReceive : Channel[]) => {
            setAllChannels(channelsListReceive);
        });
    
        return () => {
            socket.off("ListOfChatOfUser");
        }
    }
}, []);

useEffect(() => {
    async function getBlockedUsers() {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_URL_MACHINE}:4000/chatOption/listOfBlockedUser/${auth.user.login}`, {
                method: "GET",
                headers: { Authorization: auth.getBearer()},
              });
            if (!response.ok) {
                throw new Error("Request failed");
            }
            const data = await response.json();
            let result: {idUser: number, username: string, login: string}[] = [];
            if (data) {
                data.map((element: any) => {
                    result.push(element)
                    return 0;
                })
                return (result);
            }
        }
        catch(error) {
            console.error("Error while getting blocked users", error);
        }
    }
    const fetchBlocked = async () => {
        const result = await getBlockedUsers();
        if (result)
            setBlockedUsers(result)
    }
    fetchBlocked();
  }, [auth]);

  useEffect(() => {
    if (DM === true) {
        startDmFromTop();
        if (activeChannel.id !== -1) {
            setDM(false);
            updateChat("Chat");
        }
    }
  }, [allChannels])

  function checkIfDmExists(targetUsername: string) {
    const index = allChannels.findIndex((element: Channel) => {
        if (element.type !== "DM")
            return false;
        const name1 = element.channelName.substring(0, element.channelName.indexOf(" "));
        const name2 = element.channelName.substring(element.channelName.indexOf(" ") + 1);
        if (targetUsername === name1 || targetUsername === name2)
            return true;
        return false;
    });
    return (index);
}

async function startDmFromTop() {
    const targetUsername = props.newDM.substring(12, props.newDM.indexOf("/"));
    const targetLogin = props.newDM.substring(props.newDM.indexOf("/") + 1);
    let existingConversation = checkIfDmExists(targetUsername);
    if (existingConversation !== -1) {
        setActiveChannel(allChannels[existingConversation]);
        if (activeChannel.id !== -1)
            socket.emit('retrieveMessage', {chatId: allChannels[existingConversation].id, messageToDisplay: 15 })
    } else {
        const messageData = {
            sender: auth.user.login,
            receiver: targetLogin,
        }
        socket.emit('newPrivateConv', messageData);
        setNeedToUpdate("newDM " + targetUsername);
    }
}

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
    const {blockedUsers} = useContext(ChatContext);

    useEffect(() => {

    socket.on('newMessage', (chatHistoryReceive :{msg: string, username: string, login: string, date: Date, id: number, idOfChat:number, serviceMessage: boolean, userId: number}) => {
        if (blockedUsers.find(element => element.idUser === chatHistoryReceive.userId) === undefined)
            socket.emit("chatListOfUser",auth.user.login);
    });
    return () => {
        socket.off('newMessage');
    }
}, [auth.user.login, blockedUsers, socket])

    return (<div>
                <ConversationBar isOwner={false} isAdmin={false}/>
                <div className='noChat'></div>
            </div>);
}
