"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";

const NAV = [
  { href: "/admin", label: "Users", icon: "user" },
  { href: "/admin/payment", label: "Payment Settings", icon: "card" },
  { href: "/admin/coupons", label: "Coupon Codes", icon: "bookmark" },
  { href: "/admin/institutional", label: "Institutional Links", icon: "school" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav style={S.sidebar} className="og-adm-sidebar">
      {NAV.map((item) => {
        // Exact match for /admin (Users) so it isn't also "active" while on
        // every other section; startsWith for the rest so a section stays
        // highlighted on any sub-path it might grow later.
        const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} style={{ ...S.item, ...(active ? S.itemActive : {}) }}>
            <span style={{ ...S.itemIcon, ...(active ? S.itemIconActive : {}) }}><Icon name={item.icon} size={17} /></span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const S: Record<string, React.CSSProperties> = {
  sidebar: { width: 232, flex: "none", display: "flex", flexDirection: "column", gap: 3, padding: "20px 14px" },
  item: { display: "flex", alignItems: "center", gap: 11, padding: "10px 13px", borderRadius: 10, color: C.ink2, fontSize: 13.5, fontWeight: 600, textDecoration: "none" },
  itemActive: { background: C.redTint, color: C.redStrong, fontWeight: 800 },
  itemIcon: { display: "grid", placeItems: "center", width: 22, height: 22, flex: "none", color: C.muted },
  itemIconActive: { color: C.red },
};
