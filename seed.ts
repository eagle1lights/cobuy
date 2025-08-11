import { db } from "./db"; import type { Task, PropertyItem, Poll } from "./types";
export async function ensureSeeded(){ if(localStorage.getItem("seeded")) return;
 const tasks:Task[]=[{id:crypto.randomUUID(),title:"Get pre-approval letter",assignee:"Sam",dueDate:new Date(Date.now()+86400000).toISOString(),status:"todo",privacy:"shared",note:"Credit union"},
 {id:crypto.randomUUID(),title:"Tour 123 Maple St",assignee:"Alex",dueDate:new Date(Date.now()+3*86400000).toISOString(),status:"doing",privacy:"shared"},
 {id:crypto.randomUUID(),title:"Budget worksheet",assignee:"Me",dueDate:new Date(Date.now()-2*86400000).toISOString(),status:"todo",privacy:"private"}];
 const props:PropertyItem[]=[{id:crypto.randomUUID(),title:"123 Maple St",notes:"Backyard + workshop",privacy:"shared"},{id:crypto.randomUUID(),title:"98 Pine Ave",notes:"Needs roof",privacy:"shared"}];
 const polls:Poll[]=[{id:crypto.randomUUID(),question:"Move forward with an offer on 123 Maple St?",options:[{id:crypto.randomUUID(),text:"Yes",votes:1},{id:crypto.randomUUID(),text:"No",votes:0}],quorumPct:60,deadlineISO:new Date(Date.now()+2*86400000).toISOString(),locked:false,resultOptionId:undefined,voters:["Sam"],visibleTo:"shared"}];
 for(const t of tasks) await db.add("tasks",t); for(const p of props) await db.add("shortlist",p); for(const p of polls) await db.add("polls",p);
 localStorage.setItem("seeded","1");}
