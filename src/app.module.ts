import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to your public directory
    }),
    MongooseModule.forRoot('mongodb://root:password@localhost:27017/chatdb?authSource=admin'),
    // MongooseModule.forRoot('mongodb://root:password@mongo:27017/chatdb?authSource=admin'),
    AuthModule,
    UsersModule,
    ChatModule,
  ],
  providers: [RabbitMQService],
})
export class AppModule {}
