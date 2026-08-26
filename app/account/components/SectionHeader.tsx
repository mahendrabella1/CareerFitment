/**
 * Section Header Component
 * Used before major sections to establish hierarchy
 */

import { CSSProperties, ReactNode } from "react";
import { colors, spacing, typography } from "@/app/account/designTokens";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

export function SectionHeader({ title, subtitle, icon, action, style = {} }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: spacing[4],
        marginBottom: spacing[5],
        ...style,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing[2],
            marginBottom: subtitle ? spacing[1] : 0,
          }}
        >
          {icon && (
            <div
              style={{
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.accent[40],
              }}
            >
              {icon}
            </div>
          )}
          <h2
            style={{
              fontSize: typography.scale.h2.fontSize,
              fontWeight: typography.scale.h2.fontWeight,
              lineHeight: typography.scale.h2.lineHeight,
              color: colors.ink[10],
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: typography.scale.sm.fontSize,
              color: colors.ink[40],
              margin: 0,
              marginLeft: icon ? 28 : 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

// Divider line
export function Divider({ style = {} }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        height: "1px",
        backgroundColor: colors.ink[80],
        margin: `${spacing[6]} 0`,
        ...style,
      }}
    />
  );
}

// Page container with consistent max width and padding
export function PageContainer({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        maxWidth: "1440px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: spacing[6],
        paddingRight: spacing[6],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
