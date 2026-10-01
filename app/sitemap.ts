import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/brand";

// Indexable public routes. /dialbolt/consent is a compliance page that must be
// publicly reachable (A2P review) so it is listed too.
const ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/quotesmart", priority: 0.9, changeFrequency: "monthly" },
  { path: "/dialbolt", priority: 0.9, changeFrequency: "monthly" },
  { path: "/network", priority: 0.7, changeFrequency: "monthly" },
  { path: "/voice", priority: 0.6, changeFrequency: "monthly" },
  { path: "/payments", priority: 0.6, changeFrequency: "monthly" },
  { path: "/university", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/dialbolt/consent", priority: 0.3, changeFrequency: "monthly" },
  { path: "/dialbolt/privacy", priority: 0.2, changeFrequency: "monthly" },
  { path: "/dialbolt/terms", priority: 0.2, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${COMPANY.siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
