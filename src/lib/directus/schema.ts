interface SchemaStudent {
  name: string;
  ic: string;
  telegram_ids: string[] | null;
}

interface SchemaParent {
  name: string;
  ic: string;
  mobile: string;
  gender: "male" | "female";
  father_to: string[];
  mother_to: string[];
  telegram_id: string | null;
}

export interface Schema {
  student: SchemaStudent[];
  parent: SchemaParent[];
  directus_users: { telegram_ids: string[] | null };
}
