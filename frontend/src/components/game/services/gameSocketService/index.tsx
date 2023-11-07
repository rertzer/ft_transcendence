import { io, Socket } from "socket.io-client";

export const gameSocket:Socket = io('http://' + process.env.REACT_APP_URL_MACHINE + ':4000/game_socket');
