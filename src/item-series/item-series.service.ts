import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { ItemSeries } from './entities/item-sery.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery, PaginateConfig } from 'nestjs-paginate';

export const paginateConfig: PaginateConfig<ItemSeries> = {
  sortableColumns: ['id', 'name', 'avg_rating', 'rating_count'],
  searchableColumns: ['name', 'year', 'description'],
};

@Injectable()
export class ItemSeriesService {
  constructor(
    @InjectRepository(ItemSeries) private repository: Repository<ItemSeries>,
  ) {}

  // ✅ ตอนนี้รับ username ตรงๆ
  create(createItemSeryDto: CreateItemSeryDto, username: string) {
    return this.repository.save({
      ...createItemSeryDto,
      user: { username },
    });
  }

  private queryTemplate() {
    return this.repository
      .createQueryBuilder('itemSeries')
      .leftJoinAndSelect('itemSeries.rating', 'rating')
      .leftJoinAndSelect('itemSeries.ownerScore', 'ownerScore')
      .leftJoin('itemSeries.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.role']);
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
    return this.queryTemplate()
      .where('itemSeries.id = :id', { id })
      .getOne();
  }

  async update(id: number, updateItemSeryDto: UpdateItemSeryDto, username: string) {
    return this.repository
      .findOneByOrFail({ id, user: { username } })
      .then(() => this.repository.save({ id, ...updateItemSeryDto }))
      .catch(() => {
        throw new NotFoundException(`Not found id=${id}`);
      });
  }

  async remove(id: number, username: string) {
    return this.repository
      .findOneByOrFail({ id, user: { username } })
      .then(() => this.repository.delete({ id }))
      .catch(() => {
        throw new NotFoundException(`Not found: id=${id}`);
      });
  }
}
