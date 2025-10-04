import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemSeries } from './entities/item-sery.entity';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { Average } from '../averages/entities/average.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ItemSeriesService {
  constructor(
    @InjectRepository(ItemSeries)
    private readonly itemSeriesRepo: Repository<ItemSeries>,

    @InjectRepository(Average)
    private readonly averageRepo: Repository<Average>,
  ) {}

  async findAll() {
  return this.itemSeriesRepo.find({
    relations: ['rating', 'ownerScore', 'user'],
    order: { id: 'ASC' },
  });
}

  // CREATE
  async create(dto: CreateItemSeryDto, user: LoggedInDto) {
    const series = this.itemSeriesRepo.create({
      name: dto.name,
      year: dto.year,
      description: dto.description,
      imageUrl: dto.imageUrl,
      rating: dto.ratingId ? ({ id: dto.ratingId } as any) : undefined,
      ownerScore: dto.ownerScoreId
        ? ({ id: dto.ownerScoreId } as any)
        : undefined,
      user: { id: user.id } as any,
    });
    return this.itemSeriesRepo.save(series);
  }

  // PAGINATE (manual)
  async paginate(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.itemSeriesRepo.findAndCount({
      select: [
        'id',
        'name',
        'year',
        'description',
        'imageUrl',
        'avg_rating',
        'rating_count',
      ],
      relations: ['rating', 'ownerScore', 'user'],
      take: limit,
      skip,
      order: { id: 'ASC' },
    });

    return {
      data,
      meta: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // PAGINATE (nestjs-paginate)
  async paginateSeries(query: PaginateQuery) {
    return paginate(query, this.itemSeriesRepo, {
      relations: ['rating', 'ownerScore', 'user'],
      sortableColumns: ['id', 'year', 'avg_rating', 'rating_count'],
      searchableColumns: ['name', 'description'],
      defaultSortBy: [['avg_rating', 'DESC']],
      maxLimit: 50,
    });
  }

  // FIND ONE
  async findOne(id: number) {
    const series = await this.itemSeriesRepo.findOne({
      where: { id },
      relations: ['rating', 'ownerScore', 'user', 'averages'],
    });
    if (!series) throw new NotFoundException(`ItemSeries id=${id} not found`);
    return series;
  }

  // UPDATE
  async update(id: number, dto: UpdateItemSeryDto, user: LoggedInDto) {
    const series = await this.itemSeriesRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!series) throw new NotFoundException(`ItemSeries id=${id} not found`);
    if (series.user.id !== user.id)
      throw new ForbiddenException('You are not the owner of this series');

    Object.assign(series, {
      name: dto.name ?? series.name,
      year: dto.year ?? series.year,
      description: dto.description ?? series.description,
      imageUrl: dto.imageUrl ?? series.imageUrl,
      rating: dto.ratingId ? ({ id: dto.ratingId } as any) : series.rating,
      ownerScore: dto.ownerScoreId
        ? ({ id: dto.ownerScoreId } as any)
        : series.ownerScore,
    });

    return this.itemSeriesRepo.save(series);
  }

  // DELETE
  async remove(id: number, user: LoggedInDto) {
    const series = await this.itemSeriesRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!series) throw new NotFoundException(`ItemSeries id=${id} not found`);
    if (series.user.id !== user.id)
      throw new ForbiddenException('You are not the owner of this series');

    await this.itemSeriesRepo.remove(series);
    return { success: true, message: `Deleted series id=${id}` };
  }

  // RATE SERIES
  async rateSeries(itemSeriesId: number, score: number, username: string) {
    if (score < 1 || score > 5)
      throw new BadRequestException('คะแนนต้องอยู่ระหว่าง 1 ถึง 5');

    const series = await this.itemSeriesRepo.findOne({
      where: { id: itemSeriesId },
    });
    if (!series)
      throw new NotFoundException(`ItemSeries id=${itemSeriesId} not found`);

    const avg = this.averageRepo.create({
      itemSeries: { id: itemSeriesId } as any,
      username,
      score,
    });
    await this.averageRepo.save(avg);

    const all = await this.averageRepo.find({
      where: { itemSeries: { id: itemSeriesId } },
    });

    const totalScore = all.reduce((sum, a) => sum + a.score, 0);
    const avgScore = totalScore / all.length;

    series.avg_rating = avgScore;
    series.rating_count = all.length;
    await this.itemSeriesRepo.save(series);

    return { success: true, avg_rating: avgScore, rating_count: all.length };
  }
}
