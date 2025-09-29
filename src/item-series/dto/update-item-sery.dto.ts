import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { createItemSerySchema } from "./create-item-sery.dto";

const updateItemSerySchema = createItemSerySchema.partial();

// Partial schema สำหรับ update
export class UpdateItemSeryDto extends createZodDto(
  updateItemSerySchema,
) {}
