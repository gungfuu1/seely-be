import { PartialType } from '@nestjs/mapped-types';
import { CreateItemSeryDto } from './create-item-sery.dto';

export class UpdateItemSeryDto extends PartialType(CreateItemSeryDto) {}
