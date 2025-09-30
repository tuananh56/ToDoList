import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }
  
  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  // 🔥 Thêm hàm mới để tìm bằng username hoặc email
  async findByUsernameOrEmail(keyword: string) {
    return this.usersRepository.findOne({
      where: [{ username: keyword }, { email: keyword }],
    });
  }
}
