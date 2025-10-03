import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createItemSerySchema = z.object({
  name: z.string().min(1, 'name is required'),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  description: z.string().min(1, 'description is required'),
  imageUrl: z.string().url('image must be a valid URL').optional(),
  avg_rating: z.number().default(0),
  rating_count: z.number().int().default(0),
  rating: z.object({
    id: z
      .number()
      .int()
      .min(1, 'rating.id must be a number between 1 - 6')
      .max(6, 'rating.id must be a number between 1 - 6'),
  }),
  ownerScore: z.object({
    id: z
      .number()
      .int()
      .min(1, 'ownerscore.id must be a number between 1 - 11')
      .max(11, 'ownerscore.id must be a number between 1 - 11'),
  }),
});

export class CreateItemSeryDto extends createZodDto(createItemSerySchema) {}
