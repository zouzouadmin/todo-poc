import type { SQLiteDatabase } from "expo-sqlite";
import type { NewTaskInput, Task } from "./types";

export async function getOpenTasks(db: SQLiteDatabase): Promise<Task[]> {
  return db.getAllAsync<Task>(
    `SELECT * FROM tasks
     WHERE completed = 0
     ORDER BY (due_date IS NULL), due_date ASC, created_at ASC`,
  );
}

export async function getCompletedTasks(db: SQLiteDatabase): Promise<Task[]> {
  return db.getAllAsync<Task>(
    `SELECT * FROM tasks
     WHERE completed = 1
     ORDER BY completed_at DESC`,
  );
}

export async function addTask(
  db: SQLiteDatabase,
  input: NewTaskInput,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO tasks (title, notes, due_date, has_reminder) VALUES (?, ?, ?, ?)`,
    input.title.trim(),
    input.notes?.trim() || null,
    input.dueDate || null,
    input.hasReminder ? 1 : 0,
  );
}

export async function setTaskCompleted(
  db: SQLiteDatabase,
  id: number,
  completed: boolean,
): Promise<void> {
  await db.runAsync(
    `UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?`,
    completed ? 1 : 0,
    completed ? new Date().toISOString() : null,
    id,
  );
}

export async function deleteTask(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(`DELETE FROM tasks WHERE id = ?`, id);
}
