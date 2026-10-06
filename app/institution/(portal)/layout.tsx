"use client";

/**
 * The portal shell (top bar + navigation) around Overview, Students and
 * Messages. A route GROUP: /institution/report/[uid] sits outside it so a
 * student's report prints on its own. Access is checked by the parent
 * app/institution/layout.tsx.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import { usePortal } from "@/components/institution/portalStore";
import { formatAgoInline } from "@/lib/institution/analytics";

const NAV = [
  { href: "/institution", label: "Overview", icon: "radar" },
  { href: "/institution/students", label: "Students", icon: "users" },
  { href: "/institution/messages", label: "Messages", icon: "bell" },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const { me, students, loadedAt, reload, logout } = usePortal();
  const pathname = usePathname() ?? "";
  return (
    <>
      <header className="ip-top">
        <div className="ip-top-in">
          <Link href="/institution" aria-label="Overview" className="ip-logo"><Logo height={32} /></Link>
          <span className="ip-div" style={{ width: 1, height: 28, background: "var(--line)" }} />
          <div className="ip-inst">
            <span>Institution portal</span>
            <b title={me.institution.name}>{me.institution.name}</b>
          </div>
          <span style={{ flex: 1 }} />
          <span className="ip-muted ip-updated" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
            {loadedAt ? `Updated ${formatAgoInline(loadedAt)}` : "Loading…"}
          </span>
          <button className="ip-btn ghost sm" onClick={() => void reload()} title="Load the latest data">Refresh</button>
          <button className="ip-btn ghost sm" onClick={() => void logout()} title={`Signed in as ${me.account.displayName}`}>Sign out</button>
        </div>
      </header>
      <div className="ip-shell">
        <nav className="ip-nav" aria-label="Portal">
          {NAV.map((n) => {
            const on = n.href === "/institution" ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={on ? "on" : ""}>
                <Icon name={n.icon} size={17} stroke={1.9} /> {n.label}
                {n.href === "/institution/students" && students && <span className="ip-badge" style={{ background: "var(--line)", color: "var(--ink2)" }}>{students.filter((s) => !s.archived).length}</span>}
              </Link>
            );
          })}
        </nav>
        <main className="ip-main">{children}</main>
      </div>
    </>
  );
}
