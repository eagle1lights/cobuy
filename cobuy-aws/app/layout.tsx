import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { NetworkLogDrawer } from "@/components/NetworkLogDrawer";
import { RoleSwitcher, RoleProvider } from "@/components/RoleGate";

export const metadata = { title: "CoBuy (Cloud MVP)", description: "Privacy-first MVP" };

export default function RootLayout({ children }: { children: ReactNode }){
  return (<html lang="en"><body>
    <RoleProvider>
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="badge">Cloud-hosted</div>
            <nav className="flex items-center gap-4 text-sm">
              <Link className="hover:text-brand" href="/">Home</Link>
              <Link className="hover:text-brand" href="/buyer">Buyer PM</Link>
              <Link className="hover:text-brand" href="/group">Group</Link>
              <Link className="hover:text-brand" href="/legal">Legal</Link>
              <Link className="hover:text-brand" href="/acceptance">Acceptance</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2"><RoleSwitcher/><NetworkLogDrawer/></div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-400">
        <p>No trackers • Minimal data • Exports exclude private items.</p>
      </footer>
    </RoleProvider>
  </body></html>);
}
