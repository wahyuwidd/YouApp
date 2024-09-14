import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private readonly queue = 'chat_queue';
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
  }

  async sendMessage(msg: { senderId: string; receiverId: string; message: string }) {
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
  }
}
