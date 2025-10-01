import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const idSchema = z.object({
    id: z.coerce.number().int().min(1, `id should be number`),
});

export class IdDto extends createZodDto(idSchema) {}