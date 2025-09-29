import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const idSchema = z.object({
    id: z.coerce.number(`id should be number`),
});

export class idDto extends createZodDto(idSchema) {}