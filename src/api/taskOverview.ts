import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Task } from "../../types/Task";
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
        isAchieved: data.isAchieved ?? false,
        completedBy: data.completedBy,
        lastCompletedAt: data.lastCompletedAt?.toDate?.(),
    }
}

export async function toggleTaskAchieved(taskId: string,completedBy: string) {
    const ref = doc(db,"tasks",taskId)
    await updateDoc(ref,{
        isAchieved: true,
        lastCompletedAt: new Date(),
        completedBy: completedBy,
      });

}

export async function getTasksForHousehold(householdId: string): Promise<Task[]> {
  if (!householdId) return [];
  const q = query(
    collection(db, "tasks"),
    where("HouseHoldID", "==", householdId)
  );
  const snap = await getDocs(q);
  console.log("hämtar tasks för householdId", householdId,snap.docs.length);

  return snap.docs.map((d) => {
  const data = d.data();

  return {
    id: d.id,
    title: data.title,
    desc: data.desc,
    repeatDay: data.repeatDay,
    value: data.value,
    householdId: data.HouseHoldID,
    isAchieved: data.isAchieved ?? false,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    lastCompletedAt: data.lastCompletedAt?.toDate?.(),
    completedBy: data.completedBy,
  } satisfies Task;
});
}