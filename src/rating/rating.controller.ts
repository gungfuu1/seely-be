import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }
}
