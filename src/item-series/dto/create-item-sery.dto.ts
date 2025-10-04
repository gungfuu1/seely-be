import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateItemSeryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string; // 👈 FE ส่ง camelCase

  @IsNumber()
  @IsOptional()
  ratingId?: number;

  @IsNumber()
  @IsOptional()
  ownerScoreId?: number;
}
