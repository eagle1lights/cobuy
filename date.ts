import type { Task } from "./types";
export function isOverdue(t:Task){ if(!t.dueDate) return false; const d=new Date(t.dueDate).getTime(); return d<Date.now() && t.status!=="done"; }
export function formatDueHuman(t:Task){ if(!t.dueDate) return ""; const d=new Date(t.dueDate).getTime(); const delta=Math.round((d-Date.now())/86400000); if(delta===0) return "Today"; if(delta>0) return `In ${delta} day${delta===1?"":"s"}`; return `${Math.abs(delta)}d late`; }
