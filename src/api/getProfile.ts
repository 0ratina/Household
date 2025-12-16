import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const auth = getAuth();

export async function getMyProfile(householdId: string) {
  const q = query(
    collection(db, "profiles"),
    where("HouseHoldID", "==", householdId),
    where("AccountId", "==", auth.currentUser?.uid)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const data = snap.docs[0].data();

  return {
    id: snap.docs[0].id,
    name: data.Name,
    avatarId: data.AvatarID,
    isOwner: data.isOwner,
  };
}