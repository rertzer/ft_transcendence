import { Injectable } from '@nestjs/common';
import { Room } from '../Interface/room.interface';
import { Player } from '../Interface/player.interface';
import { Ball } from '../Interface/ball.interface';

@Injectable()
export class RoomsService {
	private rooms: Room[] = [];
	private initBall : Ball = {
		pos: {x:1/2, y:1/2},
		dir: {x: 0.5, y: -1},
		speed:0.006,
	};

	createRoom(idRoom:string, player:Player) {
		const newRoom: Room = {
			id:idRoom,
			ball: this.initBall,
			playerLeft:player,
			playerRight:null,
			posYLeft:1/2,
			posYRight:1/2,
			scoreLeft:0,
			scoreRight:0,
			gameStatus:"WAITING"
		}
		this.rooms.push(newRoom);
		console.log('Room created');
		console.log('Rooms :', this.rooms);
		return (newRoom);
	};

	removeRoom(room: Room) {
		this.rooms = this.rooms.filter((r) => {return r != room;});
		console.log('Remove room');
		console.log('Rooms :', this.rooms);
	};

	findAllRoom(): Room[] {
		return this.rooms;
	};

	findRoomOfPlayer(player: Player): Room | null {
		const room = this.rooms.find((element) => (element.playerLeft === player || element.playerRight === player));
		if (typeof(room) === 'undefined') {
			return null;
		}
		return room;
	};
	
	findRoomById(idToFind:string) : Room | null {
		const room = this.rooms.find((element) => (element.id === idToFind));
		if (typeof(room) === 'undefined') {
			return null;
		}
		return room;
	};

	addPlayerToRoom(player:Player, roomName:string) {
		let room = this.findRoomById(roomName);
		console.log(room);
		if (room === null)
		{
			room = this.createRoom(roomName, player);
			player.socket.emit('room_joined', {
				id:room.id,
				ball:room.ball,
				yourSide:this.getSideOfPlayer(room,player), 
				oponentName: (this.getSideOfPlayer(room,player) === 'left' ? room.playerRight?.name : room.playerLeft?.name),
				posYLeft:room.posYLeft,
				posYRight:room.posYRight,
				scoreLeft:room.scoreLeft,
				scoreRight:room.scoreRight,
				gameStatus:room.gameStatus
			});
		}
		else if (room.playerLeft === player || room.playerRight === player) {
			player.socket.emit('Error_player_already_in_room');
		}
		else if (room.playerLeft != null  && room.playerRight != null) {
			player.socket.emit('Error_room_full');
		}
		else {
			let opponent:Player | null = null;
			if (room.playerLeft === null) {
				room.playerLeft = player;
				opponent = room.playerRight;
			}
			else if (room.playerRight === null) {
				room.playerRight = player;
				opponent = room.playerLeft;
			}
			room.gameStatus = 'ONGOING';
			const index = this.rooms.indexOf(room);
			this.rooms[index] = room;
			player.socket.emit('room_joined', {
				id:room.id,
				ball:room.ball,
				yourSide:this.getSideOfPlayer(room,player), 
				opponentName: (this.getSideOfPlayer(room,player) === 'left' ? room.playerRight?.name : room.playerLeft?.name),
				posYLeft:room.posYLeft,
				posYRight:room.posYRight,
				scoreLeft:room.scoreLeft,
				scoreRight:room.scoreRight,
				gameStatus:room.gameStatus
			});
			if (opponent) {
				opponent.socket.emit('room_status_change', {
					id:room.id,
					ball:room.ball,
					yourSide:this.getSideOfPlayer(room, opponent), 
					opponentName: (this.getSideOfPlayer(room,opponent) === 'left' ? room.playerRight?.name : room.playerLeft?.name),
					posYLeft:room.posYLeft,
					posYRight:room.posYRight,
					scoreLeft:room.scoreLeft,
					scoreRight:room.scoreRight,
					gameStatus:room.gameStatus
				});
			}
			
		}
		console.log('addPlayerToRoom');
		console.log('Rooms :', this.rooms);
	};

	getNumberOfPlayersInRoom(room:Room):number {
		if (room.playerLeft === null && room.playerRight === null) return 0;
		if (room.playerLeft === null || room.playerRight === null) return 1;
		return 2;
	};

	getSideOfPlayer(room:Room, player:Player):string {
		if (player === room.playerLeft) return 'left';
		if (player === room.playerRight) return 'right';
		else return 'none';
	};

	removePlayerFromRoom(player:Player) {
		let room = this.findRoomOfPlayer(player);
		if (room && this.getNumberOfPlayersInRoom(room) != 2){
			this.removeRoom(room);
		}
		else if (room && room.playerLeft === player) {
			const index = this.rooms.indexOf(room);
			room.playerLeft = null;
			this.rooms[index] = room;
			room.playerRight?.socket.emit('opponent_left');
			console.log('Rooms :', this.rooms);
		}
		else if (room && room.playerRight === player) {
			const index = this.rooms.indexOf(room);
			room.playerRight = null;
			this.rooms[index] = room;
			room.playerLeft?.socket.emit('opponent_left');
			console.log('Rooms :', this.rooms);
		}
	}
}
