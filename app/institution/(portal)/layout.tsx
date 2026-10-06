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
import { usePortal, type PortalUnread } from "@/components/institution/portalStore";
import { formatAgoInline } from "@/lib/institution/analytics";

const NAV: { href: string; label: string; icon: string; group?: string; badge?: keyof PortalUnread }[] = [
  { href: "/institution", label: "Overview", icon: "radar" },
  { href: "/institution/students", label: "Students", icon: "users", group: "People" },
  { href: "/institution/parents", label: "Parents", icon: "heart" },
  { href: "/institution/observations", label: "Teacher check", icon: "check" },
  { href: "/institution/passport", label: "Career Passport", icon: "award", badge: "milestones" },
  { href: "/institution/messages", label: "Messages", icon: "bell", group: "Engage" },
  { href: "/institution/replies", label: "Student replies", icon: "answer", badge: "replies" },
  { href: "/institution/decisions", label: "Decision briefs", icon: "signpost" },
  { href: "/institution/opportunities", label: "Opportunities", icon: "target" },
  { href: "/institution/mentors", label: "Peer mentors", icon: "route" },
  { href: "/institution/journeys", label: "Career journeys", icon: "compass", group: "Insights" },
  { href: "/institution/life-skills", label: "Life skills", icon: "shield" },
  { href: "/institution/future", label: "Future skills", icon: "sparkle" },
  { href: "/institution/guide", label: "Guide", icon: "book", group: "Help" },
  { href: "/institution/onegrasp", label: "Ask OneGrasp", icon: "help", badge: "onegrasp" },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const { me, students, loadedAt, reload, logout, unread } = usePortal();
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
          <button className="ip-btn ghost sm" onClick={() => void logout()} title={`Signed in as ${me.account.displayName}`}>{me.viewAs ? "Exit" : "Sign out"}</button>
        </div>
      </header>
      <div className="ip-shell">
        <nav className="ip-nav" aria-label="Portal">
          {NAV.map((n) => {
            const on = n.href === "/institution" ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <div key={n.href} style={{ display: "contents" }}>
                {n.group && <div className="ip-nav-group">{n.group}</div>}
                <Link href={n.href} className={on ? "on" : ""}>
                  <Icon name={n.icon} size={17} stroke={1.9} /> {n.label}
                  {n.href === "/institution/students" && students && <span className="ip-badge" style={{ background: "var(--line)", color: "var(--ink2)" }}>{students.filter((s) => !s.archived).length}</span>}
                  {n.badge && unread[n.badge] > 0 && <span className="ip-badge" title="Waiting for you">{unread[n.badge]}</span>}
                </Link>
              </div>
            );
          })}
        </nav>
        <main className="ip-main">{children}</main>
      </div>
    </>
  );
}
