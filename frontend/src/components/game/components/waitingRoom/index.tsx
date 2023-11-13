import React, { useContext, useEffect, useState } from 'react';
import gameContext from '../../../../context/gameContext';

export function WaitingRoom(props:any) {
	const {modeGame} = useContext(gameContext);

	return (
		<>
			{ modeGame === 'BASIC' && <div>You are in the waiting room to join a basic game !  </div>}
			{ modeGame === 'ADVANCED' && <div>You are in the waiting room to join an advanced game !  </div>}
		</>
	)
}
