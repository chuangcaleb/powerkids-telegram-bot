import { Parent, Student } from "#root/lib/directus/types-gen.js";

export interface SelectedStudent {
  student: Student;
  parents: Parent[];
}

export interface TargetMeta {
  parent: string;
  children: string[];
}

export interface Targets {
  [telegramId: string]: TargetMeta;
}
