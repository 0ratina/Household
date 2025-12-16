import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
  const profileSnap = await getDoc(profileRef);
  console.log("accountId", accountId)
  console.log("householdid", householdId)

  if (!profileSnap.exists()) {
    await setDoc(profileRef, {
      AccountId: accountId,
      HouseHoldID: [householdId],
      Name: "",
      AvatarID: "🐸",
      isOwner: false,
    });
    return;
  }

  let households: string[] = [];
  if (profileSnap.exists()) {
    const profileData = profileSnap.data();

    if (Array.isArray(profileData?.HouseHoldID)) {
      households = (profileData.HouseHoldID);
    }
    else if (profileData?.HouseHoldID) {
      households = [profileData.HouseHoldID];
    }
  }

  if (!households.includes(householdId)) {
    households.push(householdId);
  }
  
  console.log("householdId sparas =", householdId)

  await setDoc(profileRef, { HouseHoldID: households }, { merge: true });
}

export async function isUserInHousehold(accountId: string, householdId: string) {
    const profileRef = doc(db, "profiles", accountId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) return false;

    const profileData = profileSnap.data();
    const households: string[] = Array.isArray(profileData?.HouseHoldID)
    ? profileData.HouseHoldID
    : profileData?.HouseHoldID
    ? [profileData.HouseHoldID]
    : [];

    return households.includes(householdId);
}