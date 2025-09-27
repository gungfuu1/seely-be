import { PartialType } from '@nestjs/mapped-types';
import { CreateOwnerScoreDto } from './create-owner-score.dto';

export class UpdateOwnerScoreDto extends PartialType(CreateOwnerScoreDto) {}
