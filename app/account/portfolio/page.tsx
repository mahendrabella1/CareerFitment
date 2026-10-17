'use client';

/**
 * /account/portfolio - "Build Your Website": the student's own public
 * profile page. Everything saves to their account through
 * /api/portfolio/my-portfolio (signed-in, server-validated); the public copy
 * lives at /portfolio/[slug] once they make it public.
 */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { apiFetch } from '@/lib/institution/client';
import type {
  PortfolioCertification, PortfolioEducation, PortfolioExperience, PortfolioProfile, PortfolioSkill,
} from '@/lib/data/portfolioSchema';

type Patch = Partial<PortfolioProfile>;
type SectionId = 'about' | 'experience' | 'education' | 'certifications' | 'skills' | 'links' | 'sharing';

const ACCENT = '#2563eb';

const CSS = `
.pf{min-height:100vh;background:#f6f7f9;color:#111827;font-family:Inter,system-ui,'Segoe UI',sans-serif}
.pf *{box-sizing:border-box}
.pf-top{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid #e5e7eb}
.pf-top-in{max-width:1200px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.pf-crumb{display:flex;align-items:center;gap:8px;font-size:13.5px;color:#6b7280;min-width:0}
.pf-crumb a{color:#6b7280;text-decoration:none}
.pf-crumb a:hover{color:#111827}
.pf-crumb b{color:#111827;font-weight:600}
.pf-actions{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.pf-pill{font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;border:1px solid #e5e7eb;color:#4b5563;background:#f9fafb;white-space:nowrap}
.pf-pill.on{color:#166534;background:#f0fdf4;border-color:#bbf7d0}
.pf-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;font-size:13.5px;font-weight:600;padding:8px 14px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#111827;cursor:pointer;text-decoration:none;white-space:nowrap;line-height:1.2}
.pf-btn:hover{background:#f9fafb}
.pf-btn:disabled{opacity:.55;cursor:not-allowed}
.pf-btn.primary{background:${ACCENT};border-color:${ACCENT};color:#fff}
.pf-btn.primary:hover{background:#1d4ed8}
.pf-btn.link{border-color:transparent;background:none;color:${ACCENT};padding:6px 8px}
.pf-btn.link:hover{background:#eff6ff}
.pf-btn.danger{color:#b91c1c}
.pf-wrap{max-width:1200px;margin:0 auto;padding:24px;display:grid;grid-template-columns:290px minmax(0,1fr);gap:24px;align-items:start}
.pf-side{position:sticky;top:72px;display:flex;flex-direction:column;gap:16px}
.pf-main{display:flex;flex-direction:column;gap:16px;min-width:0}
.pf-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px}
.pf-prof{padding:20px;text-align:center}
.pf-av{width:72px;height:72px;border-radius:50%;margin:0 auto 12px;display:grid;place-items:center;background:#eef2ff;color:#3730a3;font-size:28px;font-weight:700}
.pf-name{font-size:16px;font-weight:700}
.pf-head{font-size:13px;color:#4b5563;margin-top:4px;line-height:1.45}
.pf-loc{font-size:12.5px;color:#6b7280;margin-top:6px}
.pf-steps{padding:16px}
.pf-steps-h{display:flex;justify-content:space-between;font-size:13px;font-weight:600}
.pf-bar{height:6px;border-radius:999px;background:#e5e7eb;margin:8px 0 12px;overflow:hidden}
.pf-bar>div{height:100%;background:${ACCENT};transition:width .3s}
.pf-step{display:flex;align-items:center;gap:10px;width:100%;padding:7px 6px;border:0;background:none;font:inherit;font-size:13px;color:#111827;text-align:left;border-radius:6px;cursor:pointer}
.pf-step:hover{background:#f3f4f6}
.pf-step.done{color:#6b7280;cursor:default;text-decoration:line-through}
.pf-step.done:hover{background:none}
.pf-tick{flex:none;width:18px;height:18px;border-radius:50%;border:1.5px solid #d1d5db;display:grid;place-items:center;font-size:11px;color:#fff}
.pf-step.done .pf-tick{background:#16a34a;border-color:#16a34a}
.pf-nav{padding:8px}
.pf-nav a{display:block;padding:7px 10px;border-radius:6px;font-size:13px;color:#374151;text-decoration:none}
.pf-nav a:hover{background:#f3f4f6;color:#111827}
.pf-next{display:flex;align-items:center;gap:16px;padding:16px 20px;border-color:#bfdbfe;background:#f8fbff;flex-wrap:wrap}
.pf-next-k{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${ACCENT}}
.pf-next-t{font-size:15px;font-weight:600;margin-top:2px}
.pf-next-n{font-size:13px;color:#4b5563;margin-top:2px}
.pf-sec{padding:20px 24px;scroll-margin-top:84px}
.pf-sec-h{display:flex;align-items:center;gap:12px}
.pf-sec-h h2{font-size:16px;font-weight:700;margin:0;flex:1}
.pf-sec-sub{font-size:13px;color:#6b7280;margin:4px 0 16px;line-height:1.5}
.pf-empty{border:1px dashed #d1d5db;border-radius:10px;padding:20px;text-align:center;font-size:13.5px;color:#6b7280;display:flex;flex-direction:column;align-items:center;gap:10px}
.pf-item{display:flex;gap:12px;padding:14px 0;border-top:1px solid #f0f1f3}
.pf-item:first-child{border-top:0;padding-top:4px}
.pf-item-b{flex:1;min-width:0}
.pf-item-t{font-size:14.5px;font-weight:600}
.pf-item-s{font-size:13px;color:#4b5563;margin-top:2px}
.pf-item-d{font-size:12.5px;color:#6b7280;margin-top:2px}
.pf-item-p{font-size:13px;color:#374151;margin:6px 0 0;line-height:1.55;white-space:pre-wrap}
.pf-item-a{display:flex;gap:2px;align-items:flex-start;flex:none}
.pf-form{border:1px solid #e5e7eb;border-radius:10px;padding:16px;background:#fafafa;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 14px;margin-top:8px}
.pf-f{display:flex;flex-direction:column;gap:5px;font-size:12.5px;font-weight:600;color:#374151;min-width:0}
.pf-f.wide{grid-column:1/-1}
.pf-f input:not([type=checkbox]),.pf-f textarea,.pf-f select{font:inherit;font-size:14px;font-weight:400;padding:9px 11px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#111827;width:100%}
.pf-f textarea{resize:vertical;min-height:84px;line-height:1.5}
.pf-f input:focus,.pf-f textarea:focus,.pf-f select:focus{outline:none;border-color:${ACCENT};box-shadow:0 0 0 3px #dbeafe}
.pf-check{flex-direction:row;align-items:center;gap:8px;font-weight:500}
.pf-check input{width:16px;height:16px;accent-color:${ACCENT}}
.pf-form-a{grid-column:1/-1;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.pf-err{grid-column:1/-1;font-size:13px;color:#b91c1c}
.pf-chips{display:flex;flex-wrap:wrap;gap:8px}
.pf-chip{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;padding:5px 6px 5px 12px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb;color:#111827}
.pf-chip button{border:0;background:none;cursor:pointer;color:#6b7280;font-size:15px;line-height:1;padding:0 4px;border-radius:50%}
.pf-chip button:hover{color:#b91c1c}
.pf-sugg{font:inherit;font-size:12.5px;padding:5px 11px;border-radius:999px;border:1px dashed #cbd5e1;background:#fff;color:#374151;cursor:pointer}
.pf-sugg:hover{border-color:${ACCENT};color:${ACCENT}}
.pf-toggle{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-top:1px solid #f0f1f3;cursor:pointer}
.pf-toggle:first-of-type{border-top:0}
.pf-toggle input{margin-top:2px;width:18px;height:18px;accent-color:${ACCENT};flex:none}
.pf-toggle b{display:block;font-size:14px;font-weight:600}
.pf-toggle span{display:block;font-size:12.5px;color:#6b7280;margin-top:2px}
.pf-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#111827;color:#fff;font-size:13px;font-weight:600;padding:9px 16px;border-radius:999px;z-index:60}
.pf-alert{padding:12px 16px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:13.5px}
.pf-center{min-height:70vh;display:grid;place-items:center;text-align:center;padding:24px;color:#6b7280;font-size:14px}
.pf-create{max-width:1040px;margin:0 auto;padding:32px 24px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:32px;align-items:start}
.pf-create h1{font-size:28px;line-height:1.2;margin:0 0 10px;letter-spacing:-.02em}
.pf-create p{font-size:14.5px;color:#4b5563;line-height:1.6;margin:0 0 16px}
.pf-create ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}
.pf-create li{display:flex;gap:10px;font-size:14px;color:#374151;line-height:1.5}
.pf-create li span{color:${ACCENT};font-weight:700}
@media (max-width:900px){
  .pf-wrap{grid-template-columns:minmax(0,1fr);padding:16px}
  .pf-side{position:static}
  .pf-nav{display:none}
  .pf-top-in{padding:10px 16px}
  .pf-sec{padding:16px}
  .pf-form{grid-template-columns:minmax(0,1fr)}
  .pf-create{grid-template-columns:minmax(0,1fr);padding:20px 16px}
}
`;

