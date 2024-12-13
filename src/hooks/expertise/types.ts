export type ExpertiseArea = {
  title: string;
  description: string;
};

export type ExpertiseState = {
  expertiseAreas: ExpertiseArea[];
  isLoading: boolean;
};