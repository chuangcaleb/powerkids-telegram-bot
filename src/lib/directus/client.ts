import { logger } from "~/logger.js";
import { getAdmins } from "./methods/get-admins.js";
import { getStudents } from "./methods/get-students.js";
import { authenticateAdmin } from "./methods/authenticate-admin.js";
import { Admin, Student } from "./types-gen.js";

class Directus {
  students: Student[] = [];

  admins: Admin[] = [];

  adminTelegramIds: Set<number> = new Set();

  constructor() {
    this.update();
  }

  async update() {
    try {
      this.students = await getStudents();
      this.admins = await getAdmins();

      // We typecast as Number because Directus list (csv) type only stores as strings
      this.adminTelegramIds = new Set(
        this.admins
          .flatMap((admin) => Number(admin.telegram_ids))
          .filter(Boolean)
      );
    } catch (error) {
      logger.error(error, "Directus client instance update error");
    }
  }

  authenticateAdmin = authenticateAdmin;
}

const directus = new Directus();

export { directus };
