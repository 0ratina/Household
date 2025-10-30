import {db} from "@/firebase";
import {collection, addDoc, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";

export interface Household {
  id: string;
  name: string;
  code:number;
}

export type CreateHousehold = Omit<Household, "id">;

const householdRef = collection(db, "households");

export async function getHouseholds(): Promise<Household[]> {
    const querySnapshot = await getDocs(householdRef);
    return querySnapshot.docs.map((d) => d.data()) as Household[];
}

export async function createHousehold(household: CreateHousehold): Promise<void>{
    const docRef = doc(householdRef);
    await setDoc(docRef, {
        id: householdRef.id,
        ...household 
    } satisfies Household);
}

export async function deleteHousehold(id:string): Promise<void>{
    await deleteDoc(doc(householdRef, id))
}