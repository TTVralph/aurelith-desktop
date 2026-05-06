import { FormEvent, useState } from "react";
import { Space } from "../lib/types";

type Props = {
  spaces: Space[];
  onCreate: (name: string, description: string) => Promise<void>;
  onUpdate: (space: Space) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function SpacesPanel({ spaces, onCreate, onUpdate, onDelete }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreate(name, description);
    setName("");
    setDescription("");
  };

  return <article className="panel"><h2>Spaces</h2><form onSubmit={submit} className="stack-form"><input placeholder="Space name" value={name} onChange={(e)=>setName(e.target.value)} /><input placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} /><button type="submit">Add Space</button></form><div className="spaces-grid">{spaces.map((space)=><div className="space-card" key={space.id}><input value={space.name} onChange={(e)=>onUpdate({...space,name:e.target.value})}/><input value={space.description} onChange={(e)=>onUpdate({...space,description:e.target.value})}/><button onClick={()=>onDelete(space.id)}>Delete</button></div>)}</div></article>;
}
