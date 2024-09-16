import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Allow all origins
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private activeUsers: Map<string, string> = new Map();

    constructor(private readonly chatService: ChatService) {}
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.activeUsers.delete(client.id);
    }
  
    @SubscribeMessage('register')
    async handleRegister(@MessageBody() data: { userId: string; receiverId: string }, @ConnectedSocket() client: Socket) {
      // Register the user with their socket ID
      this.activeUsers.set(data.userId, client.id);
      console.log(`${data.userId} registered with socket ${client.id}`);
      const chatHistory = await this.chatService.getMessagesBetweenUsers(
        data.userId,
        data.receiverId,
      );
      client.emit('chatHistory', chatHistory);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(@MessageBody() data: { senderId: string; receiverId: string; message: string }) {
      const { senderId, receiverId, message } = data;
      
      // Save message to database and send notifications
      await this.chatService.sendMessage(senderId, receiverId, message);
      const receiverSocketId = this.activeUsers.get(data.receiverId);
      
      if (receiverSocketId) {
      console.log('jadi');
      this.server.to(receiverSocketId).emit('newMessage', {
        senderId: data.senderId,
        message: data.message,
      });
    }
    }
  
  
    sendNotification(receiverId: string, message: string) {
      const receiverSocketId = this.activeUsers.get(receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', message);
      }
    }
  }
  