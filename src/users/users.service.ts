import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    // 10 = hash password 2^10 = 1024 rounds
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = { ...createUserDto, password: hashedPassword };

    const savedUser = await this.repository.save(user);

    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username });
  }

}