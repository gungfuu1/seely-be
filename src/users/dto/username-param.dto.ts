import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const usernameParamSchema = z.object({
  username: z.string().min(3, 'username is required'),
});

export class UsernameParamDto extends createZodDto(usernameParamSchema) {}
