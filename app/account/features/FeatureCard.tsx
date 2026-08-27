"use client";

import { colors, spacing, radius, shadows } from "@/app/account/designTokens";

interface FeatureCardProps {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  categories: string[];
  onExplore: () => void;
}

export default function FeatureCard({
  id,
  image,
  badge,
  title,
  subtitle,
  description,
  categories,
  onExplore,
}: FeatureCardProps) {
  return (
    <div style={styles.card}>
      {/* Hero Image */}
      <div style={styles.imageContainer}>
        <img src={image} alt={title} style={styles.image} />
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Badge */}
        <div style={styles.badge}>{badge}</div>

        {/* Title & Subtitle */}
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.subtitle}>{subtitle}</p>

        {/* Description */}
        <p style={styles.description}>{description}</p>

        {/* Categories */}
        <div style={styles.categories}>
          {categories.map((category) => (
            <div key={category} style={styles.category}>
              <span style={styles.categoryIcon}>📌</span>
              <span style={styles.categoryText}>{category}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onExplore} style={styles.cta}>
          <span>Explore {title}</span>
          <span style={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: radius.lg,
    overflow: "hidden",
    boxShadow: shadows.md,
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  imageContainer: {
    width: "100%",
    height: "240px",
    overflow: "hidden",
    backgroundColor: colors.ink[90],
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    padding: spacing[6],
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  badge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: spacing[3],
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[1],
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#2563eb",
    margin: 0,
    marginBottom: spacing[3],
  },
  description: {
    fontSize: 14,
    color: colors.ink[30],
    lineHeight: 1.6,
    margin: 0,
    marginBottom: spacing[4],
    flex: 1,
  },
  categories: {
    display: "flex",
    gap: spacing[3],
    marginBottom: spacing[5],
    flexWrap: "wrap",
  },
  category: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    background: colors.ink[95],
    borderRadius: radius.sm,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.ink[80],
  },
  cta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    padding: spacing[2],
    marginLeft: -spacing[2],
    transition: "all 0.2s ease",
  },
  arrow: {
    fontSize: 18,
    display: "inline-block",
    transition: "transform 0.2s ease",
  },
};
