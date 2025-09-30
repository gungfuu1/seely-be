import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { ItemSeries } from './entities/item-sery.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery, PaginateConfig } from 'nestjs-paginate';

export const paginateConfig: PaginateConfig<ItemSeries> = {
  sortableColumns: ['id', 'name', 'avg_rating', 'rating_count'],
  searchableColumns: ['name','year','description'],
};

@Injectable()
export class ItemSeriesService {
  
  constructor(@InjectRepository(ItemSeries) private repository: Repository<ItemSeries>) {}

    create(createItemSeryDto: CreateItemSeryDto, loggedInDto: LoggedInDto) {
  return this.repository.save({
    ...createItemSeryDto,
    user: { username: loggedInDto.username },
  });
}

    private queryTemplate() {
      return this.repository
        .createQueryBuilder('itemSeries')
        .leftJoinAndSelect('itemSeries.rating','rating')
        .leftJoinAndSelect('itemSeries.ownerScore','ownerScore')
        .leftJoin('itemSeries.user','user')
        .addSelect(['user.id', 'user.username','user.role']);
    }
 
    async search(query: PaginateQuery) {
      const page = await paginate<ItemSeries>(
        query,
        this.queryTemplate(),
        paginateConfig,
      );

      return {
        data: page.data,
        meta: page.meta,
      };
    }


 
  findOne(id: number) {
    return this.queryTemplate().where('itemSeries.id = :id', { id }).getOne();
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
