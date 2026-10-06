"use client";

/**
 * /institution/guide - one page explaining every part of the portal, what
 * students and parents see, and how messages and data move between the
 * school, its students, their parents and OneGrasp.
 */
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { usePortal } from "@/components/institution/portalStore";

const FEATURES: { href: string; icon: string; title: string; what: string; how: string[] }[] = [
  { href: "/institution", icon: "radar", title: "Overview", what: "The whole institution at a glance: how many students finished the assessment, who is active, time spent, and the students who need a nudge.", how: ["Check it once a week.", "Use the 'Needs a nudge' list to send reminders in one click."] },
  { href: "/institution/students", icon: "users", title: "Students", what: "Every linked student with their status, best-fit career, time spent and progress. Open a student for their full profile: report, activity by day, courses, Career GPS, test-drives, decisions and conversation with you.", how: ["Search or filter by class and status.", "Open a student and use 'Message' to write to just them.", "Students appear here when their profile names your institution - share your registration link so new students are linked automatically."] },
  { href: "/institution/parents", icon: "heart", title: "Parents", what: "A private family link per student. Parents answer a 2-minute survey about their hopes; you see where parents and child agree or differ. The same link shows parents the child's decision sheet and weekly progress.", how: ["Create a link and share it on WhatsApp or SMS.", "Review 'Conflict' students first - those families need a conversation.", "Optional: automated voice calls in the parents' language."] },
  { href: "/institution/observations", icon: "check", title: "Teacher check", what: "Teachers rate what they observe in class; OneGrasp compares it with the test and flags differences.", how: ["Rate a student on the listed traits.", "A big gap is a prompt to talk to the student, not a verdict."] },
  { href: "/institution/passport", icon: "award", title: "Career Passport", what: "Students add achievements with proof (projects, certificates, competitions). You verify them; verified ones appear on the student's public, QR-checkable passport.", how: ["The red badge in the menu counts milestones waiting for you.", "Verify or reject with a short note - the student sees it."] },
  { href: "/institution/messages", icon: "bell", title: "Messages", what: "Messages, reminders, alerts and recommendations to all students, a class, or chosen students, optionally also by email. You see who opened each one and who followed its button.", how: ["Pick the audience, write, add a button to a page in the app, send.", "Use {name} to insert each student's first name.", "Students can reply - see 'Student replies'."] },
  { href: "/institution/replies", icon: "answer", title: "Student replies", what: "Conversations started when students reply to your messages.", how: ["The red badge shows unread replies (updates every minute).", "Open a conversation, answer, and the student sees it under your message as 'New reply'."] },
  { href: "/institution/decisions", icon: "signpost", title: "Decision briefs", what: "A personal one-page brief for each student about the big decision their class faces (stream, exams, course, college), with their fits and the exam dates that matter.", how: ["Preview a brief, then send to a whole class."] },
  { href: "/institution/opportunities", icon: "target", title: "Opportunities", what: "Olympiads, hackathons, internships and scholarships sent only to students whose career areas match. Students tap 'I applied'; you record outcomes.", how: ["Add the opportunity with its link and deadline, choose classes and areas, and see who it will reach before sending."] },
  { href: "/institution/mentors", icon: "route", title: "Peer mentors", what: "Seniors matched with juniors who are heading into the same career area.", how: ["Accept suggested pairs; both students get a message introducing them."] },
  { href: "/institution/journeys", icon: "compass", title: "Career journeys", what: "OneGrasp's signature tools across the school: Career GPS points and streaks, Career Test-Drives and enjoyment scores, and Family Decision Room choices with parents' answers.", how: ["Nudge students at 0 points.", "Call families whose parents chose 'Let's discuss'."] },
  { href: "/institution/life-skills", icon: "shield", title: "Life skills", what: "Progress in Money skills and Legal rights - counts only, never a student's individual answers.", how: ["Spot classes that haven't started and send them a reminder."] },
  { href: "/institution/future", icon: "sparkle", title: "Future skills", what: "Where your students' chosen careers are heading by 2035, which roles AI will reshape most, and the skills to start building now.", how: ["Use it to plan workshops and clubs."] },
  { href: "/institution/onegrasp", icon: "help", title: "Ask OneGrasp", what: "Notices from OneGrasp and your direct conversations with the OneGrasp team.", how: ["Ask anything - OneGrasp answers here, with a badge in the menu."] },
];

