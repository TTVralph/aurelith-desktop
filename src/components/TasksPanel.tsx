import { FormEvent, useState } from "react";
import { Space, Task } from "../lib/types";

type Props = {
  tasks: Task[];
  spaces: Space[];
  onCreate: (task: Omit<Task, "id">) => Promise<void>;
  onUpdate: (task: Task) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function TasksPanel({ tasks, spaces, onCreate, onUpdate, onDelete }: Props) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Today");
  const [assignee, setAssignee] = useState("You");
  const [spaceId, setSpaceId] = useState<number | "">(spaces[0]?.id ?? "");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !spaceId) return;
    await onCreate({ title, status, assignee, space_id: Number(spaceId) });
    setTitle("");
  };

  return <article className="panel"><h2>Tasks</h2><form className="stack-form" onSubmit={submit}><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Task title"/><select value={spaceId} onChange={(e)=>setSpaceId(Number(e.target.value))}>{spaces.map((s)=><option key={s.id} value={s.id}>{s.name}</option>)}</select><input value={assignee} onChange={(e)=>setAssignee(e.target.value)} placeholder="Assignee"/><input value={status} onChange={(e)=>setStatus(e.target.value)} placeholder="Status"/><button type="submit">Add Task</button></form><ul className="stack-list">{tasks.map((task)=><li key={task.id}><input value={task.title} onChange={(e)=>onUpdate({...task,title:e.target.value})}/><span>{spaces.find((s)=>s.id===task.space_id)?.name ?? "Unknown"}</span><input value={task.assignee} onChange={(e)=>onUpdate({...task,assignee:e.target.value})}/><input value={task.status} onChange={(e)=>onUpdate({...task,status:e.target.value})}/><button onClick={()=>onDelete(task.id)}>Delete</button></li>)}</ul></article>;
}
