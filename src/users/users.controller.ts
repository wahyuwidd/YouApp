import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Model, Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
