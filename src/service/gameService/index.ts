import {io,Socket} from 'socket.io-client'
import { Game, ICorrectWord, IStartGame } from '../../components/game';

class GameService{
    public async joinGameRoom(socket:Socket, roomId:String):Promise<boolean>{
        return new Promise((rs,rj)=>{
            socket.emit('joined_room',{roomId});
            socket.on('room_joined',()=>rs(true));
            socket.on('room_joined_error',({error})=>rj(error))
        })
    }
    public async onStartGame(socket:Socket,listener:(options:IStartGame)=>void){
        socket.on('start_game',listener);
    }
    public async correctWord(socket:Socket,correctWords:ICorrectWord){
        socket.emit('correct_word',{correctWords});
    }
    public async onCorrectWord(socket:Socket,listener:(corectWords:ICorrectWord)=>void){
        socket.on('on_correct_word',({correctWords})=>listener(correctWords));
    }
}

export default new GameService();