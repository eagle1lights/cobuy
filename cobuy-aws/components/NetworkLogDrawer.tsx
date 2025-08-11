"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
type Log={ts:number,method:string,url:string};
export function NetworkLogDrawer(){
 const [open,setOpen]=useState(false); const [logs,setLogs]=useState<Log[]>([]);
 useEffect(()=>{(async()=>{const s=await db.getAll("networkLogs"); setLogs(s.sort((a,b)=>a.ts-b.ts));})();
 (window as any).__patchApplied||patch(); (window as any).__patchApplied=true;},[]);
 function patch(){const of=window.fetch; window.fetch=async (i:any,init?:RequestInit)=>{const m=(init?.method||"GET").toUpperCase(); const u=typeof i==="string"?i:i.url; await db.add("networkLogs",{ts:Date.now(),method:m,url:u}); return of(i,init);};
 const oo=XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open=function(method:string,url:string,...r:any[]){db.add("networkLogs",{ts:Date.now(),method:(method||"GET").toUpperCase(),url}); // @ts-ignore
 return oo.call(this,method,url,...r)};}
 return(<div><button className="btn" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="netlog">Network Log</button>
 {open&&(<div id="netlog" className="absolute right-4 mt-2 w-[28rem] max-h-[60vh] overflow-auto card p-3">
 <h3 className="font-medium">Network Log</h3><p className="text-xs text-slate-400">Proves no POSTs in free mode.</p>
 <table className="table mt-2"><thead><tr><th>Time</th><th>Method</th><th>URL</th></tr></thead>
 <tbody>{logs.map((l,i)=>(<tr key={i}><td className="text-xs">{new Date(l.ts).toLocaleTimeString()}</td><td>{l.method}</td><td className="truncate">{l.url}</td></tr>))}</tbody></table></div>)}</div>);
}
