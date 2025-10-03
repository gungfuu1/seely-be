import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, Put } from '@nestjs/common';
import { AvgrService } from './avgr.service';
import { ItemSeriesService, paginateConfig } from './item-series.service';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { IdDto } from '@app/common/dto/id.dto';
import { AvgrDto } from './dto/avgr.dto';

@Controller('item-series')
export class ItemSeriesController {
  constructor(
    private readonly itemSeriesService: ItemSeriesService,
    private readonly avgrService: AvgrService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateItemSeryDto, @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.create(dto, req.user.username); // ✅ ส่ง username ตรงๆ
  }

  @ApiPaginationQuery(paginateConfig)
  @Get()
  search(@Paginate() query: PaginateQuery) {
    return this.itemSeriesService.search(query);
  }

  @Get(':id')
  findOne(@Param() idDto: IdDto) {
    return this.itemSeriesService.findOne(idDto.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param() idDto: IdDto,
    @Body() updateItemSeryDto: UpdateItemSeryDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.itemSeriesService.update(
      idDto.id,
      updateItemSeryDto,
      req.user.username,
    );
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param() idDto: IdDto, @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.remove(idDto.id, req.user.username);
  }

  @Put(':id/avgr')
  @UseGuards(JwtAuthGuard)
  async avgr(
    @Param() idDto: IdDto,
    @Body() avgrDto: AvgrDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.avgrService.rate(idDto.id, avgrDto, req.user);
  }
}
