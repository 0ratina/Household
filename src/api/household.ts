import { doc, getDoc } from "firebase/firestore";
import { Household } from "../../types/Household";
import { db } from "../firebase";

export async function getHousehold(
  householdId: string,
): Promise<Household | null> {
  const snap = await getDoc(doc(db, "households", householdId));
  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    Name: data.Name,
    Code: data.Code,
  };
}
