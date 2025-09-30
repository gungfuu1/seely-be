import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const avgrDtoSchema = z.object({
  score: z
    .number()
    .int()
    .min(1, 'score must be a number between 1 - 11')
    .max(11, 'score must be a number between 1 - 11'),
});

export class AvgrDto extends createZodDto(avgrDtoSchema) {}