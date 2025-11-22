import { collection, getDocs, query, where, doc, updateDoc,setDoc} from "firebase/firestore";
import { db } from "../firebase";

export async function verifyHouseholdCode(code: number) {
  const householdsRef = collection(db, "households");
  const q = query(householdsRef, where("Code", "==", code));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
    } 
  else {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...(docSnap.data() as { Name: string; Code: number }) };
    }
}

export async function linkUserToHousehold(accountId: string, householdId: string) {
  const profileRef = doc(db, "profiles", accountId);
  await setDoc(profileRef, { HouseHoldID: householdId }, { merge: true });
}