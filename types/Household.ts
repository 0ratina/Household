export type Household = {
  id: string;
  Code: number;
  Name: string;
};

export type HouseholdCreate = Omit<Household, "id">;
