"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";

const NAV = [
  { href: "/admin", label: "Users", icon: "user", group: "Students" },
  { href: "/admin/archives", label: "Archives", icon: "archive", group: "Students" },
  { href: "/admin/messages", label: "Messages", icon: "bell", group: "Students" },
  { href: "/admin/institutions", label: "Institution logins", icon: "users", group: "Schools" },
  { href: "/admin/institutional", label: "Institutional links", icon: "school", group: "Schools" },
  { href: "/admin/payment", label: "Payment settings", icon: "card", group: "Billing" },
  { href: "/admin/coupons", label: "Coupon codes", icon: "bookmark", group: "Billing" },
  { href: "/admin/ai-status", label: "AI & keys", icon: "cpu", group: "System" },
];
const GROUPS = ["Students", "Schools", "Billing", "System"];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav style={S.sidebar} className="og-adm-sidebar" aria-label="Admin sections">
      {GROUPS.map((g) => (
        <div key={g}>
          <div style={S.group}>{g}</div>
          {NAV.filter((n) => n.group === g).map((item) => {
            // Exact match for /admin (Users) so it isn't also "active" while on
            // every other section; startsWith for the rest so a section stays
            // highlighted on any sub-path it might grow later.
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{ ...S.item, ...(active ? S.itemActive : {}) }} aria-current={active ? "page" : undefined}>
                {active && <span style={S.bar} aria-hidden="true" />}
                <span style={{ ...S.itemIcon, ...(active ? S.itemIconActive : {}) }}><Icon name={item.icon} size={17} /></span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

const S: Record<string, React.CSSProperties> = {
  sidebar: { width: 232, flex: "none", display: "flex", flexDirection: "column", padding: "8px 14px 20px" },
  group: { fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#7b808b", padding: "16px 10px 6px" },
  item: { position: "relative", display: "flex", alignItems: "center", gap: 10, height: 36, padding: "0 10px", borderRadius: 6, color: "#4a4f59", fontSize: 13.5, fontWeight: 500, textDecoration: "none" },
  itemActive: { background: "#f4f0eb", color: "#16181d", fontWeight: 600 },
  bar: { position: "absolute", left: -14, top: 8, bottom: 8, width: 3, borderRadius: "0 3px 3px 0", background: "#db3433" },
  itemIcon: { display: "grid", placeItems: "center", width: 20, height: 20, flex: "none", color: "#7b808b" },
  itemIconActive: { color: "#16181d" },
};
