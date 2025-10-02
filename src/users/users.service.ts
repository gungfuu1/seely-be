import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<User>) {
    // ถ้าเป็น user ปกติ → hash password
    let password = createUserDto.password;
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const user = {
      ...createUserDto,
      password,
    };

    return this.repository.save(user);
  }

  findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username });
  }

  async findByKeycloakId(keycloakId: string) {
    return this.repository.findOne({ where: { keycloakId } });
  }

  async upsertByKeycloakId(username: string, keycloakId: string): Promise<User> {
    const result = await this.repository.upsert(
      { username, keycloakId },
      {
        conflictPaths: ['keycloakId'],
      },
    );
    console.log('upsert', result);

    return this.repository.findOneByOrFail({ keycloakId });
  }

  async update(id: number, updateData: Partial<User>) {
    await this.repository.update(id, updateData);
    return this.repository.findOneByOrFail({ id });
  }
}
