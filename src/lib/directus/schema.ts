interface SchemaStudent {
  name: string;
  ic: string;
  telegram_ids: string[] | null;
}

export interface Schema {
  student: SchemaStudent[];
  directus_users: { telegram_ids: string[] | null };
}
