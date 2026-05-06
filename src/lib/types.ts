export type Space = { id: number; name: string; description: string };
export type Task = { id: number; space_id: number; title: string; status: string; assignee: string };
export type CommandHistoryItem = { id: number; command: string; result: string; created_at: string };
export type FileItem = { name: string; updated: string; space: string };
