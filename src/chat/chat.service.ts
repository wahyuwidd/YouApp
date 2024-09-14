import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async sendMessage(senderId: string, receiverId: string, message: string) {
    const newMessage = new this.messageModel({ senderId, receiverId, message });
    await newMessage.save();
    
    // Send notification via RabbitMQ
    await this.rabbitMQService.sendMessage({
      senderId,
      receiverId,
      message,
    });

    return newMessage;
  }
}
