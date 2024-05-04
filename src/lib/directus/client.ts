import { authenticateAdmin, getAdmins, getStudents } from "./methods/index.js";
import { registerParent } from "./methods/register-parent.js";
import { Admin, Student } from "./types-gen.js";

class ApiClient {
  students: Student[] = [];

  admins: Admin[] = [];

  adminTelegramIds: Set<number> = new Set();

  constructor() {
    this.update();
  }

  async update() {
    this.students = await getStudents();
    this.admins = await getAdmins();

    // We typecast as Number because Directus list (csv) type only stores as strings
    this.adminTelegramIds = new Set(
      this.admins.flatMap((admin) => Number(admin.telegram_ids)).filter(Boolean)
    );
  }

  authenticateAdmin = authenticateAdmin;

  registerParent = registerParent;
}

const client = new ApiClient();

export { client };
