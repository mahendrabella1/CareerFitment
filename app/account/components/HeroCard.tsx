/**
 * Hero Card Component
 * Large prominent section for primary content
 */

import { CSSProperties, ReactNode } from "react";
import { colors, spacing, radius, typography } from "@/app/account/designTokens";

interface HeroCardProps {
  children: ReactNode;
  style?: CSSProperties;
  withGradient?: boolean;
}

export function HeroCard({ children, style = {}, withGradient = true }: HeroCardProps) {
  return (
    <div
      style={{
        padding: spacing[8],
        borderRadius: radius.lg,
        backgroundColor: colors.ink[100],
        border: `1px solid ${colors.ink[80]}`,
        backgroundImage: withGradient
          ? `linear-gradient(135deg, rgba(219, 52, 51, 0.04) 0%, rgba(5, 150, 105, 0.02) 100%)`
          : undefined,
        marginBottom: spacing[8],
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Content inside hero card with title and metadata
export function HeroContent({
  title,
  subtitle,
  metadata,
  icon,
  children,
  style = {},
}: {
  title: string;
  subtitle?: string;
  metadata?: { label: string; value: string | ReactNode }[];
  icon?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={style}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: spacing[4], marginBottom: spacing[4] }}>
        {icon && (
          <div
            style={{
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.accent[100],
              borderRadius: radius.md,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: typography.scale.h1.fontSize,
              fontWeight: typography.scale.h1.fontWeight,
              lineHeight: typography.scale.h1.lineHeight,
              color: colors.ink[10],
              margin: 0,
              marginBottom: subtitle ? spacing[1] : 0,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: typography.scale.body.fontSize,
                color: colors.ink[40],
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {metadata && metadata.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: spacing[3],
            paddingTop: spacing[4],
            borderTop: `1px solid ${colors.ink[80]}`,
            marginBottom: children ? spacing[4] : 0,
          }}
        >
          {metadata.map((item, idx) => (
            <div key={idx}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  color: colors.ink[50],
                  marginBottom: spacing[1],
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: typography.scale.body.fontSize,
                  fontWeight: 600,
                  color: colors.ink[10],
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {children && <div style={{ marginTop: spacing[4] }}>{children}</div>}
    </div>
  );
}
