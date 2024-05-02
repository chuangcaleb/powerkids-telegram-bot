import { ExitConversationError } from "~/bot/helpers/conversation/exit-convo-error.js";
import { directus } from "~/lib/directus/client.js";
import { Student } from "~/lib/directus/types-gen.js";

export function getFilteredRegistry(ignoreList: Student[]) {
  try {
    const registry = directus.students;
    if (registry.length === 0)
      throw new ExitConversationError(
        "Students registry is empty. Please contact developer."
      );
    const ignoreStudents = new Set(ignoreList.map((r) => r.name));
    return registry.filter((student) => !ignoreStudents.has(student.name));
  } catch (error) {
    throw new ExitConversationError(JSON.stringify(error));
  }
}
