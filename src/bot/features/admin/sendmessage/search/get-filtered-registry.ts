import { Student } from "#root/lib/directus/types-gen.js";
import { SelectedStudent } from "../types.js";

export function getFilteredRegistry(
  students: Student[],
  ignoreList: SelectedStudent[]
): Student[] {
  const ignoreStudents = new Set(
    ignoreList.map((selection) => selection.student.name)
  );
  return students.filter((student) => !ignoreStudents.has(student.name));
}
