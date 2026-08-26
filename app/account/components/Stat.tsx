/**
 * Stat / KPI Component
 * Displays a metric with label, optional icon, and optional secondary text
 */

import { CSSProperties, ReactNode } from "react";
import { colors, spacing, typography } from "@/app/account/designTokens";

interface StatProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  subtext?: string;
  trend?: { value: number; isPositive: boolean };
  color?: "default" | "accent" | "success" | "warning" | "error";
}

export function Stat({ value, label, icon, subtext, trend, color = "default" }: StatProps) {
  const colorMap = {
    default: colors.ink[10],
    accent: colors.accent[40],
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };

  return (
    <div
      style={{
        padding: spacing[4],
        border: `1px solid ${colors.ink[80]}`,
        borderRadius: "8px",
        backgroundColor: colors.ink[100],
        fontSize: typography.scale.sm.fontSize,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: spacing[2], marginBottom: spacing[2] }}>
        {icon && (
          <div
            style={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: colorMap[color],
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              color: colors.ink[50],
              marginBottom: "4px",
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: colorMap[color],
              lineHeight: 1,
            }}
          >
            {value}
          </div>
        </div>
      </div>

      {trend && (
        <div
          style={{
            fontSize: "11px",
            color: trend.isPositive ? colors.success : colors.error,
            marginBottom: spacing[1],
          }}
        >
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}

      {subtext && (
        <div style={{ fontSize: "12px", color: colors.ink[40], marginTop: spacing[1] }}>
          {subtext}
        </div>
      )}
    </div>
  );
}

// Grid of stats
export function StatGrid({ children, columns = 4 }: { children: ReactNode; columns?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
        gap: spacing[4],
        marginBottom: spacing[6],
      }}
    >
      {children}
    </div>
  );
}
