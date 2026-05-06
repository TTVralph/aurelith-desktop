import { FormEvent, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SpacesPanel } from "./components/SpacesPanel";
import { TasksPanel } from "./components/TasksPanel";
import { CommandHistoryItem, FileItem, Space, Task } from "./lib/types";

const recentFiles: FileItem[] = [
  { name: "CS Thesis Outline.md", updated: "8 min ago", space: "School" },
  { name: "Frontend Resume v4.pdf", updated: "32 min ago", space: "Job Applications" },
  { name: "Aurelith UX Notes.fig", updated: "1h ago", space: "Projects" },
  { name: "Budget Q2 2026.xlsx", updated: "2h ago", space: "Finance" }
];

function App() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [input, setInput] = useState("Plan my day across school and job applications");
  const [result, setResult] = useState("Awaiting command...");

  const loadAll = async () => {
    const [loadedSpaces, loadedTasks, loadedHistory] = await Promise.all([
      invoke<Space[]>("list_spaces"),
      invoke<Task[]>("list_tasks"),
      invoke<CommandHistoryItem[]>("list_command_history")
    ]);
    setSpaces(loadedSpaces);
    setTasks(loadedTasks);
    setHistory(loadedHistory);
  };

  useEffect(() => { void loadAll(); }, []);

  const runCommand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    const response = await invoke<string>("run_command", { command: input.trim() });
    setResult(response);
    await loadAll();
  };

  const missionStats = useMemo(() => [
    { label: "Focus Score", value: "86%" },
    { label: "Open Spaces", value: String(spaces.length) },
    { label: "Tasks", value: String(tasks.length) },
    { label: "History", value: String(history.length) }
  ], [spaces.length, tasks.length, history.length]);

  return <main className="app-shell">{/* ... */}
    <section className="panel command-panel"><form onSubmit={runCommand} className="command-form"><input value={input} onChange={(e)=>setInput(e.target.value)} /><button type="submit">Run</button></form><p className="command-result"><span>Result:</span> {result}</p></section>
    <section className="grid two-col"><SpacesPanel spaces={spaces} onCreate={async (name, description)=>{await invoke("create_space", { name, description }); await loadAll();}} onUpdate={async (space)=>{await invoke("update_space", space); await loadAll();}} onDelete={async (id)=>{await invoke("delete_space", { id }); await loadAll();}} /><article className="panel"><h2>Mission Control</h2><div className="stats-grid">{missionStats.map((stat)=><div className="stat-card" key={stat.label}><p>{stat.label}</p><strong>{stat.value}</strong></div>)}</div></article></section>
    <section className="grid three-col"><article className="panel"><h2>Recent Files (Mock)</h2><ul className="stack-list">{recentFiles.map((file)=><li key={file.name}><p>{file.name}</p><span>{file.space} · {file.updated}</span></li>)}</ul></article><TasksPanel spaces={spaces} tasks={tasks} onCreate={async (task)=>{await invoke("create_task", task); await loadAll();}} onUpdate={async (task)=>{await invoke("update_task", task); await loadAll();}} onDelete={async (id)=>{await invoke("delete_task", { id }); await loadAll();}} /><article className="panel"><h2>Command History</h2><ul className="stack-list">{history.map((h)=><li key={h.id}><p>{h.command}</p><span>{h.created_at}</span></li>)}</ul></article></section>
  </main>;
}

export default App;
