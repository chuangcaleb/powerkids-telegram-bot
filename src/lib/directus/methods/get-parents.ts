import { readItems } from "@directus/sdk";
import { client } from "../client.js";

export function getParents() {
  return client.request(
    readItems("parent", {
      fields: [
        "ic",
        "name",
        "mobile",
        "father_to",
        "mother_to",
        "gender",
        "telegram_id",
      ],
      limit: 999,
    })
  );
}
