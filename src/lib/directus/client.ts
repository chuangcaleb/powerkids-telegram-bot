import { logger } from "#root/logger.js";
import { getAdmins } from "./methods/get-admins.js";
import { Admin } from "./types-gen.js";

class ApiClient {
  admins: Admin[] = [];

  adminTelegramIds: Set<number> = new Set();

  constructor() {
    this.updateAdmins();
  }

  async updateAdmins() {
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
      logger.error(error, "ApiClient.updateAdmins()");
    }
  }
}

const client = new ApiClient();

export { client };
