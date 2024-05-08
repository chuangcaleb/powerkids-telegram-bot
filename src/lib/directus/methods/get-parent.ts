import { readItem } from "@directus/sdk";
import { client } from "../base-client.js";

export function getParent(ic: string) {
  return client.request(
    readItem("parent", ic, {
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
