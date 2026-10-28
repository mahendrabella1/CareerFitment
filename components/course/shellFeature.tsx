"use client";
/**
 * Which feature the current page belongs to, shared by CoursePlayerShell with
 * the pages inside it - so every inner page's header (PageHeader in fx.tsx)
 * carries the feature's 3D illustration, like its home page does.
 */
import { createContext, useContext, type ReactNode } from "react";
import { featureArt, type FeatureMeta } from "@/lib/features/catalog";

const ShellFeatureContext = createContext<FeatureMeta | null>(null);

export function ShellFeatureProvider({ feature, children }: { feature: FeatureMeta | null; children: ReactNode }) {
  return <ShellFeatureContext.Provider value={feature}>{children}</ShellFeatureContext.Provider>;
}

/** The feature's illustration for a page header; nothing outside a feature. */
export function HeaderArt() {
  const feature = useContext(ShellFeatureContext);
  if (!feature) return null;
  const art = featureArt(feature.key);
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="fx-ph-art" src={art.card} alt="" loading="lazy" decoding="async" />;
}
