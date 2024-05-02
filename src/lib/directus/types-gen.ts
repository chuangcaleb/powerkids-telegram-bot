import { Identity } from "@directus/sdk";
import { getStudents } from "./methods/get-students.js";
import { getAdmins } from "./methods/get-admins.js";

export type Student = Identity<Awaited<ReturnType<typeof getStudents>>[0]>;

export type Admin = Identity<Awaited<ReturnType<typeof getAdmins>>[0]>;
