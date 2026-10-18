// No `dynamic = "force-dynamic"` here: it made every /account page render on
// the server (in the US region) on every click. The pages under /account read
// their data in the browser, so Next.js builds them once and serves them from
// the CDN; a page that needs per-request server data becomes dynamic by itself
// (cookies(), headers(), searchParams) or can set its own `dynamic` export.
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
