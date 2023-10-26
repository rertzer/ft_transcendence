import React, { createContext, useContext, useEffect, useState } from "react";

export interface IConnected {
	username: string,
	setUsername: (username: string) => void;
}

const defaultState:IConnected = {
	username: '',
	setUsername: () => {},
}

export default React.createContext(defaultState);