import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'; // ✅ import JwtService

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // ✅ inject JwtService
  ) {}

  // ===================== REGISTER =====================
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return { message: 'Đăng ký thành công', user: { id: user.id, username: user.username, email: user.email } };
  }

  // ===================== LOGIN =====================
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { username: user.username, sub: user.id, role: user.role }; // sub quan trọng
    const token = this.jwtService.sign(payload); // ✅ tạo JWT

    return { user, token }; // frontend dùng data.token
  }

  // ===================== VALIDATE USER =====================
  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Sai mật khẩu');

    return user;
  }
}
