import { logger } from "~/logger.js";
import { getAdmins } from "./methods/get-admins.js";
import { getStudents } from "./methods/get-students.js";
import { Admin, Student } from "./types-gen.js";

class Directus {
  students: Student[] = [];

  admins: Admin[] = [];

  constructor() {
    this.update();
  }

  async update() {
    try {
      this.students = await getStudents();
      this.admins = await getAdmins();
    } catch (error) {
      logger.error(error, "Directus client instance update error");
    }
  }
}

const directus = new Directus();

export { directus };
