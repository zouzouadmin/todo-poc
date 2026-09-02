export interface Task {
  id: number;
  title: string;
  notes: string | null;
  due_date: string | null;
  has_reminder: number;
  completed: number;
  completed_at: string | null;
  created_at: string;
}

export interface NewTaskInput {
  title: string;
  notes?: string | null;
  dueDate?: string | null;
  hasReminder?: boolean;
}
