import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export async function verifyHouseholdCode(code: number) {
  const householdsRef = collection(db, "households");
  const q = query(householdsRef, where("Code", "==", code));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
    } 
  else {
    return querySnapshot.docs[0].data();
    }
}