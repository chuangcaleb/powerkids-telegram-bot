import { SelectedStudent, Targets } from "../types.js";

export function pivot(selection: SelectedStudent[]) {
  const parentMap = [];
  const targets: Targets = {};
  // pivot
  for (const selectedStudent of selection) {
    for (const parent of selectedStudent.parents) {
      parentMap.push({
        telegramId: parent.telegram_id,
        parentName: parent.name,
        studentName: selectedStudent.student.name,
      });
    }
  }
  // dedupe (while combining names)
  for (const parentPair of parentMap) {
    const { telegramId, parentName, studentName } = parentPair;
    // eslint-disable-next-line no-continue
    if (!telegramId) continue;
    if (targets[telegramId]) {
      targets[telegramId].children.push(studentName);
    } else {
      targets[telegramId] = { parent: parentName, children: [studentName] };
    }
  }
  return targets;
}
