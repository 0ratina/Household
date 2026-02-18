import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Task, TaskCompletion } from "../../types/Task";
import { db } from "../firebase";

export async function getTask(taskId: string, selectedDate: Date) {
  const ref = doc(db, "tasks", taskId);
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
    completions: (data.completions ?? []).map((c: any) => ({
      profileId: c.profileId,
      timestamp: c.timestamp?.toDate?.() ?? new Date(c.timestamp),
    })),
    lastCompletedAt:
      (data.completions ?? []).length > 0
        ? new Date(
            Math.max(
              ...(data.completions ?? []).map(
                (c: any) =>
                  c.timestamp?.toDate?.()?.getTime() ??
                  new Date(c.timestamp).getTime(),
              ),
            ),
          )
        : null,
    completedTodayBy: (data.completions ?? [])
      .filter((c: any) => {
        const ts = c.timestamp?.toDate?.() ?? new Date(c.timestamp);
        const today = selectedDate;
        return (
          ts.getFullYear() === today.getFullYear() &&
          ts.getMonth() === today.getMonth() &&
          ts.getDate() === today.getDate()
        );
      })
      .map((c: any) => c.profileId),
    daysSinceLastCompletion: (() => {
      if (!(data.completions ?? []).length) return null;

      const lastCompletionTime = Math.max(
        ...(data.completions ?? []).map(
          (c: any) =>
            c.timestamp?.toDate?.()?.getTime() ??
            new Date(c.timestamp).getTime(),
        ),
      );

      const lastCompletionDate = new Date(lastCompletionTime);
      const lastDate = new Date(
        lastCompletionDate.getFullYear(),
        lastCompletionDate.getMonth(),
        lastCompletionDate.getDate(),
      );
      const currentDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      const daysDiff = Math.floor(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      return daysDiff >= 0 ? daysDiff : null;
    })(),

    isOverdue: (() => {
      if (!(data.completions ?? []).length) return false;

      const lastCompletionTime = Math.max(
        ...(data.completions ?? []).map(
          (c: any) =>
            c.timestamp?.toDate?.()?.getTime() ??
            new Date(c.timestamp).getTime(),
        ),
      );

      const diffDays = Math.floor(
        (selectedDate.getTime() - lastCompletionTime) / (1000 * 60 * 60 * 24),
      );

      return diffDays >= data.repeatDay;
    })(),
  };
}
export async function addTaskCompletion(
  taskId: string,
  profileId: string,
): Promise<void> {
  const ref = doc(db, "tasks", taskId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  const oldCompletions: TaskCompletion[] = data.completions ?? [];

  const newCompletion: TaskCompletion = {
    profileId,
    timestamp: new Date(),
  };

  await updateDoc(ref, {
    completions: [...oldCompletions, newCompletion],
  });
}

export async function getTasksForHousehold(
  householdId: string,
  selectedDate: Date,
): Promise<Task[]> {
  if (!householdId) return [];
  const q = query(
    collection(db, "tasks"),
    where("HouseHoldID", "==", householdId),
  );
  const snap = await getDocs(q);
  console.log("hämtar tasks för householdId", householdId, snap.docs.length);

  return snap.docs.map((d) => {
    const data = d.data();

    return {
      id: d.id,
      title: data.title,
      desc: data.desc,
      repeatDay: data.repeatDay,
      value: data.value,
      householdId: data.HouseHoldID,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      completions: (data.completions ?? []).map((c: any) => ({
        profileId: c.profileId,
        timestamp: c.timestamp?.toDate?.() ?? new Date(c.timestamp),
      })),
      lastCompletedAt:
        (data.completions ?? []).length > 0
          ? new Date(
              Math.max(
                ...(data.completions ?? []).map(
                  (c: any) =>
                    c.timestamp?.toDate?.()?.getTime() ??
                    new Date(c.timestamp).getTime(),
                ),
              ),
            )
          : null,
      completedTodayBy: (data.completions ?? [])
        .filter((c: any) => {
          const ts = c.timestamp?.toDate?.() ?? new Date(c.timestamp);
          const today = selectedDate;
          return (
            ts.getFullYear() === today.getFullYear() &&
            ts.getMonth() === today.getMonth() &&
            ts.getDate() === today.getDate()
          );
        })
        .map((c: any) => c.profileId),
      daysSinceLastCompletion: (() => {
        if (!(data.completions ?? []).length) return null;

        const lastCompletionTime = Math.max(
          ...(data.completions ?? []).map(
            (c: any) =>
              c.timestamp?.toDate?.()?.getTime() ??
              new Date(c.timestamp).getTime(),
          ),
        );

        const lastCompletionDate = new Date(lastCompletionTime);
        const diffDays =
          Math.floor(
            (selectedDate.getTime() - lastCompletionDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ) + (lastCompletionDate.getHours() > selectedDate.getHours() ? 0 : 0);

        const lastDate = new Date(
          lastCompletionDate.getFullYear(),
          lastCompletionDate.getMonth(),
          lastCompletionDate.getDate(),
        );
        const currentDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );
        const daysDiff = Math.floor(
          (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        return daysDiff >= 0 ? daysDiff : null;
      })(),

      isOverdue: (() => {
        if (!(data.completions ?? []).length) return false;

        const lastCompletionTime = Math.max(
          ...(data.completions ?? []).map(
            (c: any) =>
              c.timestamp?.toDate?.()?.getTime() ??
              new Date(c.timestamp).getTime(),
          ),
        );

        const diffDays = Math.floor(
          (selectedDate.getTime() - lastCompletionTime) / (1000 * 60 * 60 * 24),
        );

        return diffDays >= data.repeatDay;
      })(),
    } satisfies Task;
  });
}
