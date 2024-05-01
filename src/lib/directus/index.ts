import {
  createDirectus,
  readItems,
  readUsers,
  rest,
  staticToken,
} from "@directus/sdk";
import { config } from "~/config.js";
import { Schema } from "./schema.js";

const client = createDirectus<Schema>(config.DIRECTUS_URL)
  .with(staticToken(config.DIRECTUS_STATIC_TOKEN + 0))
  .with(rest());

const directus = {
  getRegistry() {
    return client.request(
      readItems("student", {
        fields: ["ic", "name", "telegram_ids"],
        limit: 999,
      })
    );
  },
  getUsers() {
    return client.request(
      readUsers({ fields: ["id", "first_name", "telegram_ids"] })
    );
  },
};

export { directus };
