import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ItemSeriesService } from './item-series.service';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller({
  path: 'item-series',
  version: '1',
})
export class ItemSeriesController {
  constructor(private readonly itemSeriesService: ItemSeriesService) {}

  // GET ทั้งหมด (ไม่จำกัดหน้า)
  @Get('all')
  findAll() {
    return this.itemSeriesService.findAll();
  }

  // GET แบบ paginate + search/sort/filter
  @Get()
  async paginate(
    @Paginate() query: PaginateQuery,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('usePaginateLib') useLib?: string,
  ) {
    if (useLib === 'true') {
      const result = await this.itemSeriesService.paginateSeries(query);
      return {
        data: result.data,
        meta: result.meta,
      };
    }
    return this.itemSeriesService.paginate(+page || 1, +limit || 10);
  }

  // GET by ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemSeriesService.findOne(id);
  }

  // create
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateItemSeryDto, @Req() req: any) {
    return this.itemSeriesService.create(dto, req.user as LoggedInDto);
  }

  // update
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: number,
    @Body() dto: UpdateItemSeryDto,
    @Req() req: any,
  ) {
    return this.itemSeriesService.update(+id, dto, req.user as LoggedInDto);
  }

  // delete
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number, @Req() req: any) {
    return this.itemSeriesService.remove(+id, req.user as LoggedInDto);
  }

  // vote / rate
  @Post(':id/rate')
  rateSeries(
    @Param('id') id: number,
    @Body('score') score: number,
    @Body('username') username: string,
  ) {
    return this.itemSeriesService.rateSeries(+id, score, username);
  }
}
