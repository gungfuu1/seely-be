import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { ItemSeries } from './entities/item-sery.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemSeriesService {
  [x: string]: any;
  
  constructor(@InjectRepository(ItemSeries)
    private repository: Repository<ItemSeries>,
  ) {}

  create(createItemSeryDto: CreateItemSeryDto, loggedInDto: LoggedInDto) {
  return this.repository.save({
    ...createItemSeryDto,
    user: { username: loggedInDto.username },
  });
}

 
  findOne(id: number) {
    return this.queryTemplate().where('item_series.id = :id', { id }).getOne();
  }

  async update(id: number, updateItemSeryDto: UpdateItemSeryDto, loggedInDto: LoggedInDto) {
  return this.repository.findOneByOrFail({id, user: { username: loggedInDto.username }})
    .then(() => this.repository.save({ id, ...updateItemSeryDto }))
    .catch(() => {
      throw new NotFoundException(`Not found id=${id}`)
    });
}


  async remove(id: number, loggedInDto: LoggedInDto) {
    return this.repository.findOneByOrFail({ id, user: {
    username: loggedInDto.username } })
      .then(() => this.repository.delete({ id }))
      .catch(() => {
        throw new NotFoundException(`Not found: id=${id}`)
      });
  }
}
