import { Task } from "../../types/Task";

function toDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function linkTaskToCategory(tasks: Task[]) {
  const today = toDateOnly(new Date());

  const late: (Task & { daysLate: number })[] = [];
  const todayTasks: Task[] = [];
  const doneToday: Task[] = [];

  for (const task of tasks) {
    const createdAt = toDateOnly(task.createdAt!);
    const lastCompletedAt = task.lastCompletedAt
      ? toDateOnly(task.lastCompletedAt)
      : null;

    const isFirstTimeTask = !task.lastCompletedAt;

    const baseDate = lastCompletedAt ?? createdAt;
    const dueDate = toDateOnly(
      new Date(baseDate.getTime() + task.repeatDay * 86400000)
    );

    if (task.isAchieved && lastCompletedAt && isSameDay(lastCompletedAt, today)) {
      doneToday.push(task);
      continue;
    }

    if (!task.isAchieved && dueDate < today) {
      const daysLate = Math.floor(
        (today.getTime() - dueDate.getTime()) / 86400000
      );

      late.push({
        ...task,
        daysLate,
      });
      continue;
    }

    if (
      !task.isAchieved &&
      (
        (isFirstTimeTask && isSameDay(createdAt, today)) ||
        isSameDay(dueDate, today)
      )
    ) {
      todayTasks.push(task);
    }
  }

  return {
    late,
    today: todayTasks,
    doneToday,
  };
}