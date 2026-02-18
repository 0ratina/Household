export type Profile = {
  id: number;
  HouseHoldID: string;
  Name: string;
  isOwner: boolean;
  AvatarID: string;
  AccountId: string;
};

export type ProfileCreate = Omit<Profile, "id">;
