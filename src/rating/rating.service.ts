import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService {
 

  constructor(
    @InjectRepository(Rating) private readonly repository: Repository<Rating>,
  ){}

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({id} );
  }
}
