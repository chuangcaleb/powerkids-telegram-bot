import { readItems } from "@directus/sdk";
import { client } from "../base-client.js";

export function getStudents() {
  return client.request(
    readItems("student", {
      fields: ["ic", "name", "telegram_ids", "mother", "father"],
      limit: 999,
    })
  );
}
