export type Household = {
    id: number;
    Code: number;
    Name: string;
};

export type HouseholdCreate = Omit<Household, 'id'>