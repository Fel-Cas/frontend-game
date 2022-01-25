import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'; 
import { JoinRoom } from './components/room';
import socketService from './service/socketService';
import GameContext,{IGameContext} from './gameContext';
import { Game } from './components/game';

const AppContainer=styled.div`
    witdh:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:1rem;
`;
const AppTitle=styled.h1`
    color:#1A374D;
    font-size:2rem;
    font-weight:900;    
`;
const MainContainer=styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
function App() {

  const [isInRoom, setInRoom]=useState(false);
  const [isGameStart, setGameStart]=useState(false);
  
   let connecSocket=async()=>{
      let socket=socketService.connect('http://localhost:9000').catch(err=>{
        alert(err);
      });
    }

    useEffect(()=>{
        connecSocket();
    },[])

    const gameContextValue:IGameContext={isInRoom, setInRoom,isGameStart,setGameStart};
  return (
    <GameContext.Provider value={gameContextValue}>
      <AppContainer>
        <AppTitle>Anagrama Challenge</AppTitle>
        <MainContainer>
          {!isInRoom && <JoinRoom/>}
          {isInRoom && <Game/>}
        </MainContainer>
      </AppContainer>  
    </GameContext.Provider>
  );
}

export default App;
