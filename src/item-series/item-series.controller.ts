import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ItemSeriesService } from './item-series.service';
import { CreateItemSeryDto } from './dto/create-item-sery.dto';
import { UpdateItemSeryDto } from './dto/update-item-sery.dto';
import { Auth } from '@app/auth/entities/auth.entity';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';

@Controller('item-series')
export class ItemSeriesController {
  constructor(private readonly itemSeriesService: ItemSeriesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createItemSeryDto: CreateItemSeryDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.itemSeriesService.create(createItemSeryDto, req.user);
  }

  @Get()
  findAll() {
    return this.itemSeriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemSeriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateItemSeryDto: UpdateItemSeryDto) {
    return this.itemSeriesService.update(+id, updateItemSeryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemSeriesService.remove(+id);
  }
}
