import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnerScore } from './entities/owner-score.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OwnerScoreService {

  constructor(@InjectRepository(OwnerScore) private repository:Repository<OwnerScore>) {}

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({id} );
  }


}
