import { z } from "zod";
import { STORE_TYPE_LIST } from "../constants";

export const StoreTypeEnum = z.enum(STORE_TYPE_LIST);

export const StoreSchema = z.object({
  id: z.number(),
  type: StoreTypeEnum,
  name: z.string(),
  country: z.string().nullable(),
  lastRunAt: z.string().datetime().nullable(),
});

export const StoreInputSchema = z.object({
  type: StoreTypeEnum,
  name: z.string(),
  country: z.string().nullable().optional(),
});

export const StorePriceSchema = z.object({
  name: z.string(),
  price: z.number(),
  url: z.string(),
  volume: z.number(),
  store: StoreSchema.optional(),
  updatedAt: z.string().datetime(),
});

export const StorePriceInputSchema = z.object({
  name: z.string(),
  price: z.number(),
  volume: z.number(),
  url: z.string(),
});
