"use client";
import { useEffect, useMemo, useState } from "react";
import { Task, TaskStatus, Privacy } from "@/lib/types";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { formatDueHuman, isOverdue } from "@/lib/date";
import { exportCSV, exportICS, openPrintView } from "@/lib/exports";
import { Plus, Check, Calendar, Download, Printer } from "lucide-react";
type Filter="all"|"todo"|"doing"|"done";
export default function BuyerPage(){
 const [tasks,setTasks]=useState<Task[]>([]); const [filter,setFilter]=useState<Filter>("all");
 useEffect(()=>{ensureSeeded().then(load)},[]);
 async function load(){ const all=await db.getAll("tasks"); setTasks(all.sort((a,b)=>(a.dueDate||'').localeCompare(b.dueDate||'')));}
 async function addTask(){ const now=new Date(); const t:Task={id:crypto.randomUUID(),title:"New task",assignee:"Me",dueDate:new Date(now.getTime()+86400000).toISOString(),status:"todo",privacy:"shared",note:""}; await db.add("tasks",t); load();}
 async function updateTask(t:Task){ await db.put("tasks",t); load();}
 async function markDone(id:string){ const t=tasks.find(x=>x.id===id); if(!t) return; t.status="done"; await db.put("tasks",t); load();}
 function daysFromNow(iso?:string){ if(!iso) return 0; return Math.ceil((new Date(iso).getTime()-Date.now())/86400000); }
 const dueSoon=useMemo(()=>tasks.filter(t=>t.dueDate && !isOverdue(t) && t.status!=="done" && daysFromNow(t.dueDate)<=3).length,[tasks]);
 const overdue=useMemo(()=>tasks.filter(t=>isOverdue(t) && t.status!=="done").length,[tasks]);
 const progress=useMemo(()=>Math.round((tasks.filter(t=>t.status==="done").length/Math.max(1,tasks.length))*100),[tasks]);
 useEffect(()=>{function onKey(e:KeyboardEvent){if(e.key.toLowerCase()==="a") addTask()} window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey)},[]);
 const visible=tasks.filter(t=>filter==="all"?true:t.status===filter);
 return (<div className="grid gap-6">
  <div className="card p-4 flex items-center justify-between gap-4">
   <div className="flex items-center gap-4">
    <button className="btn btn-primary" onClick={addTask}><Plus size={16}/> Add task <span className="kbd">A</span></button>
    <div className="progress w-48" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress"><span style={{width:progress+"%"}}/></div>
    <div className="badge">{progress}% done</div><div className="badge">Due soon: {dueSoon}</div><div className="badge">Overdue: {overdue}</div>
   </div>
   <div className="flex items-center gap-2">
    <button className="btn" onClick={()=>exportCSV(tasks)}><Download size={16}/> CSV</button>
    <button className="btn" onClick={()=>exportICS(tasks)}><Calendar size={16}/> .ics</button>
    <button className="btn" onClick={()=>openPrintView(tasks)}><Printer size={16}/> PDF</button>
   </div>
  </div>
  <div className="card p-4">
   <fieldset className="flex items-center gap-2" aria-label="Filter tasks"><legend className="sr-only">Filter</legend>
    {(["all","todo","doing","done"] as Filter[]).map(f=>(<button key={f} className={`btn ${filter===f?"border-brand text-brand":""}`} onClick={()=>setFilter(f)}>{f}</button>))}
   </fieldset>
   <table className="table mt-4"><thead><tr><th>Title</th><th>Assignee</th><th>Due</th><th>Status</th><th>Privacy</th><th>Note</th><th></th></tr></thead>
   <tbody>{visible.map(t=>(<tr key={t.id} className={t.status==="done"?"opacity-60":""}>
     <td><input aria-label="Title" className="input" value={t.title} onChange={e=>updateTask({...t,title:e.target.value})}/></td>
     <td><input aria-label="Assignee" className="input" value={t.assignee||""} onChange={e=>updateTask({...t,assignee:e.target.value})}/></td>
     <td><input aria-label="Due date" className="input" type="date" value={t.dueDate?new Date(t.dueDate).toISOString().slice(0,10):""} onChange={e=>updateTask({...t,dueDate:e.target.value?new Date(e.target.value).toISOString():undefined})}/>
       <div className={`text-xs ${isOverdue(t)?"text-red-400":"text-slate-400"}`}>{formatDueHuman(t)}</div></td>
     <td><select aria-label="Status" className="input" value={t.status} onChange={e=>updateTask({...t,status:e.target.value as TaskStatus})}><option value="todo">todo</option><option value="doing">doing</option><option value="done">done</option></select></td>
     <td><select aria-label="Privacy" className="input" value={t.privacy} onChange={e=>updateTask({...t,privacy:e.target.value as Privacy})}><option value="private">private</option><option value="shared">shared</option></select></td>
     <td><input aria-label="Note" className="input" value={t.note||""} onChange={e=>updateTask({...t,note:e.target.value})}/></td>
     <td>{t.status!=="done" && <button className="btn" onClick={()=>markDone(t.id)}><Check size={16}/> Done</button>}</td>
   </tr>))}</tbody></table>
  </div></div>);
}
