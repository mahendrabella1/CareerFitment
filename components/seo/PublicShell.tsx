/**
 * The frame of the public, search-facing pages (/features, /blogs): a header
 * with the main sections and the "Start assessment" button, and a footer that
 * links every feature page and the blog - so search engines (and people) can
 * reach every public page in a click or two. Server-rendered, no client JS.
 */
import { FEATURE_PAGES } from "@/lib/seo/features";
import { SocialLinks } from "./SocialLinks";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pub">
      <style dangerouslySetInnerHTML={{ __html: PUB_CSS }} />
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

const PUB_CSS = `
.pub{--ink:#1c1917;--ink2:#57534e;--ink3:#78716c;--line:#e7e5e4;--bg2:#f4f0eb;--acc:#db3433;color:var(--ink);background:#fff;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:16px;line-height:1.6}
.pub *{box-sizing:border-box}
.pub a{color:inherit}
.pub-in{max-width:1120px;margin:0 auto;padding:0 20px}
.pub-nav{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.pub-nav-in{display:flex;align-items:center;gap:20px;height:64px}
.pub-brand img{display:block;height:36px;width:auto}
.pub-links{display:flex;gap:22px;margin-left:12px}
.pub-links a{text-decoration:none;font-size:14.5px;color:var(--ink2);font-weight:500}
.pub-links a:hover{color:var(--ink)}
.pub-cta{margin-left:auto;display:flex;gap:8px}
.pub-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 16px;border-radius:10px;font-size:14.5px;font-weight:600;text-decoration:none;border:1px solid var(--line);background:#fff;color:var(--ink);white-space:nowrap}
.pub-btn.pri{background:var(--acc);border-color:var(--acc);color:#fff}
.pub-btn.pri:hover{filter:brightness(.95)}
.pub-btn.ghost:hover{background:#fafaf9}
.pub-hero{background:var(--bg2);border-bottom:1px solid var(--line)}
.pub-hero-in{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:40px;align-items:center;padding:48px 20px 44px}
.pub-kicker{font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--acc)}
.pub h1{font-family:Poppins,Inter,sans-serif;font-size:clamp(28px,4vw,42px);line-height:1.15;letter-spacing:-.02em;margin:10px 0 14px}
.pub h2{font-family:Poppins,Inter,sans-serif;font-size:clamp(21px,2.6vw,26px);line-height:1.25;letter-spacing:-.01em;margin:36px 0 12px}
.pub h3{font-size:17px;margin:22px 0 8px}
.pub-lead{font-size:18px;color:var(--ink2);margin:0 0 20px}
.pub-hero img{width:100%;height:auto;max-height:340px;object-fit:contain}
.pub-hero-a{display:flex;gap:10px;flex-wrap:wrap}
.pub-crumbs{font-size:13px;color:var(--ink3);margin-bottom:6px}
.pub-crumbs a{text-decoration:none}
.pub-crumbs a:hover{text-decoration:underline}
.pub-body{padding:8px 20px 48px}
.pub-points{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:8px 0 0}
.pub-point{border:1px solid var(--line);border-radius:12px;padding:16px 18px;background:#fff}
.pub-point b{display:block;font-size:15.5px;margin-bottom:4px}
.pub-point p{margin:0;font-size:14.5px;color:var(--ink2)}
.pub-faq{border-top:1px solid var(--line)}
.pub-faq details{border-bottom:1px solid var(--line);padding:14px 2px}
.pub-faq summary{cursor:pointer;font-weight:600;font-size:15.5px}
.pub-faq p{margin:8px 0 0;color:var(--ink2);font-size:15px}
.pub-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.pub-card{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;text-decoration:none}
.pub-card:hover{border-color:#d6d3d1;box-shadow:0 2px 10px rgba(0,0,0,.05)}
.pub-card-img{background:var(--bg2);display:flex;justify-content:center;align-items:center;height:150px}
.pub-card-img img{max-height:130px;max-width:90%;width:auto;height:auto}
.pub-card-b{padding:14px 16px 16px}
.pub-card-b small{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--acc)}
.pub-card-b b{display:block;font-size:16px;line-height:1.35;margin:4px 0 6px}
.pub-card-b p{margin:0;font-size:14px;color:var(--ink2)}
.pub-ctabox{display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;justify-content:space-between;margin:40px 0 0;padding:22px 24px;border-radius:14px;background:var(--bg2);border:1px solid var(--line)}
.pub-ctabox b{font-size:18px}
.pub-ctabox p{margin:4px 0 0;color:var(--ink2);font-size:15px;max-width:640px}
.pub-ctabox-a{display:flex;gap:8px;flex-wrap:wrap}
.pub-tags{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 0}
.pub-tags a{font-size:13.5px;padding:5px 12px;border:1px solid var(--line);border-radius:999px;text-decoration:none;background:#fff}
.pub-tags a:hover{border-color:#d6d3d1}
.pub-art{max-width:760px}
.pub-art p,.pub-art li{font-size:17px;line-height:1.75;color:#292524}
.pub-art a{color:var(--acc);text-underline-offset:2px}
.pub-art ul,.pub-art ol{padding-left:22px}
.pub-art li{margin:6px 0}
.pub-art .pub-tip{border-left:3px solid var(--acc);background:#fdf6f5;padding:12px 16px;border-radius:0 10px 10px 0;margin:18px 0}
.pub-art .pub-tip p{margin:0;font-size:16px}
.pub-meta{font-size:13.5px;color:var(--ink3)}
.pub-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0;border:1px solid var(--line);border-radius:12px;background:#fff;margin:22px 0 0}
.pub-facts>div{padding:14px 18px;border-left:1px solid var(--line)}
.pub-facts>div:first-child{border-left:0}
.pub-facts small{display:block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3)}
.pub-facts b{display:block;font-size:15px;line-height:1.45;margin-top:3px;font-weight:600}
.pub-steps{list-style:none;counter-reset:s;margin:12px 0 0;padding:0;display:grid;gap:8px;max-width:760px}
.pub-steps li{counter-increment:s;position:relative;padding:10px 14px 10px 50px;border:1px solid var(--line);border-radius:10px;background:#fff;font-size:15.5px}
.pub-steps li::before{content:counter(s);position:absolute;left:12px;top:9px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;background:var(--bg2);color:var(--acc)}
.pub-chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 0;padding:0;list-style:none}
.pub-chips li{font-size:14px;padding:5px 12px;border:1px solid var(--line);border-radius:999px;background:#fff}
.pub-dl{display:grid;grid-template-columns:minmax(120px,170px) minmax(0,1fr);gap:8px 18px;margin:12px 0 0;max-width:820px}
.pub-dl dt{font-weight:600;font-size:15px}
.pub-dl dd{margin:0;font-size:15.5px;color:#292524;line-height:1.65}
.pub-groups{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px 22px;margin-top:6px}
.pub-groups h3{margin:12px 0 4px;font-size:15px}
.pub-groups ul{margin:0;padding-left:20px}
.pub-groups li{font-size:15.5px;line-height:1.6;margin:4px 0;color:#292524}
.pub-years{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:10px}
.pub-years div{border:1px solid var(--line);border-radius:10px;padding:12px 14px;background:#fff}
.pub-years b{display:block;font-size:13px;color:var(--acc);text-transform:uppercase;letter-spacing:.05em}
.pub-years p{margin:4px 0 0;font-size:15px;line-height:1.55}
.pub-note{font-size:13.5px;color:var(--ink3);margin-top:28px;max-width:760px}
.pub-idx{columns:3 240px;column-gap:28px;margin:8px 0 0;padding:0;list-style:none}
.pub-idx li{break-inside:avoid;margin:0 0 7px;font-size:15px}
.pub-idx a{text-decoration:none}
.pub-idx a:hover{text-decoration:underline;color:var(--acc)}
.pub-idx small{color:var(--ink3);font-size:12.5px}
@media (max-width:860px){.pub-facts>div{border-left:0;border-top:1px solid var(--line)}.pub-facts>div:first-child{border-top:0}.pub-dl{grid-template-columns:1fr}.pub-dl dt{margin-top:6px}}
.pub-foot{border-top:1px solid var(--line);background:#fafaf9;padding:36px 0 24px;margin-top:24px}
.pub-foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:24px}
.pub-foot b{font-size:14px}
.pub-foot p{font-size:14px;color:var(--ink2);margin:8px 0}
.pub-foot ul{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:6px}
.pub-foot li a,.pub-foot p a{font-size:14px;color:var(--ink2);text-decoration:none}
.pub-foot li a:hover{color:var(--ink);text-decoration:underline}
.pub-copy{display:block;margin-top:22px;font-size:12.5px;color:var(--ink3)}
@media (max-width:860px){
  .pub-links{display:none}
  .pub-hero-in{grid-template-columns:1fr;padding:32px 16px}
  .pub-hero img{max-height:220px}
  .pub-in{padding:0 16px}
  .pub-body{padding:8px 16px 40px}
  .pub-foot-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:480px){
  .pub-cta .ghost{display:none}
  .pub-foot-grid{grid-template-columns:1fr}
}
`;
