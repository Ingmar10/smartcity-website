import { SOCIALS, type SocialKey } from "@/lib/brand";

// Icon-only social row for the footer. Renders one pill per social profile that
// has a non-empty URL in lib/brand.ts SOCIALS — so hidden networks (and the
// pre-wired LinkedIn / YouTube / X) appear the moment a URL is added, with no
// code change. Renders nothing at all when no URLs are set.

type IconProps = { className?: string };

const NETWORKS: {
  key: SocialKey;
  label: string;
  Icon: (p: IconProps) => JSX.Element;
}[] = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
  { key: "x", label: "X", Icon: XIcon },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  const links = NETWORKS.map((n) => ({ ...n, url: SOCIALS[n.key] })).filter(
    (n) => n.url.trim().length > 0
  );

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {links.map(({ key, label, url, Icon }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-subtle transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
        >
          <Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}

/* ── Icons (monochrome, currentColor so the purple accent applies) ── */

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.1v12.3a2.52 2.52 0 1 1-2.5-2.52c.2 0 .4.03.59.08v-3.16a5.7 5.7 0 0 0-.59-.03A5.68 5.68 0 1 0 15.5 15.4V9.01a7.34 7.34 0 0 0 4.29 1.37V7.28a4.28 4.28 0 0 1-3.19-1.46Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.44c0-1.3-.02-2.97-1.81-2.97-1.82 0-2.09 1.41-2.09 2.87V21h-4V9Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.4 8.46L23 22h-6.4l-5-6.54L5.8 22H2.7l7.9-9.03L1.5 2H8l4.5 5.96L18.9 2Zm-1.13 18h1.7L7.32 3.9H5.5L17.77 20Z" />
    </svg>
  );
}
