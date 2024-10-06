import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './schemas/message.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly usersService: UsersService,
  ) {}

  async sendMessage(senderProfilePic: string, senderId: string, receiverId: string, message: string) {
    console.log(senderId);
    
    if (!Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(receiverId)) {
      throw new BadRequestException('Invalid userId format');
    }

    const sender = await this.usersService.findById(senderId) as any;
    const senderUsername = sender.username
    const receiver = await this.usersService.findById(receiverId) as any;
    const receiverUsername = receiver.username
    if (!sender || !receiver) {
      throw new UnauthorizedException('Sender or receiver is not registered');
    }
    
    const newMessage = new this.messageModel({ senderProfilePic, senderUsername, senderId, receiverUsername, receiverId, message });
    await newMessage.save();

    // Send message notification via RabbitMQ
    await this.rabbitMQService.sendMessage({
      senderUsername,
      senderId,
      receiverUsername,
      receiverId,
      message,
    });

    return newMessage;
  }

  async getMessages(userId: string) {
    return this.messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
  }
  
  async getMessagesBetweenUsers(userId1: string, userId2: string) {
    return this.messageModel
      .find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      })
      .sort({ createdAt: 1 });
  }

  async getAllMessagesForUser(userId: string) {
    const messages = await this.messageModel.find({
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    })
    .select(['senderProfilePic', 'senderId', 'senderUsername', 'message'])
    .exec();
  
    // Ensure the result is an array and explicitly map it if needed
    return messages.map((msg) => ({
      senderProfilePic: msg.senderProfilePic,
      senderId: msg.senderId,
      senderUsername: msg.senderUsername,
      message: msg.message,
    }));
  }
  
}
