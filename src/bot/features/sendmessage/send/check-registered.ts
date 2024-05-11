import { getParent } from "#root/lib/directus/methods/get-parent.js";
import { Student } from "#root/lib/directus/types-gen.js";

async function getStudentParents(student: Student) {
  const { father: fatherIc, mother: motherIc } = student;
  const father = await getParent(fatherIc);
  const mother = await getParent(motherIc);
  return [father, mother];
}

export async function getStudentRegisteredParents(student: Student) {
  const parents = await getStudentParents(student);
  return parents.filter((p) => !!p.telegram_id);
}
