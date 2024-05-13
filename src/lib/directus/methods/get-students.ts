import { readItems } from "@directus/sdk";
import { client } from "../client.js";

export function getStudents() {
  return client.request(
    readItems("student", {
      fields: ["ic", "name", "mother", "father"],
      limit: 999,
    })
  );
}
