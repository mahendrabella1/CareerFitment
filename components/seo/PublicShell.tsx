/**
 * The frame of the public, search-facing pages (/features, /blogs): a header
 * with the main sections and the "Start assessment" button, and a footer that
 * links every feature page and the blog - so search engines (and people) can
 * reach every public page in a click or two. Server-rendered, no client JS.
 */
import { FEATURE_PAGES } from "@/lib/seo/features";
import { SocialLinks } from "./SocialLinks";
import "./public.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pub">
      <header className="pub-nav">
        <div className="pub-in pub-nav-in">
          <a href="/" className="pub-brand" aria-label="OneGrasp home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/logo.png" alt="OneGrasp" width={75} height={44} />
          </a>
          <nav className="pub-links" aria-label="Main">
            <a href="/features">Features</a>
            <a href="/careers">Careers</a>
            <a href="/blogs">Blog</a>
            <a href="/jobs">Jobs</a>
            <a href="/features/for-schools">For schools</a>
          </nav>
          <div className="pub-cta">
            <a href="/signin" className="pub-btn ghost">Sign in</a>
            <a href="/register" className="pub-btn pri">Start assessment</a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="pub-foot">
        <div className="pub-in">
          <div className="pub-foot-grid">
            <div>
              <b>OneGrasp Career Fitment</b>
              <p>The career assessment, report and dashboard for students from Class 6 to college - and tools for schools and working professionals.</p>
              <p><a href="mailto:support@onegrasp.com">support@onegrasp.com</a> · <a href="tel:+918977760442">+91 89777 60442</a></p>
              <SocialLinks size={16} />
              <p style={{ marginTop: 14 }}><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/privacy/request">Delete my data</a></p>
            </div>
            <nav aria-label="Features">
              <b>Features</b>
              <ul>{FEATURE_PAGES.slice(0, 12).map((f) => <li key={f.slug}><a href={`/features/${f.slug}`}>{f.name}</a></li>)}</ul>
            </nav>
            <nav aria-label="More features">
              <b>&nbsp;</b>
              <ul>{FEATURE_PAGES.slice(12).map((f) => <li key={f.slug}><a href={`/features/${f.slug}`}>{f.name}</a></li>)}</ul>
            </nav>
            <nav aria-label="Site">
              <b>OneGrasp</b>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/careers">How to become... (360 careers)</a></li>
                <li><a href="/blogs">Blog</a></li>
                <li><a href="/jobs">Jobs board</a></li>
                <li><a href="/register">Take the assessment</a></li>
                <li><a href="/signin">Sign in</a></li>
                <li><a href="https://onegrasp.com" rel="noopener">onegrasp.com</a></li>
              </ul>
            </nav>
          </div>
          <span className="pub-copy">© {new Date().getFullYear()} OneGrasp</span>
        </div>
      </footer>
    </div>
  );
}

/** A "take the assessment" box for the end of a page. */
export function CtaBox({ title = "Find the careers that fit you", text = "Take the OneGrasp career assessment for your class, get your report and open your dashboard - courses, labs, tools and a Year Plan made for you." }: { title?: string; text?: string }) {
  return (
    <aside className="pub-ctabox">
      <div><b>{title}</b><p>{text}</p></div>
      <div className="pub-ctabox-a">
        <a href="/register" className="pub-btn pri">Start the assessment</a>
        <a href="/features" className="pub-btn ghost">See every feature</a>
      </div>
    </aside>
  );
}

