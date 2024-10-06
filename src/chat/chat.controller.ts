import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Post('send-message')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('message') message: string,
  ) {
    const senderProfilePic = 'https://i.pravatar.cc/300';
    return this.chatService.sendMessage(senderProfilePic, senderId, receiverId, message);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('view-messages')
  async getMessages(@Request() req) {
    const userId = req.user.userId;
    return this.chatService.getMessages(userId);
  }
}
