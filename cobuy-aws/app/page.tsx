import Link from "next/link";
export default function Page(){
  return (<div className="grid gap-6">
    <section className="card p-6">
      <h1 className="text-2xl font-semibold">CoBuy (Cloud MVP)</h1>
      <p className="text-slate-300 mt-1">Cloud-hosted with AWS Amplify (Auth/Data/Storage). Buyer PM and Group features preserved.</p>
      <ul className="mt-4 grid gap-2 text-sm">
        <li>• Buyer PM: tasks, counters, CSV/ICS/PDF exports</li>
        <li>• Group: shortlist + polls with quorum + lock</li>
        <li>• Legal: LLC vs TIC wizard + encrypted files</li>
      </ul>
      <div className="mt-4 flex gap-3">
        <Link className="btn btn-primary" href="/buyer">Open Buyer PM</Link>
        <Link className="btn" href="/group">Open Group</Link>
        <Link className="btn" href="/legal">Open Legal</Link>
      </div>
    </section>
  </div>);
}
