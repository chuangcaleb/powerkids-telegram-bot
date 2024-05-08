import { logger } from "#root/logger.js";
import { getParents } from "./methods/get-parents.js";
import { authenticateAdmin, getAdmins, getStudents } from "./methods/index.js";
import { registerParent } from "./methods/register-parent.js";
import { Admin } from "./types-gen.js";

class ApiClient {
  admins: Admin[] = [];

  adminTelegramIds: Set<number> = new Set();

  constructor() {
    this.update();
  }

  async update() {
    try {
      this.admins = await getAdmins();

      // We typecast as Number because Directus list (csv) type only stores as strings
      this.adminTelegramIds = new Set(
        this.admins
          .flatMap((admin) => Number(admin.telegram_ids))
          .filter(Boolean)
      );
    } catch (error) {
      // on error, reset to empty list to prevent operations
      this.admins = [];
      logger.error(error, "ApiClient.update()");
    }
  }

  getStudents = getStudents;

  getParents = getParents;

  authenticateAdmin = authenticateAdmin;

  registerParent = registerParent;
}

const client = new ApiClient();

export { client };
