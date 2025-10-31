export interface Task {
    id?: string;
    title: string;
    desc?: string;
    repeatDay: number;
    value: number;
    createdAt?: Date;
    householdId: string;
    isAchieved: boolean;
}
