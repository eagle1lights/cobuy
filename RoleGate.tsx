"use client";
import { createContext, useContext, useEffect, useState } from "react";
export type Role = "Owner"|"Member"|"Attorney";
const RoleContext = createContext<{role:Role,setRole:(r:Role)=>void}|null>(null);
export function RoleSwitcher(){const c=useRoleCtx();return(<label className="flex items-center gap-2">
<span className="text-sm text-slate-300">Role</span>
<select className="input" aria-label="Role" value={c.role} onChange={e=>c.setRole(e.target.value as Role)}>
<option>Owner</option><option>Member</option><option>Attorney</option></select></label>)}
export function RoleProvider({children}:{children:React.ReactNode}){
 const [role,setRole]=useState<Role>("Owner");
 useEffect(()=>{const r=localStorage.getItem("role"); if(r) setRole(r as Role)},[]);
 useEffect(()=>{localStorage.setItem("role",role)},[role]);
 return <RoleContext.Provider value={{role,setRole}}>{children}</RoleContext.Provider>;
}
export function useRoleCtx(){const v=useContext(RoleContext); if(!v) throw new Error("RoleContext missing"); return v;}
export function useRole(){return useRoleCtx().role;}
export function RoleGate({allowed,children}:{allowed:Role[],children:React.ReactNode}){
 const role=useRole(); if(!allowed.includes(role)) return <div className="banner">Content hidden for <b>{role}</b> role.</div>;
 return <>{children}</>;
}
