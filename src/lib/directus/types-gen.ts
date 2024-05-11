import { Identity } from "@directus/sdk";
import { getStudents } from "./methods/get-students.js";
import { getParents } from "./methods/get-parents.js";

export type Student = Identity<Awaited<ReturnType<typeof getStudents>>[0]>;

export type Parent = Identity<Awaited<ReturnType<typeof getParents>>[0]>;
