import { FormEvent, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type FileItem = { name: string; updated: string; space: string };
type TaskItem = { title: string; status: "Today" | "Soon" | "Waiting"; assignee: string };

const spaces = ["School", "Job Applications", "Projects", "Finance", "Personal"];

const recentFiles: FileItem[] = [
  { name: "CS Thesis Outline.md", updated: "8 min ago", space: "School" },
  { name: "Frontend Resume v4.pdf", updated: "32 min ago", space: "Job Applications" },
  { name: "Aurelith UX Notes.fig", updated: "1h ago", space: "Projects" },
  { name: "Budget Q2 2026.xlsx", updated: "2h ago", space: "Finance" }
];

const tasks: TaskItem[] = [
  { title: "Submit internship application", status: "Today", assignee: "You" },
  { title: "Refactor command parser mock", status: "Soon", assignee: "Aurelith" },
  { title: "Categorize receipts", status: "Waiting", assignee: "You" }
];

const suggestedActions = [
  "Summarize everything due this week",
  "Open Project space and pull recent commits",
  "Generate a focused evening plan",
  "Review unresolved finance tasks"
];

function App() {
  const [input, setInput] = useState("Plan my day across school and job applications");
  const [result, setResult] = useState("Awaiting command...");
  const [busy, setBusy] = useState(false);

  const missionStats = useMemo(
    () => [
      { label: "Focus Score", value: "86%" },
      { label: "Open Contexts", value: "5" },
      { label: "Tasks Due", value: "7" },
      { label: "Automation Ready", value: "3" }
    ],
    []
  );

  const runCommand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    setBusy(true);
    try {
      const response = await invoke<string>("run_command", { command: input.trim() });
      setResult(response);
    } catch (error) {
      setResult(`Command failed: ${String(error)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Aurelith Desktop v0.1</p>
          <h1>AI-first command center for your computer</h1>
          <p className="subcopy">Launch intent, orchestrate spaces, and steer your digital life from one mission dashboard.</p>
        </div>
      </header>

      <section className="panel command-panel">
        <form onSubmit={runCommand} className="command-form">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a command for Aurelith..." />
          <button type="submit" disabled={busy}>{busy ? "Running..." : "Run"}</button>
        </form>
        <p className="command-result"><span>Result:</span> {result}</p>
      </section>

      <section className="grid two-col">
        <article className="panel">
          <h2>Spaces</h2>
          <div className="spaces-grid">
            {spaces.map((space) => (
              <div className="space-card" key={space}>
                <h3>{space}</h3>
                <p>Workspace context ready.</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Mission Control</h2>
          <div className="stats-grid">
            {missionStats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid three-col">
        <article className="panel">
          <h2>Recent Files</h2>
          <ul className="stack-list">
            {recentFiles.map((file) => (
              <li key={file.name}>
                <p>{file.name}</p>
                <span>{file.space} · {file.updated}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Tasks</h2>
          <ul className="stack-list">
            {tasks.map((task) => (
              <li key={task.title}>
                <p>{task.title}</p>
                <span>{task.assignee} · {task.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Suggested Actions</h2>
          <ul className="stack-list">
            {suggestedActions.map((action) => (
              <li key={action}>
                <p>{action}</p>
                <span>Use command bar to execute</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
