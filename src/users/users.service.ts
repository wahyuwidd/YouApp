import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(loginDto: LoginDto) {
    const newUser = new this.userModel(loginDto);
    return newUser.save();
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username, password });
    return user ? user : null;
  }

  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }
}
