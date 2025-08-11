"use client";
import { useEffect, useState } from "react";
import { PropertyItem, Poll } from "@/lib/types";
import { db } from "@/lib/db"; import { ensureSeeded } from "@/lib/seed"; import { Lock, Plus } from "lucide-react";
export default function GroupPage(){
 const [properties,setProperties]=useState<PropertyItem[]>([]); const [polls,setPolls]=useState<Poll[]>([]);
 useEffect(()=>{ensureSeeded().then(load)},[]);
 async function load(){ setProperties(await db.getAll("shortlist")); setPolls((await db.getAll("polls")).sort((a,b)=>(a.deadlineISO||"").localeCompare(b.deadlineISO||"")));}
 async function addProperty(){ const it:PropertyItem={id:crypto.randomUUID(),title:"New property",notes:"",privacy:"shared"}; await db.add("shortlist",it); load();}
 async function updateProperty(p:PropertyItem){ await db.put("shortlist",p); load();}
 async function removeProperty(id:string){ await db.delete("shortlist",id); load();}
 async function addPoll(){ const p:Poll={id:crypto.randomUUID(),question:"Buy 123 Maple St?",options:[{id:crypto.randomUUID(),text:"Yes",votes:0},{id:crypto.randomUUID(),text:"No",votes:0}],quorumPct:60,deadlineISO:new Date(Date.now()+3*86400000).toISOString(),locked:false,voters:[],resultOptionId:undefined,visibleTo:"shared"}; await db.add("polls",p); load();}
 async function vote(poll:Poll, optionId:string, voter="Me"){ if(poll.locked) return; poll.voters=Array.from(new Set([...(poll.voters||[]),voter])); poll.options=poll.options.map(o=>o.id===optionId?{...o,votes:o.votes+1}:o); await db.put("polls",poll); load();}
 function totalVotes(p:Poll){ return p.options.reduce((a,b)=>a+b.votes,0); }
 function hasQuorum(p:Poll){ const participants=Math.max(1,(p.voters||[]).length); const achieved=(participants/participants)*100; return achieved>=p.quorumPct; }
 async function lockPoll(p:Poll){ if(p.locked) return; const total=totalVotes(p); const winner=p.options.reduce((m,o)=>o.votes>m.votes?o:m,p.options[0]); p.locked=true; p.resultOptionId= total>0 ? winner.id: undefined; await db.put("polls",p); load();}
 return (<div className="grid gap-6">
  <section className="card p-4">
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Shortlist</h2>
      <button className="btn btn-primary" onClick={addProperty}><Plus size={16}/> Add property</button></div>
    <table className="table mt-3"><thead><tr><th>Title</th><th>Notes</th><th>Privacy</th><th></th></tr></thead>
      <tbody>{properties.map(p=>(<tr key={p.id}>
        <td><input className="input" aria-label="Title" value={p.title} onChange={e=>updateProperty({...p,title:e.target.value})}/></td>
        <td><input className="input" aria-label="Notes" value={p.notes||""} onChange={e=>updateProperty({...p,notes:e.target.value})}/></td>
        <td><select className="input" aria-label="Privacy" value={p.privacy} onChange={e=>updateProperty({...p,privacy:e.target.value as any})}><option value="private">private</option><option value="shared">shared</option></select></td>
        <td><button className="btn" onClick={()=>removeProperty(p.id)}>Remove</button></td>
      </tr>))}</tbody></table>
  </section>
  <section className="card p-4">
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Polls & Decisions</h2>
      <button className="btn btn-primary" onClick={addPoll}><Plus size={16}/> New poll</button></div>
    <div className="grid md:grid-cols-2 gap-4 mt-4">{polls.map(p=>(<div className="card p-4" key={p.id}>
      <div className="flex items-center justify-between gap-2"><div>
        <div className="text-sm text-slate-300">Quorum: {p.quorumPct}% • Deadline: {new Date(p.deadlineISO).toLocaleDateString()}</div>
        <h3 className="font-medium">{p.question}</h3></div><div className="badge">{p.locked?"Locked":"Open"}</div></div>
      <div className="mt-3 grid gap-2">{p.options.map(o=>(<button key={o.id} disabled={p.locked} onClick={()=>vote(p,o.id)} className="btn justify-between">
        <span>{o.text}</span><span className="badge">{o.votes} votes</span></button>))}</div>
      <div className="mt-3 text-sm text-slate-300">Total votes: {totalVotes(p)} • {hasQuorum(p)?"Quorum met":"Quorum not met"}</div>
      <div className="mt-3 flex items-center gap-2"><button className="btn" disabled={p.locked} onClick={()=>lockPoll(p)}><Lock size={16}/> Lock decision</button>
        {p.locked && p.resultOptionId && (<div className="badge">Result: {p.options.find(o=>o.id===p.resultOptionId)?.text}</div>)}
      </div></div>))}</div>
  </section></div>);
}
