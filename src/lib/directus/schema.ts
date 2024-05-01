export interface Student {
  name: string;
  ic: string;
  telegram_ids: string[];
}

export interface Schema {
  students: Student[];
  directus_users: { telegram_ids: string[] };
}
