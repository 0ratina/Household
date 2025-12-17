import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Household } from "../../types/Household";

export async function getHousehold(householdId: string): Promise<Household | null> {
  const snap = await getDoc(doc(db, "households", householdId));
  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    Name: data.Name,
    Code: data.Code,
  };
}