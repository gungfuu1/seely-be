import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';

import { ItemSeriesService, paginateConfig } from './item-series.service';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { idDto } from '@app/common/dto/id.dto';

@Controller('item-series')
export class ItemSeriesController {
  constructor(
    private readonly itemSeriesService: ItemSeriesService) {}

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
    return this.itemSeriesService.update(idDto.id, 
    updateItemSeryDto, req.user);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param() idDto: idDto, @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.remove(idDto.id, req.user);
  }

  
}
