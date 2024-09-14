import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:password@mongo:27017/chatdb?authSource=admin'),
    AuthModule,
    UsersModule,
    ChatModule,
  ],
  providers: [RabbitMQService],
})
export class AppModule {}
