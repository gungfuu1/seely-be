import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createItemSerySchema = z.object({
  name: z.string().min(1, 'name is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  description: z.string().min(1, 'description is required'),
  image_url: z.string().url('image must be a valid URL').optional(),
  avg_rating: z.number().default(0),
  rating_count: z.number().int().default(0),
  rating_id: z.number().int().min(1).max(6),
ownerscore_id: z.number().int().min(1).max(11),
});

export class CreateItemSeryDto extends createZodDto(createItemSerySchema) {}