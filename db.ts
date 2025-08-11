import { openDB, type DBSchema } from "idb";
import type { Task, PropertyItem, Poll } from "./types";
interface Store extends DBSchema {
  tasks:{key:string;value:Task}; shortlist:{key:string;value:PropertyItem};
  polls:{key:string;value:Poll}; files:{key:string;value:any};
  settings:{key:string;value:any}; networkLogs:{key:number;value:{ts:number;method:string;url:string}};
}
const dbp=openDB<Store>("cobuy_paths",1,{upgrade(db){db.createObjectStore("tasks",{keyPath:"id"});db.createObjectStore("shortlist",{keyPath:"id"});db.createObjectStore("polls",{keyPath:"id"});db.createObjectStore("files",{keyPath:"id"});db.createObjectStore("settings",{keyPath:"key"});db.createObjectStore("networkLogs",{keyPath:"ts"});}});
export const db={async add(store:any,v:any){return (await dbp).add(store,v)},async put(store:any,v:any){return (await dbp).put(store,v)},async delete(store:any,k:any){return (await dbp).delete(store,k)},async getAll(store:any){return (await dbp).getAll(store) as any},async get(store:any,k:any){return (await dbp).get(store,k) as any}};
