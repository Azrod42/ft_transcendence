import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {OnModuleInit} from "@nestjs/common";
import  { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service';


@WebSocketGateway(4001, {cors: { origin: ['http://localhost:3000']}})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    constructor(private readonly userService: UserService) {}

    sockets: { [id: string]: Socket } = {};
    connectedUser: any[];

    onModuleInit(): any {
        this.server.setMaxListeners(2000);
        this.server.on('connection', (socket) => {
            console.log(`a user connected as = ${socket.id}`);
        this.sockets[socket.id] = socket;

            socket.on('storeClientInfo', async function (data) {
            console.log(' We are in storeClientInfo, Received ID:', data.socketId, 'for user:', data.userId.user.id);
            this.server.sockets.to(data.socketId).emit('newSocket', data);
            //this.userService.updateWebSocketId(data.userId.user.id, data.socketId);  
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                delete this.sockets[socket.id];
            });
        })
        setInterval(() => {
            this.connectedUser = [];
            this.server.emit('ping', {
                data: 'ping'
            })
            }, 5000)
        setInterval(() => {
            this.server.emit('connectedUser', {
                data: this.connectedUser,
            })
        }, 6000)
    }

    @SubscribeMessage('room')
    onCreateRoom(@MessageBody() body: string) {
        this.server.socketsJoin(body);
    }

    @SubscribeMessage('gameRoom')
    onCreateGameRoom(@MessageBody() body: string) {
        this.server.socketsJoin(body);
        this.server.in(body).emit(body, {message: 'A nerd join gameRoom'});
    }
    @SubscribeMessage('pong')
    onPongHandle(@MessageBody() body: any) {
        const actual = this.connectedUser;
        for (let i  = 0; actual[i]; i++) {
            if (actual[i].id == body?.user.id) {
                return;
            }
        }
        this.connectedUser.push(body?.user);
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        this.server.emit('onMessage', {
            msg: 'New message',
            content: body?.message,
        })
    }

    @SubscribeMessage('channelMessage')
    async onChannelMessage(@MessageBody() body: {channel: string, message: string}) {
    this.server.in(body.channel).emit(body.channel, {
        msg: 'New message',
        content: body?.message
    })
    }

    @SubscribeMessage('duelRequest')
    onDuelRequest(@MessageBody() data: { socketId: string, idRoom: string }) {
    console.log(`We are in 'duelRequest' event and this is socketId = ${data.socketId}`, "ID room", data?.idRoom);
    this.server.sockets.to(data.socketId).emit('duelRequest', data);
    }

    @SubscribeMessage('acceptDuel')
    onDuelRequestAccepted(@MessageBody() data: { socketId: string, idRoom: string}) {
        console.log('yes -0-0-0-0-0-0- ', data.idRoom);

    }

    @SubscribeMessage('move')
    onMove(@MessageBody() data: { idRoom: string, user:string, y: string}) {
        this.server.in(data.idRoom).emit(data.idRoom, data);
    }

}
    
