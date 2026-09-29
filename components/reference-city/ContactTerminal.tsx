import { useEffect, useRef, useState } from "react";
import { contactTerminal as contact } from "@/content/contact-terminal";

export function ContactTerminal() {
  const [feedback, setFeedback] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy(label: string, value: string) {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setFeedback(`${label}已复制`);
    } catch {
      setFeedback("暂时无法自动复制，请选中文字手动复制。");
    }
    timer.current = setTimeout(() => setFeedback(""), 4000);
  }

  return <div className="dossier-body contact-terminal">
    <h3>{contact.title}</h3>
    <p className="ct-subtitle">{contact.subtitle}</p>
    <div className="ct-channels">
      {contact.channels.map(channel => <div className="ct-row" key={channel.id}>
        <div className="ct-label"><ContactIcon kind={channel.id} /><span>{channel.label}</span></div>
        <div className="ct-value-actions">
          <button className="ct-copy" type="button" aria-label={`复制${channel.label}：${channel.value}`} title="点击复制" onClick={() => copy(channel.label, channel.value)}><span>{channel.value}</span><ContactIcon kind="copy" /></button>
          {channel.id === "email" && <a className="ct-mail" href={`mailto:${channel.value}`} aria-label="打开邮件应用，发送邮件" title="发送邮件"><ContactIcon kind="send" /></a>}
        </div>
      </div>)}
    </div>
    <footer className="ct-footer"><span className="ct-online"><i aria-hidden="true" />STATUS: ONLINE</span><span className="ct-hint">点击信息复制 · ↗ 发送邮件</span></footer>
    <p className="ct-feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
  </div>;
}

function ContactIcon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    phone: "M5 2h10v16H5zM8 5h4M9 15h2",
    email: "M2 4h16v12H2zM2 5l8 6 8-6",
    copy: "M7 7h10v11H7zM13 7V2H2v11h5",
    send: "M4 16 16 4M6 4h10v10",
  };
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={paths[kind]} /></svg>;
}
