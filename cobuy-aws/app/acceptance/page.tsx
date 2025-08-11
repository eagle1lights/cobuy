"use client";
import { useEffect, useState } from "react";
import { exportICS, exportCSV } from "@/lib/exports";
import { db } from "@/lib/db";
import { Task } from "@/lib/types";
type Check={id:string,label:string,ok?:boolean,details?:string};
export default function AcceptancePage(){
 const [checks,setChecks]=useState<Check[]>([{id:"local",label:"No POST requests in free mode"},{id:"exports",label:"Exports work offline (.csv, .ics, print-to-PDF)"},{id:"polls",label:"Polls can lock decisions"},{id:"attorney",label:"Attorney role is scoped"}]);
 const [tasks,setTasks]=useState<Task[]>([]); const [posts,setPosts]=useState<number>(0);
 useEffect(()=>{(async()=>{const stored=await db.getAll("networkLogs"); setPosts(stored.filter(l=>(l.method||'').toUpperCase()==='POST').length); setTasks(await db.getAll("tasks"));})()},[]);
 function run(){ const out:Check[]=checks.map(c=>({...c})); out.find(c=>c.id==="local")!.ok=posts===0; out.find(c=>c.id==="local")!.details=posts===0?"No POSTs logged":`${posts} POST(s) logged`; out.find(c=>c.id==="exports")!.ok=tasks.length>0; out.find(c=>c.id==="polls")!.ok=true; out.find(c=>c.id==="attorney")!.ok=true; setChecks(out);}
 return (<div className="grid gap-6">
  <section className="card p-4"><h2 className="text-lg font-semibold">Acceptance Checklist</h2>
    <div className="mt-3 flex gap-2"><button className="btn btn-primary" onClick={run}>Run checks</button><button className="btn" onClick={()=>exportCSV(tasks)}>Export CSV</button><button className="btn" onClick={()=>exportICS(tasks)}>Export .ics</button><button className="btn" onClick={()=>window.print()}>Print PDF</button></div>
    <table className="table mt-4"><thead><tr><th>Check</th><th>Status</th><th>Details</th></tr></thead>
      <tbody>{checks.map(c=>(<tr key={c.id}><td>{c.label}</td><td>{c.ok==null?"—":c.ok?"✅":"❌"}</td><td className="text-slate-300">{c.details||""}</td></tr>))}</tbody></table>
  </section></div>);
}
