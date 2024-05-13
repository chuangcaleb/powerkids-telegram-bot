import { createDirectus, rest, staticToken } from "@directus/sdk";
import { config } from "#root/config.js";
import { Schema } from "./schema.js";

export const client = createDirectus<Schema>(config.DIRECTUS_URL)
  .with(staticToken(config.DIRECTUS_STATIC_TOKEN))
  .with(rest());
