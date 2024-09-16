import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { username: user.username, sub: user._id };
    return {
      user_id: user._id,
      user_name: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: LoginDto) {
    return this.usersService.create(registerDto);
  }
}
