
export interface IGameParamBackEnd {
    ballRadius: number;
    paddleWidth: number;
    paddleHeight: number;
    ballInitSpeed: number;
    ballInitDir: {x:number, y:number};
    ballSpeedIncrease: number;
    paddleSpeed:number;
    goal:number;
};