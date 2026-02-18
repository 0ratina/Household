export interface TaskCompletion {
  profileId: string;
  timestamp: Date;
}
export interface Task {
  id?: string;
  title: string;
  desc?: string;
  repeatDay: number;
  value: number;
  createdAt?: Date;
  householdId: string;
  completions?: TaskCompletion[];
  archived?: boolean;
  lastCompletedAt?: Date | null;
  completedTodayBy?: string[];
  daysSinceLastCompletion?: number | null;
  isOverdue?: boolean;
}
