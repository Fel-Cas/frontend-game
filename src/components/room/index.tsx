import  mind from '../../assets/mind.jpg';
import React, { useContext, useState } from "react";
import styled  from "styled-components";
import gameContext from '../../gameContext';
import socketService from '../../service/socketService';
import gameService from '../../service/gameService';

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;
`;
const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #406882;
  border-radius: 3px;
  padding: 0 10px;
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #406882;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    border: 2px solid #406882;
    color: #406882;
  `;
  const ImageDecoration=styled.img`
    margin: 3rem auto;
    border: 2px solid #000;
  `;
export function JoinRoom(){
    const [roomName, setRooName]=useState('');
    const [isJoin, setJoin]=useState(false);
    const {isInRoom,setInRoom}=useContext(gameContext);


    let handleRoomName=(e:React.ChangeEvent<any>)=>{
        let value=e.target.value;
        setRooName(value);
    }
    let joinRoom= async (e:React.ChangeEvent<any>)=>{
        e.preventDefault();
        const socket=socketService.socket;
        if(!roomName || roomName.trim()==="" || !socket) return;
        setJoin(true);
        console.log(12)
        let playerJoin= await gameService.joinGameRoom(socket,roomName)
        .catch((err)=>{
          alert(err);
        });
        
        console.log('dfdff')
        if(playerJoin){setInRoom(true);}
        setJoin(false);
    }
    return(
        <form onSubmit={joinRoom}>
            <JoinRoomContainer>
                <h4>Entre el ID de la sala a la que desea entrar</h4>
                <RoomIdInput placeholder="ID de la sala" value={roomName} onChange={handleRoomName}/>
                <JoinButton type='submit' disabled={isJoin}>{isJoin?'Entrando ....':'Entrar a la sala'}</JoinButton>
                <ImageDecoration src={mind}/>
            </JoinRoomContainer>
        </form>
    );
}