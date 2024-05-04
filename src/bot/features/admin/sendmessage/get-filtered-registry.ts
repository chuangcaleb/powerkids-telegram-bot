import { client } from "~/lib/directus/client.js";
import { Student } from "~/lib/directus/types-gen.js";

export function getFilteredRegistry(ignoreList: Student[]) {
  const { students } = client;
  const ignoreStudents = new Set(ignoreList.map((r) => r.name));
  return students.filter((student) => !ignoreStudents.has(student.name));
}
