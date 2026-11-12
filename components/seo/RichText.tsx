import { Fragment } from "react";
import type { Block } from "@/lib/blog";

/** "[text](/path)" and "**bold**" inside a line of article text. Internal links stay on the site; outside ones open in a new tab. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((s, i) => {
        const link = s.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const ext = /^https?:/.test(link[2]);
          return <a key={i} href={link[2]} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>{link[1]}</a>;
        }
        const bold = s.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        return <Fragment key={i}>{s}</Fragment>;
      })}
    </>
  );
}

export function Blocks({ body }: { body: Block[] }) {
  return (
    <>
      {body.map((b, i) => {
        if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
        if ("h3" in b) return <h3 key={i}>{b.h3}</h3>;
        if ("p" in b) return <p key={i}><Inline text={b.p} /></p>;
        if ("ul" in b) return <ul key={i}>{b.ul.map((x, j) => <li key={j}><Inline text={x} /></li>)}</ul>;
        if ("ol" in b) return <ol key={i}>{b.ol.map((x, j) => <li key={j}><Inline text={x} /></li>)}</ol>;
        return <div key={i} className="pub-tip"><p><Inline text={b.tip} /></p></div>;
      })}
    </>
  );
}
