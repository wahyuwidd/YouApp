import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderUsername: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  receiverUsername: string;

  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
