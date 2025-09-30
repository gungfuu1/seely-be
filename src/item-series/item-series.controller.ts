import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, Put } from '@nestjs/common';
import { AvgrService } from './avgr.service';
import { ItemSeriesService, paginateConfig } from './item-series.service';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { idDto } from '@app/common/dto/id.dto';
import { AvgrDto } from './dto/avgr.dto';



@Controller('item-series')
export class ItemSeriesController {
  [x: string]: any;
  constructor(
    private readonly itemSeriesService: ItemSeriesService,
    private readonly avgrService: AvgrService,) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createItemSeryDto: CreateItemSeryDto,
    @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.create
    (createItemSeryDto, req.user);
  }

  @ApiPaginationQuery(paginateConfig)
  @Get()
  search(@Paginate() query: PaginateQuery) {
    return this.itemSeriesService.search(query);
  }

  @Get(':id')
  findOne(@Param() idDto: idDto) {
    return this.itemSeriesService.findOne(idDto.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param() idDto: idDto, 
    @Body() updateItemSeryDto: UpdateItemSeryDto,
    @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.update(
      idDto.id, 
      updateItemSeryDto, 
      req.user);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param() idDto: idDto, @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.remove(idDto.id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/avgr')
  async avgr(
  @Param() idDto: idDto,
  @Body() avgrDto: AvgrDto,
  @Req() req: { user: LoggedInDto },
) {
  return this.avgrService.rate(idDto.id, avgrDto, req.user);
}

  
}
