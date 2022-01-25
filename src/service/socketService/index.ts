import {io,Socket} from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

class SocketService{
    public socket:any=null;
    public connect(url:string): Promise<Socket<DefaultEventsMap,DefaultEventsMap>>{
        return new Promise((rs,rj)=>{
            this.socket=io(url);
            if(!this.socket)return rj();
            this.socket.on('connect',()=>{
                rs(this.socket as Socket);
                this.socket.emit('custom_event','Hello Server');
            });
            this.socket.on('connection_error',(err:any)=>{
                console.log(`Error en la conexión: ${err}`);
                rj(err);
            });
            
        });
    }
}

export default new SocketService();