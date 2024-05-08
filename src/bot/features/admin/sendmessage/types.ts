import { Student } from "#root/lib/directus/types-gen.js";

export interface SelectedStudent {
  student: Student;
  telegramIds: string[];
}