const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtMonth = (m?: string) => {
  const [y, mo] = (m || '').split('-');
  return y && mo ? `${MONTHS[Number(mo) - 1] ?? ''} ${y}` : '';
};
const span = (start?: string, end?: string, current?: boolean) => {
  const a = fmtMonth(start);
  const b = current ? 'Present' : fmtMonth(end);
  return a || b ? `${a || '…'} – ${b || '…'}` : '';
};

export default function PortfolioPage() {
  const { user, profile, loading } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioProfile | null | undefined>(undefined);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [adding, setAdding] = useState<SectionId | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (loading || !user) return;
    apiFetch<{ portfolio: PortfolioProfile | null }>('/api/portfolio/my-portfolio')
      .then((r) => setPortfolio(r.portfolio))
      .catch((e: unknown) => setLoadError(e instanceof Error ? e.message : 'Could not load your portfolio.'));
  }, [loading, user]);

  const flash = (text: string) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const save = async (patch: Patch, done = 'Saved'): Promise<boolean> => {
    setBusy(true);
    setError('');
    try {
      const r = await apiFetch<{ portfolio: PortfolioProfile }>('/api/portfolio/my-portfolio', { method: 'PUT', body: JSON.stringify(patch) });
      setPortfolio(r.portfolio);
      flash(done);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save. Please try again.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const go = (id: SectionId, add = false) => {
    if (add) setAdding(id);
    requestAnimationFrame(() => document.getElementById(`pf-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  if (loading || (user && portfolio === undefined && !loadError)) {
    return <Frame><div className="pf-center">Loading your portfolio…</div></Frame>;
  }
  if (!user) {
    return (
      <Frame>
        <div className="pf-center">
          <div>
            <p style={{ margin: '0 0 12px' }}>Sign in to build your portfolio.</p>
            <Link href="/signin" className="pf-btn primary">Sign in</Link>
          </div>
        </div>
      </Frame>
    );
  }
  if (loadError) {
    return <Frame><div style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px' }}><div className="pf-alert">{loadError}</div></div></Frame>;
  }
  if (!portfolio) {
    return (
      <Frame>
        <CreatePortfolio
          defaults={{ displayName: profile?.name ?? '', location: profile?.city ?? '', careerFit: profile?.desiredCareer ?? '' }}
          busy={busy}
          error={error}
          onCreate={(p) => save(p, 'Your portfolio is ready')}
        />
        {toast && <div className="pf-toast" role="status">{toast}</div>}
      </Frame>
    );
  }

  const p = portfolio;
  const link = typeof window !== 'undefined' ? `${window.location.origin}/portfolio/${p.profileSlug}` : `/portfolio/${p.profileSlug}`;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      flash('Link copied');
    } catch {
      window.prompt('Copy your portfolio link:', link);
    }
  };

  const steps: { id: SectionId; label: string; done: boolean; add?: boolean; why: string }[] = [
    { id: 'about', label: 'Write a short bio', done: (p.bio || '').length >= 40, why: 'Two or three lines on who you are and what you want to do next.' },
    { id: 'education', label: 'Add your education', done: p.education.length > 0, add: true, why: 'Your school or college, class or degree, and stream.' },
    { id: 'skills', label: 'Add at least 3 skills', done: p.skills.length >= 3, why: 'Tap a suggestion or type your own.' },
    { id: 'experience', label: 'Add a project or activity', done: p.experience.length > 0, add: true, why: 'A project, internship, club role, competition or volunteering.' },
    { id: 'certifications', label: 'Add a certificate or award', done: p.certifications.length > 0, add: true, why: 'Courses you finished, olympiads, prizes.' },
    { id: 'links', label: 'Add a link', done: !!(p.linkedin || p.github || p.website || p.twitter), why: 'LinkedIn, GitHub or your own website.' },
    { id: 'sharing', label: 'Make your page public', done: p.isPublic, why: 'Then share the link with teachers, colleges and recruiters.' },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);
  const nextStep = steps.find((s) => !s.done);

  return (
    <Frame>
      <header className="pf-top">
        <div className="pf-top-in">
          <nav className="pf-crumb" aria-label="Breadcrumb">
            <Link href="/account">Dashboard</Link><span aria-hidden="true">›</span><b>Build your website</b>
          </nav>
          <div className="pf-actions">
            <span className={`pf-pill${p.isPublic ? ' on' : ''}`}>{p.isPublic ? 'Public' : 'Private'}</span>
            {p.isPublic ? (
              <>
                <button className="pf-btn" onClick={copyLink}>Copy link</button>
                <a className="pf-btn primary" href={`/portfolio/${p.profileSlug}`} target="_blank" rel="noopener noreferrer">View my page ↗</a>
              </>
            ) : (
              <button className="pf-btn primary" disabled={busy} onClick={() => save({ isPublic: true }, 'Your page is public')}>Publish my page</button>
            )}
          </div>
        </div>
      </header>

      <div className="pf-wrap">
        <aside className="pf-side">
          <div className="pf-card pf-prof">
            <div className="pf-av" aria-hidden="true">{(p.displayName || p.headline || '?').charAt(0).toUpperCase()}</div>
            <div className="pf-name">{p.displayName || 'Add your name'}</div>
            <div className="pf-head">{p.headline}</div>
            {p.location && <div className="pf-loc">{p.location}</div>}
          </div>

          <div className="pf-card pf-steps">
            <div className="pf-steps-h"><span>Your page is {pct}% ready</span><span style={{ color: '#6b7280' }}>{doneCount}/{steps.length}</span></div>
            <div className="pf-bar"><div style={{ width: `${pct}%` }} /></div>
            {steps.map((s) => (
              <button key={s.label} className={`pf-step${s.done ? ' done' : ''}`} disabled={s.done} onClick={() => go(s.id, s.add)}>
                <span className="pf-tick" aria-hidden="true">{s.done ? '✓' : ''}</span>{s.label}
              </button>
            ))}
          </div>

          <nav className="pf-card pf-nav" aria-label="Sections">
            {([['about', 'About you'], ['experience', 'Projects & experience'], ['education', 'Education'], ['certifications', 'Certificates & awards'], ['skills', 'Skills'], ['links', 'Links & contact'], ['sharing', 'Sharing & privacy']] as const).map(([id, label]) => (
              <a key={id} href={`#pf-${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{label}</a>
            ))}
          </nav>
        </aside>

        <main className="pf-main">
          {error && <div className="pf-alert" role="alert">{error}</div>}

          {nextStep ? (
            <div className="pf-card pf-next">
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <div className="pf-next-k">Next step</div>
                <div className="pf-next-t">{nextStep.label}</div>
                <div className="pf-next-n">{nextStep.why}</div>
              </div>
              {nextStep.id === 'sharing'
                ? <button className="pf-btn primary" disabled={busy} onClick={() => save({ isPublic: true }, 'Your page is public')}>Publish my page</button>
                : <button className="pf-btn primary" onClick={() => go(nextStep.id, nextStep.add)}>Do it now</button>}
            </div>
          ) : (
            <div className="pf-card pf-next" style={{ borderColor: '#bbf7d0', background: '#f6fef9' }}>
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <div className="pf-next-k" style={{ color: '#15803d' }}>All set</div>
                <div className="pf-next-t">Your page is complete and public.</div>
                <div className="pf-next-n">Keep it fresh - add new projects and certificates as you earn them.</div>
              </div>
              <button className="pf-btn primary" onClick={copyLink}>Copy my link</button>
            </div>
          )}

          <AboutSection p={p} busy={busy} onSave={save} />

          <ListSection<PortfolioExperience>
            id="experience" title="Projects & experience" adding={adding === 'experience'} onAddDone={() => setAdding(null)} busy={busy}
            sub="Projects, internships, part-time work, club roles, competitions and volunteering all count."
            addLabel="Add project or experience" emptyText="Nothing here yet. Your first school project or club role is a great start."
            items={p.experience}
            blank={() => ({ id: newId(), title: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '', skills: [] })}
            fields={[
              { key: 'title', label: 'Role or project', placeholder: 'e.g. Science fair team lead', required: true },
              { key: 'company', label: 'Organisation', placeholder: 'e.g. Your school, company or club', required: true },
              { key: 'startDate', label: 'Start', type: 'month' },
              { key: 'endDate', label: 'End', type: 'month', hide: (d) => d.currentlyWorking },
              { key: 'currentlyWorking', label: "I'm still doing this", type: 'check' },
              { key: 'location', label: 'Location', placeholder: 'Optional' },
              { key: 'description', label: 'What you did and what came of it', type: 'textarea', placeholder: 'Two or three lines. Numbers help: “built a model that…”, “raised ₹5,000 for…”' },
            ]}
            view={(x) => (
              <>
                <div className="pf-item-t">{x.title}</div>
                <div className="pf-item-s">{x.company}{x.location ? ` · ${x.location}` : ''}</div>
                {span(x.startDate, x.endDate, x.currentlyWorking) && <div className="pf-item-d">{span(x.startDate, x.endDate, x.currentlyWorking)}</div>}
                {x.description && <p className="pf-item-p">{x.description}</p>}
              </>
            )}
            onSave={(experience) => save({ experience })}
          />

          <ListSection<PortfolioEducation>
            id="education" title="Education" adding={adding === 'education'} onAddDone={() => setAdding(null)} busy={busy}
            sub="Your school or college. Add your current class or degree first."
            addLabel="Add education" emptyText="Add your school or college so visitors know where you study."
            items={p.education}
            blank={() => ({ id: newId(), institution: '', degree: '', field: '', startDate: '', endDate: '', currentlyStudying: true, description: '' })}
            fields={[
              { key: 'institution', label: 'School or college', placeholder: 'e.g. Delhi Public School, Pune', required: true },
              { key: 'degree', label: 'Class or degree', placeholder: 'e.g. Class 11 · B.Tech' },
              { key: 'field', label: 'Stream or subject', placeholder: 'e.g. Science (PCM) · Computer Science' },
              { key: 'startDate', label: 'Start', type: 'month' },
              { key: 'endDate', label: 'End', type: 'month', hide: (d) => d.currentlyStudying },
              { key: 'currentlyStudying', label: 'I study here now', type: 'check' },
              { key: 'description', label: 'Highlights', type: 'textarea', placeholder: 'Optional: marks, subjects you enjoy, positions held' },
            ]}
            view={(x) => (
              <>
                <div className="pf-item-t">{x.institution}</div>
                {(x.degree || x.field) && <div className="pf-item-s">{[x.degree, x.field].filter(Boolean).join(' · ')}</div>}
                {span(x.startDate, x.endDate, x.currentlyStudying) && <div className="pf-item-d">{span(x.startDate, x.endDate, x.currentlyStudying)}</div>}
                {x.description && <p className="pf-item-p">{x.description}</p>}
              </>
            )}
            onSave={(education) => save({ education })}
          />

          <ListSection<PortfolioCertification>
            id="certifications" title="Certificates & awards" adding={adding === 'certifications'} onAddDone={() => setAdding(null)} busy={busy}
            sub="Online courses you finished, olympiads, competitions and prizes."
            addLabel="Add certificate or award" emptyText="No certificates yet. A finished online course counts."
            items={p.certifications}
            blank={() => ({ id: newId(), name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '', credentialId: '' })}
            fields={[
              { key: 'name', label: 'Name', placeholder: 'e.g. Python for Beginners · State Science Olympiad, Silver', required: true },
              { key: 'issuer', label: 'Given by', placeholder: 'e.g. Coursera · NCERT · your school' },
              { key: 'issueDate', label: 'Month received', type: 'month' },
              { key: 'credentialId', label: 'Certificate ID', placeholder: 'Optional' },
              { key: 'credentialUrl', label: 'Link to the certificate', type: 'url', placeholder: 'Optional · https://…', wide: true },
            ]}
            view={(x) => (
              <>
                <div className="pf-item-t">{x.name}</div>
                {(x.issuer || x.issueDate) && <div className="pf-item-s">{[x.issuer, fmtMonth(x.issueDate)].filter(Boolean).join(' · ')}</div>}
                {x.credentialUrl && <a className="pf-item-d" href={x.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>View certificate ↗</a>}
              </>
            )}
            onSave={(certifications) => save({ certifications })}
          />

          <SkillsSection p={p} busy={busy} onSave={(skills) => save({ skills })} />
          <LinksSection p={p} busy={busy} onSave={save} />
          <SharingSection p={p} busy={busy} link={link} onSave={save} onCopy={copyLink} />
        </main>
      </div>
      {toast && <div className="pf-toast" role="status">{toast}</div>}
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="pf">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {children}
    </div>
  );
}

function Section({ id, title, sub, action, children }: { id: SectionId; title: string; sub?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section id={`pf-${id}`} className="pf-card pf-sec" aria-labelledby={`pf-${id}-h`}>
      <div className="pf-sec-h"><h2 id={`pf-${id}-h`}>{title}</h2>{action}</div>
      {sub ? <p className="pf-sec-sub">{sub}</p> : <div style={{ height: 12 }} />}
      {children}
    </section>
  );
}

/* ---------------- About ---------------- */

function AboutSection({ p, busy, onSave }: { p: PortfolioProfile; busy: boolean; onSave: (patch: Patch) => Promise<boolean> }) {
  const [editing, setEditing] = useState(false);
  const [d, setD] = useState({ displayName: '', headline: '', location: '', careerFit: '', bio: '' });
  const [err, setErr] = useState('');
  const start = () => {
    setD({ displayName: p.displayName ?? '', headline: p.headline ?? '', location: p.location ?? '', careerFit: p.careerFit ?? '', bio: p.bio ?? '' });
    setErr('');
    setEditing(true);
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!d.headline.trim()) return setErr('Add a headline.');
    if (await onSave(d)) setEditing(false);
  };
  return (
    <Section id="about" title="About you" action={!editing && <button className="pf-btn link" onClick={start}>Edit</button>}>
      {editing ? (
        <form className="pf-form" onSubmit={submit}>
          <label className="pf-f">Your name<input value={d.displayName} onChange={(e) => setD({ ...d, displayName: e.target.value })} maxLength={80} placeholder="As you want it shown" /></label>
          <label className="pf-f">Location<input value={d.location} onChange={(e) => setD({ ...d, location: e.target.value })} maxLength={80} placeholder="e.g. Hyderabad, India" /></label>
          <label className="pf-f wide">Headline<input value={d.headline} onChange={(e) => setD({ ...d, headline: e.target.value })} maxLength={120} placeholder="e.g. Class 11 Science student · Aspiring data scientist" /></label>
          <label className="pf-f wide">Career I'm aiming for<input value={d.careerFit} onChange={(e) => setD({ ...d, careerFit: e.target.value })} maxLength={80} placeholder="e.g. Data Scientist" /></label>
          <label className="pf-f wide">Bio<textarea value={d.bio} onChange={(e) => setD({ ...d, bio: e.target.value })} maxLength={1500} rows={4} placeholder="Who you are, what you enjoy, and what you want to do next." /></label>
          {err && <div className="pf-err">{err}</div>}
          <div className="pf-form-a">
            <button className="pf-btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button type="button" className="pf-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <div className="pf-item-t">{p.headline}</div>
          {p.careerFit && <div className="pf-item-s">Aiming for: <b>{p.careerFit}</b></div>}
          {p.bio ? <p className="pf-item-p" style={{ margin: 0 }}>{p.bio}</p> : <div className="pf-empty">No bio yet.<button className="pf-btn primary" onClick={start}>Write your bio</button></div>}
        </div>
      )}
    </Section>
  );
}

