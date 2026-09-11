/**
 * Production SaaS Card Component
 * Minimal, professional container with consistent spacing and borders
 */

import { ReactNode, CSSProperties } from "react";
import { colors, radius, shadows, spacing, components } from "@/app/account/designTokens";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: "default" | "subtle" | "elevated";
  padding?: "sm" | "md" | "lg";
  border?: boolean;
  clickable?: boolean;
}

export function Card({
  children,
  className = "",
  style = {},
  variant = "default",
  padding = "md",
  border = true,
  clickable = false,
}: CardProps) {
  const paddingMap = {
    sm: spacing[3],  // 12px
    md: spacing[5],  // 20px
    lg: spacing[6],  // 24px
  };

  const baseStyle: CSSProperties = {
    borderRadius: radius.lg,
    backgroundColor: colors.ink[100],
    fontFamily: "inherit",
    ...style,
  };

  if (variant === "default") {
    Object.assign(baseStyle, {
      padding: paddingMap[padding],
      border: border ? `1px solid ${colors.ink[80]}` : "none",
      boxShadow: shadows.sm,
    });
  } else if (variant === "subtle") {
    Object.assign(baseStyle, {
      padding: paddingMap[padding],
      backgroundColor: colors.ink[95],
      border: "none",
      boxShadow: "none",
    });
  } else if (variant === "elevated") {
    Object.assign(baseStyle, {
      padding: paddingMap[padding],
      border: "none",
      boxShadow: shadows.md,
    });
  }

  if (clickable) {
    Object.assign(baseStyle, {
      cursor: "pointer",
      transition: `box-shadow ${180}ms ease-out, background-color ${180}ms ease-out`,
    });
  }

  return (
    <div
      className={className}
      style={baseStyle}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// Simple container for multiple cards in grid
export function CardGrid({
  children,
  columns = 2,
  gap = spacing[4],
  className = "",
  style = {},
}: {
  children: ReactNode;
  columns?: number | "auto";
  gap?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: columns === "auto" ? "repeat(auto-fit, minmax(300px, 1fr))" : `repeat(${columns}, 1fr)`,
    gap,
    ...style,
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
}
