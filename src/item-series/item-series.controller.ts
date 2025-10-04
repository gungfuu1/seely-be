import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ItemSeriesService } from './item-series.service';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { IdDto } from '@app/common/dto/id.dto';

@Controller('item-series')
export class ItemSeriesController {
  constructor(private readonly itemSeriesService: ItemSeriesService) {}

  // ✅ สร้าง series
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateItemSeryDto, @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.create(dto, req.user);
  }

// ✅ ให้ user rate series
  @Post(':id/rate')
  async rateSeries(
    @Param('id') id: number,
    @Body('score') score: number,
    @Body('username') username: string,
  ) {
    return this.itemSeriesService.rateSeries(id, score, username);
  }

  // ✅ ดึงทั้งหมดแบบ paginate
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.itemSeriesService.paginate(Number(page), Number(limit));
  }

  // ✅ ดึง series เดียว
  @Get(':id')
  findOne(@Param() idDto: IdDto) {
    return this.itemSeriesService.findOne(idDto.id);
  }

  // ✅ อัปเดต series
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param() idDto: IdDto,
    @Body() updateItemSeryDto: UpdateItemSeryDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.itemSeriesService.update(idDto.id, updateItemSeryDto, req.user);
  }

  // ✅ ลบ series
  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param() idDto: IdDto, @Req() req: { user: LoggedInDto }) {
    return this.itemSeriesService.remove(idDto.id, req.user);
  }
}
