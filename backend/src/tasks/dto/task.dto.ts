export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export class CreateTaskDto {
  title: string;
  dueDate?: string;
  priority?: Priority;
}

export class UpdateTaskDto {
  title?: string;
  dueDate?: string;
  priority?: Priority;
  completed?: boolean;
}