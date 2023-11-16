import { IgameParams } from "../Interface/gameParam.interface"

export const gameParams : IgameParams[] = [
	{
		type:'BASIC', 
		ballRadius: 0.01,
		paddleWidth: 0.02,
		paddleHeight: 0.25,
		ballSpeedIncrease: 0.0005,
		paddleSpeed: 0.01,
		goal: 5,
		ballInitPosx: 0.5,
		ballInitPosy: 0.5,
		BallInitDirx: 0.5,
		BallInitDiry: -1,
		BallInitSpeed: 0.006
	}, 
	{
		type:'ADVANCED', 
		ballRadius: 0.01,
		paddleWidth: 0.02,
		paddleHeight: 0.25,
		ballSpeedIncrease: 0.0005,
		paddleSpeed: 0.01,
		goal: 1000,
		ballInitPosx: 0.5,
		ballInitPosy: 0.5,
		BallInitDirx: 0.5,
		BallInitDiry: -1,
		BallInitSpeed: 0.002
	}
]