import { getParent } from "#root/lib/directus/methods/get-parent.js";
import { Student } from "#root/lib/directus/types-gen.js";

async function getStudentParents(student: Student) {
  const { father: fatherIc, mother: motherIc } = student;
  const father = await getParent(fatherIc);
  const mother = await getParent(motherIc);
  return [father, mother];
}

export async function getStudentTelegramIds(
  student: Student
): Promise<[string[], boolean]> {
  const [father, mother] = await getStudentParents(student);
  const ids = [father.telegram_id, mother.telegram_id];
  return [
    ids.filter(<T>(value: T): value is NonNullable<T> => value !== null),
    ids.some(Boolean),
  ];
}
