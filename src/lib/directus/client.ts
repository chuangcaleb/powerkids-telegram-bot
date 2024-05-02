import { logger } from "~/logger.js";
import { getAdmins } from "./methods/get-admins.js";
import { getStudents } from "./methods/get-students.js";
import { Student } from "./types-gen.js";

class Directus {
  students: Student[] = [];

  adminIds: Set<number> = new Set();

  constructor() {
    this.update();
  }

  async update() {
    try {
      this.students = await getStudents();
      const admins = await getAdmins();
      // We typecast as Number because Directus list (csv) type only stores as strings
      this.adminIds = new Set(
        admins.flatMap((admin) => Number(admin.telegram_ids)).filter(Boolean)
      );
    } catch (error) {
      logger.error(error, "Directus client instance update error");
    }
  }

  // async addAdmin(directusUserId: string, telegramId: number) {}
}

const directus = new Directus();

export { directus };
