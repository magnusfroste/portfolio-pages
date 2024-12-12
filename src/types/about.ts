export type Feature = {
  title: string;
  description: string;
  icon: string;
};

export type AboutData = {
  id: number;
  title: string;
  main_description: string[];
  features: Feature[];
  user_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};