import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OwnerScoreService } from './owner-score.service';

@Controller('owner-score')
export class OwnerScoreController {
  constructor(private readonly ownerScoreService: OwnerScoreService) {}


  @Get()
  findAll() {
    return this.ownerScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ownerScoreService.findOne(+id);
  }
}