const SYNC: { from: string; to: string; what: string }[] = [
  { from: "You (Messages)", to: "Students", what: "Appears in 'Messages from your school' on the student's dashboard, newest and alerts first; you see 'opened' and 'clicked'." },
  { from: "Students", to: "You (Student replies)", what: "A student's reply lands in Student replies with a red badge; your answer appears under the message in their inbox as 'New reply'." },
  { from: "OneGrasp", to: "Students", what: "OneGrasp can message students directly; those messages show as 'from OneGrasp' in the same inbox." },
  { from: "OneGrasp", to: "You (Ask OneGrasp)", what: "Notices and answers appear on the Ask OneGrasp page with a badge in the menu." },
  { from: "You (Ask OneGrasp)", to: "OneGrasp", what: "Your conversation appears in OneGrasp's admin Messages inbox; they reply from there." },
  { from: "Students' activity", to: "You (Students, Overview)", what: "Time spent, lessons, goals, GPS, test-drives and decisions update as students use the app - press Refresh in the top bar for the latest." },
  { from: "Parents (family link)", to: "You and the student", what: "Survey answers appear on Parents; 'We agree' / 'Let's discuss' appears on the student's Decision Room and on Career journeys." },
  { from: "Students (Career Passport)", to: "You (Career Passport)", what: "New milestones wait for you with a badge; your verification shows on the student's passport immediately." },
];

export default function GuidePage() {
  const { me } = usePortal();
  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Guide</h1>
          <p className="ip-sub">Everything {me.institution.name}&apos;s portal does, what your students and parents see, and how it all stays in sync. Every page also has a &ldquo;How this works&rdquo; box at the top.</p>
        </div>
      </div>

      <section className="ip-card ip-sec" style={{ marginBottom: 12 }}>
        <div className="ip-sec-h"><Icon name="rocket" size={16} stroke={2} style={{ color: "var(--accent)" }} /><h2>Getting started in 4 steps</h2></div>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li><b>Link your students.</b> Students whose profile names your institution appear automatically - spelling and capitals don&apos;t matter. Missing someone? Ask OneGrasp to add the spelling as an alias.</li>
          <li><b>Send a welcome message</b> from <Link href="/institution/messages">Messages</Link> pointing students to their assessment and Career GPS.</li>
          <li><b>Share family links</b> from <Link href="/institution/parents">Parents</Link> so parents can answer the survey and follow their child&apos;s decisions.</li>
          <li><b>Check weekly:</b> Overview for who needs a nudge, Student replies and Career Passport for anything waiting on you (red badges), Career journeys for families to call.</li>
        </ol>
      </section>

      <section className="ip-card ip-sec" style={{ marginBottom: 12 }}>
        <div className="ip-sec-h"><Icon name="layers" size={16} stroke={2} style={{ color: "var(--accent)" }} /><h2>How everything stays in sync</h2></div>
        <div className="ip-table-wrap"><table className="ip-table">
          <thead><tr><th>From</th><th>To</th><th>What happens</th></tr></thead>
          <tbody>{SYNC.map((s) => <tr key={s.from + s.to}><td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{s.from}</td><td style={{ whiteSpace: "nowrap" }}>{s.to}</td><td style={{ lineHeight: 1.5 }}>{s.what}</td></tr>)}</tbody>
        </table></div>
        <p className="ip-muted" style={{ marginTop: 10 }}>Privacy: you only ever see students linked to {me.institution.name}. You see progress, time and results - never a student&apos;s individual answers to the assessment, money or legal exercises.</p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
        {FEATURES.map((f) => (
          <section key={f.href} className="ip-card ip-sec">
            <div className="ip-sec-h"><Icon name={f.icon} size={16} stroke={2} style={{ color: "var(--accent)" }} /><h2>{f.title}</h2><Link className="ip-muted" style={{ marginLeft: "auto", fontSize: 12.5 }} href={f.href}>Open →</Link></div>
            <p style={{ margin: "0 0 8px", lineHeight: 1.6 }}>{f.what}</p>
            <ul className="ip-muted" style={{ margin: 0, paddingLeft: 18 }}>{f.how.map((h) => <li key={h}>{h}</li>)}</ul>
          </section>
        ))}
      </div>

      <section className="ip-card ip-sec" style={{ marginTop: 12 }}>
        <div className="ip-sec-h"><Icon name="user" size={16} stroke={2} style={{ color: "var(--accent)" }} /><h2>What your students see</h2></div>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li><b>Dashboard inbox</b> - your messages and OneGrasp&apos;s, with a reply box under each.</li>
          <li><b>Career GPS</b> (/account/gps) - three missions a week that tick themselves off, points and a streak.</li>
          <li><b>Career Test-Drive</b> (/account/test-drive) - a day in a career, five real moments, an honest summary.</li>
          <li><b>Family Decision Room</b> (/account/decision-room) - two paths side by side, a choice, and the parents&apos; answer.</li>
          <li><b>Career Passport</b> (/account/passport) - achievements with proof, verified by you.</li>
        </ul>
      </section>
    </>
  );
}
