import { Injectable } from '@nestjs/common';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { ItemSeries } from './entities/item-sery.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemSeriesService {
  constructor(
    @InjectRepository(ItemSeries)
    private repository: Repository<ItemSeries>,
  ) {}

  async create(createItemSeryDto: CreateItemSeryDto, loggedInDto: LoggedInDto) {
  return this.repository.save({
    ...createItemSeryDto,
    rating: { id: createItemSeryDto.rating_id },
    ownerscore: { id: createItemSeryDto.ownerscore_id },
    user: { username: loggedInDto.username },
  });
}

  async findAll() {
    return this.repository.find({
      relations: ['rating_id', 'ownerScore_id', 'user'], // โหลด relation มาด้วย
    });
  }

  async findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['rating_id', 'ownerScore_id', 'user'],
    });
  }

  async update(id: number, updateItemSeryDto: UpdateItemSeryDto) {
    await this.repository.update(id, updateItemSeryDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repository.delete(id);
    return { deleted: true };
  }
}
