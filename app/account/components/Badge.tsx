/**
 * Badge Component
 * Small label for status, category, or tag
 */

import { CSSProperties } from "react";
import { colors, spacing, typography } from "@/app/account/designTokens";

interface BadgeProps {
  children: string;
  variant?: "default" | "accent" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  style?: CSSProperties;
}

export function Badge({ children, variant = "default", size = "sm", style = {} }: BadgeProps) {
  const variantStyles: Record<string, { bg: string; text: string }> = {
    default: { bg: colors.ink[90], text: colors.ink[40] },
    accent: { bg: colors.accent[100], text: colors.accent[40] },
    success: { bg: `${colors.success}15`, text: colors.success },
    warning: { bg: `${colors.warning}15`, text: colors.warning },
    error: { bg: `${colors.error}15`, text: colors.error },
    info: { bg: `${colors.info}15`, text: colors.info },
  };

  const sizeStyles = {
    sm: { padding: `${spacing[1]} ${spacing[2]}`, fontSize: "11px" },
    md: { padding: `${spacing[1]} ${spacing[3]}`, fontSize: "12px" },
  };

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...sizeStyle,
        borderRadius: "4px",
        backgroundColor: variantStyle.bg,
        color: variantStyle.text,
        fontWeight: 600,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        letterSpacing: "0.01em",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