/* ---------------- Repeating lists (experience, education, certificates) ---------------- */

interface Field<T> {
  key: keyof T & string;
  label: string;
  type?: 'text' | 'textarea' | 'month' | 'check' | 'url';
  placeholder?: string;
  required?: boolean;
  wide?: boolean;
  hide?: (draft: T) => boolean;
}

function ListSection<T extends { id: string }>({
  id, title, sub, addLabel, emptyText, items, blank, fields, view, onSave, busy, adding, onAddDone,
}: {
  id: SectionId; title: string; sub: string; addLabel: string; emptyText: string;
  items: T[]; blank: () => T; fields: Field<T>[]; view: (item: T) => ReactNode;
  onSave: (items: T[]) => Promise<boolean>; busy: boolean; adding: boolean; onAddDone: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null); // an item id, or "new"
  const [draft, setDraft] = useState<T | null>(null);
  const [err, setErr] = useState('');
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const startNew = () => { setDraft(blank()); setEditing('new'); setErr(''); };
  // "Do it now" / the checklist open this list's add form.
  useEffect(() => {
    if (adding) { startNew(); onAddDone(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adding]);

  const close = () => { setEditing(null); setDraft(null); setErr(''); };
  const set = (key: keyof T, value: unknown) => setDraft((d) => (d ? { ...d, [key]: value } : d));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const missing = fields.find((f) => f.required && !String(draft[f.key] ?? '').trim());
    if (missing) return setErr(`Add the ${missing.label.toLowerCase()}.`);
    const next = editing === 'new' ? [...items, draft] : items.map((i) => (i.id === editing ? draft : i));
    if (await onSave(next)) close();
  };

  const form = draft && (
    <form className="pf-form" onSubmit={submit}>
      {fields.filter((f) => !f.hide?.(draft)).map((f) => {
        const value = draft[f.key] as unknown;
        if (f.type === 'check') {
          return (
            <label key={f.key} className="pf-f pf-check">
              <input type="checkbox" checked={!!value} onChange={(e) => set(f.key, e.target.checked)} />{f.label}
            </label>
          );
        }
        return (
          <label key={f.key} className={`pf-f${f.type === 'textarea' || f.wide ? ' wide' : ''}`}>
            {f.label}{f.required ? ' *' : ''}
            {f.type === 'textarea'
              ? <textarea value={String(value ?? '')} placeholder={f.placeholder} rows={3} maxLength={1000} onChange={(e) => set(f.key, e.target.value)} />
              : <input type={f.type === 'month' ? 'month' : f.type === 'url' ? 'url' : 'text'} value={String(value ?? '')} placeholder={f.placeholder} maxLength={200} onChange={(e) => set(f.key, e.target.value)} />}
          </label>
        );
      })}
      {err && <div className="pf-err">{err}</div>}
      <div className="pf-form-a">
        <button className="pf-btn primary" disabled={busy}>{busy ? 'Saving…' : editing === 'new' ? 'Add' : 'Save changes'}</button>
        <button type="button" className="pf-btn" onClick={close}>Cancel</button>
      </div>
    </form>
  );

  return (
    <Section id={id} title={title} sub={sub} action={editing !== 'new' && items.length > 0 && <button className="pf-btn" onClick={startNew}>+ {addLabel}</button>}>
      {items.length === 0 && editing !== 'new' && (
        <div className="pf-empty">{emptyText}<button className="pf-btn primary" onClick={startNew}>+ {addLabel}</button></div>
      )}
      {items.map((item) => (
        <div key={item.id}>
          {editing === item.id ? form : (
            <div className="pf-item">
              <div className="pf-item-b">{view(item)}</div>
              <div className="pf-item-a">
                {confirmDel === item.id ? (
                  <>
                    <button className="pf-btn link danger" disabled={busy} onClick={async () => { if (await onSave(items.filter((i) => i.id !== item.id))) setConfirmDel(null); }}>Delete</button>
                    <button className="pf-btn link" onClick={() => setConfirmDel(null)}>Keep</button>
                  </>
                ) : (
                  <>
                    <button className="pf-btn link" onClick={() => { setDraft({ ...item }); setEditing(item.id); setErr(''); }}>Edit</button>
                    <button className="pf-btn link danger" onClick={() => setConfirmDel(item.id)}>Remove</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {editing === 'new' && form}
    </Section>
  );
}

/* ---------------- Skills ---------------- */

const SKILL_SUGGESTIONS = ['Communication', 'Teamwork', 'Problem solving', 'Public speaking', 'Leadership', 'MS Excel', 'Python', 'Creative writing', 'Graphic design', 'Time management'];

function SkillsSection({ p, busy, onSave }: { p: PortfolioProfile; busy: boolean; onSave: (skills: PortfolioSkill[]) => Promise<boolean> }) {
  const [name, setName] = useState('');
  const has = (n: string) => p.skills.some((s) => s.name.toLowerCase() === n.trim().toLowerCase());
  const add = async (n: string) => {
    const clean = n.trim();
    if (!clean || has(clean)) { setName(''); return; }
    if (await onSave([...p.skills, { id: newId(), name: clean, endorsements: 0, category: 'other' }])) setName('');
  };
  const suggestions = SKILL_SUGGESTIONS.filter((s) => !has(s)).slice(0, 6);
  return (
    <Section id="skills" title="Skills" sub="Add what you can actually do. Aim for 5 to 10.">
      {p.skills.length > 0 && (
        <div className="pf-chips" style={{ marginBottom: 14 }}>
          {p.skills.map((s) => (
            <span key={s.id} className="pf-chip">{s.name}
              <button aria-label={`Remove ${s.name}`} disabled={busy} onClick={() => onSave(p.skills.filter((x) => x.id !== s.id))}>×</button>
            </span>
          ))}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); add(name); }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div className="pf-f" style={{ flex: '1 1 220px' }}>
          <input aria-label="New skill" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Type a skill and press Enter" />
        </div>
        <button className="pf-btn primary" disabled={busy || !name.trim()}>Add skill</button>
      </form>
      {suggestions.length > 0 && (
        <div className="pf-chips" style={{ marginTop: 12 }}>
          <span style={{ fontSize: 12.5, color: '#6b7280', alignSelf: 'center' }}>Quick add:</span>
          {suggestions.map((s) => <button key={s} className="pf-sugg" disabled={busy} onClick={() => add(s)}>+ {s}</button>)}
        </div>
      )}
    </Section>
  );
}

/* ---------------- Links & contact ---------------- */

function LinksSection({ p, busy, onSave }: { p: PortfolioProfile; busy: boolean; onSave: (patch: Patch) => Promise<boolean> }) {
  const initial = () => ({ linkedin: p.linkedin ?? '', github: p.github ?? '', website: p.website ?? '', twitter: p.twitter ?? '', email: p.email ?? '', phone: p.phone ?? '' });
  const [d, setD] = useState(initial);
  // Show the saved values once a save returns (links come back with https://).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setD(initial()), [p.linkedin, p.github, p.website, p.twitter, p.email, p.phone]);
  const changed = JSON.stringify(d) !== JSON.stringify(initial());
  const field = (key: keyof typeof d, label: string, placeholder: string, type = 'text') => (
    <label className="pf-f">{label}<input type={type} value={d[key]} placeholder={placeholder} maxLength={200} onChange={(e) => setD({ ...d, [key]: e.target.value })} /></label>
  );
  return (
    <Section id="links" title="Links & contact" sub="Links show on your public page. Email and phone stay hidden unless you switch them on under Sharing.">
      <form className="pf-form" style={{ marginTop: 0 }} onSubmit={async (e) => { e.preventDefault(); await onSave(d); }}>
        {field('linkedin', 'LinkedIn', 'linkedin.com/in/your-name')}
        {field('github', 'GitHub', 'github.com/your-name')}
        {field('website', 'Website or blog', 'yourname.com')}
        {field('twitter', 'X (Twitter)', 'x.com/your-name')}
        {field('email', 'Email', 'you@example.com', 'email')}
        {field('phone', 'Phone', '+91 …', 'tel')}
        <div className="pf-form-a">
          <button className="pf-btn primary" disabled={busy || !changed}>{busy ? 'Saving…' : 'Save links'}</button>
          {changed && <button type="button" className="pf-btn" onClick={() => setD(initial())}>Undo changes</button>}
        </div>
      </form>
    </Section>
  );
}

/* ---------------- Sharing & privacy ---------------- */

function SharingSection({ p, busy, link, onSave, onCopy }: { p: PortfolioProfile; busy: boolean; link: string; onSave: (patch: Patch, done?: string) => Promise<boolean>; onCopy: () => void }) {
  const toggle = (key: 'isPublic' | 'showEmail' | 'showPhone', title: string, text: string) => (
    <label className="pf-toggle">
      <input type="checkbox" checked={!!p[key]} disabled={busy} onChange={(e) => onSave({ [key]: e.target.checked })} />
      <div><b>{title}</b><span>{text}</span></div>
    </label>
  );
  return (
    <Section id="sharing" title="Sharing & privacy">
      {toggle('isPublic', 'Make my page public', 'Anyone with the link can see your page. Switch off any time to hide it again.')}
      {toggle('showEmail', 'Show my email', p.email ? `Shows ${p.email} on your public page.` : 'Add an email under Links & contact first.')}
      {toggle('showPhone', 'Show my phone number', p.phone ? `Shows ${p.phone} on your public page.` : 'Add a phone number under Links & contact first.')}
      {p.isPublic && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 12, padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <code style={{ flex: '1 1 240px', minWidth: 0, fontSize: 12.5, color: '#374151', overflowWrap: 'anywhere' }}>{link}</code>
          <button className="pf-btn" onClick={onCopy}>Copy</button>
        </div>
      )}
    </Section>
  );
}

/* ---------------- First visit ---------------- */

function CreatePortfolio({ defaults, busy, error, onCreate }: {
  defaults: { displayName: string; location: string; careerFit: string };
  busy: boolean; error: string; onCreate: (p: Patch) => Promise<boolean>;
}) {
  const [d, setD] = useState({ ...defaults, headline: '', bio: '' });
  const [err, setErr] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!d.headline.trim()) return setErr('Add a headline - one line about you.');
    if (d.bio.trim().length < 20) return setErr('Write at least a sentence or two in your bio.');
    setErr('');
    await onCreate(d);
  };
  return (
    <>
      <header className="pf-top">
        <div className="pf-top-in">
          <nav className="pf-crumb" aria-label="Breadcrumb"><Link href="/account">Dashboard</Link><span aria-hidden="true">›</span><b>Build your website</b></nav>
        </div>
      </header>
      <div className="pf-create">
        <div>
          <h1>Your own page, in five minutes</h1>
          <p>One link you can send to teachers, colleges, internship recruiters and scholarship panels - with your projects, skills and certificates in one place.</p>
          <ul>
            <li><span>1</span>Tell us who you are (this form).</li>
            <li><span>2</span>Add your education, skills and a project.</li>
            <li><span>3</span>Publish and share your link. It stays private until you do.</li>
          </ul>
        </div>
        <form className="pf-card pf-form" style={{ background: '#fff', padding: 20, marginTop: 0 }} onSubmit={submit}>
          <label className="pf-f">Your name<input value={d.displayName} onChange={(e) => setD({ ...d, displayName: e.target.value })} maxLength={80} /></label>
          <label className="pf-f">Location<input value={d.location} onChange={(e) => setD({ ...d, location: e.target.value })} maxLength={80} placeholder="e.g. Hyderabad, India" /></label>
          <label className="pf-f wide">Headline *<input value={d.headline} onChange={(e) => setD({ ...d, headline: e.target.value })} maxLength={120} placeholder={`e.g. Class 10 student · Aspiring ${defaults.careerFit || 'engineer'}`} /></label>
          <label className="pf-f wide">Career I'm aiming for<input value={d.careerFit} onChange={(e) => setD({ ...d, careerFit: e.target.value })} maxLength={80} placeholder="e.g. Doctor, Designer, Data Scientist" /></label>
          <label className="pf-f wide">Bio *<textarea value={d.bio} onChange={(e) => setD({ ...d, bio: e.target.value })} maxLength={1500} rows={4} placeholder="Two or three lines: what you enjoy, what you're good at, and what you want to do next." /></label>
          {(err || error) && <div className="pf-err">{err || error}</div>}
          <div className="pf-form-a">
            <button className="pf-btn primary" disabled={busy}>{busy ? 'Creating…' : 'Create my page'}</button>
            <span style={{ fontSize: 12.5, color: '#6b7280' }}>Private until you publish it.</span>
          </div>
        </form>
      </div>
    </>
  );
}
