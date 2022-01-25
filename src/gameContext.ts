import React from "react";

export interface IGameContext{
 isInRoom:boolean,
 setInRoom:(inRoom:boolean)=>void,
 isGameStart:boolean,
 setGameStart:(gameStart:boolean)=>void
}

const defaultState:IGameContext={
  isInRoom:false,
  setInRoom:()=>{},
  isGameStart:false,
  setGameStart:()=>{}
}

export default React.createContext(defaultState);