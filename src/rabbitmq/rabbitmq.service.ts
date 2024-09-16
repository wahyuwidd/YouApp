import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly queue = 'chat_queue';
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
  
      this.channel.on('error', (err) => {
        console.error('Channel error:', err);
      });
  
      this.connection.on('error', (err) => {
        console.error('Connection error:', err);
      });
  
      this.receiveMessages(); // Start consuming messages
    } catch (error) {
      console.error('Error initializing RabbitMQ connection or channel', error);
    }
  }
  
  async sendMessage(msg: { senderUsername: any, senderId: string; receiverUsername:any, receiverId: string; message: string }) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
  }

  async receiveMessages() {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
  
    this.channel.consume(this.queue, (msg) => {
      if (msg !== null) {
        try {
          console.log('Received message:', msg.content.toString());
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel.nack(msg, false, true); 
        }
      }
    });
  }
  
}
