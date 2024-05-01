import { createDirectus, rest, staticToken } from "@directus/sdk";
import { config } from "~/config.js";
import { Schema } from "./schema.js";

const directus = createDirectus<Schema>(config.DIRECTUS_URL)
  .with(staticToken(config.DIRECTUS_STATIC_TOKEN))
  .with(rest());

export { directus };
