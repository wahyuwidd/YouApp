import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
