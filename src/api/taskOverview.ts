import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getTask(taskId:string) {
    const ref = doc(db,"tasks",taskId);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) return null;

    const data = snap.data();

    return {
        id: snap.id,
        title: data.title,
        desc: data.desc,
        repeatDay: data.repeatDay,
        value: data.value,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        householdId: data.HouseHoldID,
        isAchieved: data.isAchieved ?? false
    }
}

export async function toggleTaskAchieved(taskId: string, currentValue: boolean) {
    const ref = doc(db,"tasks",taskId)
    await updateDoc(ref,{isAchieved: !currentValue});
}