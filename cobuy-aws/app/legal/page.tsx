"use client";
import { useEffect, useState } from "react";
import { ensureSeeded } from "@/lib/seed";
import { EncryptedFiles } from "@/components/EncryptedFiles";
type Structure="LLC"|"TIC";
export default function LegalPage(){
 const [structure,setStructure]=useState<Structure>("LLC");
 const [checklist,setChecklist]=useState<Record<string,boolean>>({"Operating agreement draft":false,"Capital contributions noted":false,"Ownership percentages agreed":false,"Manager appointed":false});
 useEffect(()=>{ensureSeeded()},[]);
 return (<div className="grid gap-6">
  <section className="card p-4">
    <h2 className="text-lg font-semibold">Legal wizard (no legal advice)</h2>
    <div className="mt-3 flex gap-2">
      <label className="btn"><input className="mr-2" type="radio" name="structure" checked={structure==="LLC"} onChange={()=>setStructure("LLC")}/> LLC</label>
      <label className="btn"><input className="mr-2" type="radio" name="structure" checked={structure==="TIC"} onChange={()=>setStructure("TIC")}/> TIC</label>
    </div>
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      <div className="card p-4"><h3 className="font-medium">Pros</h3><ul className="list-disc pl-5 text-sm text-slate-300 mt-2">{structure==="LLC"?(<><li>Liability protection</li><li>Flexible operating agreement</li><li>Pass-through taxation</li></>):(<><li>Simpler co-ownership</li><li>Individual financing possible</li><li>Flexible exit options</li></>)}</ul></div>
      <div className="card p-4"><h3 className="font-medium">Cons</h3><ul className="list-disc pl-5 text-sm text-slate-300 mt-2">{structure==="LLC"?(<><li>Formation/annual costs</li><li>Needs clear agreement</li></>):(<><li>No liability shield</li><li>Needs strong co-ownership agreement</li></>)}</ul></div>
    </div>
    <div className="card p-4 mt-4"><h3 className="font-medium">Checklist</h3>
      <ul className="grid gap-2 mt-2 text-sm">{Object.keys(checklist).map(k=>(<li key={k} className="flex items-center gap-2"><input type="checkbox" className="accent-brand" checked={checklist[k]} onChange={e=>setChecklist({...checklist,[k]:e.target.checked})}/><span>{k}</span></li>))}</ul>
      <p className="text-xs text-slate-400 mt-2">Educational demo.</p>
    </div>
  </section>
  <EncryptedFiles/>
 </div>);
}
