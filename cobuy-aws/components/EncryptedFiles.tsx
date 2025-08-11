"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { encryptBytes, decryptBytes } from "@/lib/crypto";
type EncFile={id:string;name:string;size:number;type:string;ivBase64:string;cipherBase64:string;sharedTo?:("Owner"|"Member"|"Attorney")[]};
export function EncryptedFiles(){
 const [files,setFiles]=useState<EncFile[]>([]); const [shareToAttorney,setShareToAttorney]=useState(false);
 useEffect(()=>{(async()=>setFiles(await db.getAll("files")))()},[]);
 async function handleUpload(e:React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(!f) return; const buf=await f.arrayBuffer(); const {iv,cipher}=await encryptBytes(new Uint8Array(buf)); const enc:EncFile={id:crypto.randomUUID(),name:f.name,size:f.size,type:f.type,ivBase64:btoa(String.fromCharCode(...iv)),cipherBase64:btoa(String.fromCharCode(...cipher)),sharedTo:shareToAttorney?["Owner","Attorney"]:["Owner"]}; await db.add("files",enc); setFiles(await db.getAll("files")); (e.target as HTMLInputElement).value=""; }
 async function download(id:string){ const f=files.find(x=>x.id===id); if(!f) return; const iv=new Uint8Array(atob(f.ivBase64).split("").map(c=>c.charCodeAt(0))); const cipher=new Uint8Array(atob(f.cipherBase64).split("").map(c=>c.charCodeAt(0))); const plain=await decryptBytes(iv,cipher); const blob=new Blob([plain],{type:f.type||"application/octet-stream"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=f.name; a.click(); URL.revokeObjectURL(url); }
 async function remove(id:string){ await db.delete("files",id); setFiles(await db.getAll("files")); }
 return (<section className="card p-4">
  <h2 className="text-lg font-semibold">Legal files (client-side encrypted)</h2>
  <div className="mt-3 flex items-center gap-3">
    <label className="btn"><input id="file" type="file" className="sr-only" onChange={handleUpload}/><span>Upload file</span></label>
    <label className="flex items-center gap-2"><input type="checkbox" className="accent-brand" checked={shareToAttorney} onChange={e=>setShareToAttorney(e.target.checked)}/><span>Share with attorney</span></label>
  </div>
  <table className="table mt-4"><thead><tr><th>Name</th><th>Size</th><th>Shared to</th><th></th></tr></thead>
   <tbody>{files.map(f=>(<tr key={f.id}><td className="truncate">{f.name}</td><td>{(f.size/1024).toFixed(1)} KB</td><td>{(f.sharedTo||["Owner"]).join(", ")}</td>
    <td className="flex gap-2"><button className="btn" onClick={()=>download(f.id)}>Download</button><button className="btn" onClick={()=>remove(f.id)}>Remove</button></td></tr>))}</tbody></table>
  <p className="text-xs text-slate-400 mt-2">Demo keys are stored in localStorage. A paid tier would use Cognito + KMS per-user keys.</p>
 </section>);
}
