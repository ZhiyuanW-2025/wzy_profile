"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref, type FormEvent } from "react";
import { cityVisitor as config } from "@/content/city-visitor";
import { referenceCity as city } from "@/content/reference-city";
import { helicopterPosition } from "@/content/city-paths";

export type VisitorEntryHandle = { update: (time: number) => void; focus: () => void };

export function HelicopterEntry({ motionRef, disabled, onOpen, onHover, onReveal }: {
  motionRef: Ref<VisitorEntryHandle>; disabled: boolean;
  onOpen: () => void; onHover: (hovered: boolean) => void; onReveal: (box: readonly number[]) => void;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const time = useRef(0);
  useImperativeHandle(motionRef, () => ({
    focus: () => button.current?.focus({ preventScroll: true }),
    update: (next) => {
      time.current = next;
      const node = button.current, p = helicopterPosition(next, city.width);
      if (!node) return;
      node.style.left = `${p.x}px`; node.style.top = `${p.y}px`;
    },
  }), []);
  const initial = helicopterPosition(0, city.width);
  return <button ref={button} type="button" className="rc-helicopter-entry" disabled={disabled}
    style={{ left: initial.x, top: initial.y }}
    aria-label={config.invitation} aria-haspopup="dialog" aria-controls="city-visitor-dialog"
    onClick={onOpen} onPointerEnter={() => onHover(true)} onPointerLeave={() => onHover(false)}
    onFocus={event => {
      onHover(true);
      if (event.currentTarget.matches(":focus-visible")) {
        const p = helicopterPosition(time.current, city.width); onReveal([p.x - 65, p.y - 30, 130, 130]);
      }
    }} onBlur={() => onHover(false)}>
    <span className="rc-visitor-invitation" aria-hidden="true"><i>＋</i>{config.invitation}<b>↗</b></span>
  </button>;
}

export function VisitorDialog({ open, onClose, onArrive }: {
  open: boolean; onClose: () => void; onArrive: (emoji: string, demo: boolean) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [emoji, setEmoji] = useState(config.emojis[0].value);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [service, setService] = useState<{ configured: boolean; localDemo: boolean } | null>(null);
  const submitting = useRef(false), submission = useRef("");
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!open) { node?.close(); return; }
    node?.showModal();
    const check = new AbortController();
    fetch("/api/visitors", { signal: check.signal }).then(r => r.ok ? r.json() : null).then(value => {
      if (value && typeof value === "object" && "configured" in value && typeof value.configured === "boolean") {
        setService({ configured: value.configured, localDemo: "localDemo" in value && value.localDemo === true });
      }
    }).catch(() => { /* The POST reports any actual sending failure. */ });
    return () => { check.abort(); node?.close(); };
  }, [open]);
  useEffect(() => () => controller.current?.abort(), []);
  const revise = () => { submission.current = ""; setError(""); };
  const complete = (demo: boolean) => {
    // Close before returning focus to the world. Native dialog restoration must
    // not re-focus/freeze the helicopter after the parachute has taken off.
    dialog.current?.close();
    onArrive(emoji, demo);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || !name.trim() || !message.trim()) return;
    submitting.current = true; setBusy(true); setError("");
    submission.current ||= crypto.randomUUID();
    const abort = new AbortController(); controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 17_000);
    try {
      const response = await fetch("/api/visitors", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: abort.signal,
        body: JSON.stringify({ name: name.trim(), emoji, message: message.trim(), submissionId: submission.current, website: new FormData(event.currentTarget).get("website") }),
      });
      const result = await response.json() as { status?: string; error?: string };
      if (!response.ok || result.status !== "accepted") throw new Error(result.error || "留言暂未发送，请稍后重试。");
      complete(false); setName(""); setMessage(""); submission.current = "";
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "AbortError" ? cause.message : "暂时无法确认发送结果，请重试；内容已保留。");
    } finally {
      window.clearTimeout(timeout); submitting.current = false; setBusy(false);
    }
  };

  return <dialog ref={dialog} id="city-visitor-dialog" className="rc-visitor-dialog" aria-labelledby="visitor-title"
    onCancel={event => { event.preventDefault(); if (!submitting.current) onClose(); }}
    onClick={event => { if (event.target === event.currentTarget && !submitting.current) onClose(); }}>
    <div className="rc-visitor-panel">
      <header><span>空中来信 <small>VISITOR CHANNEL</small></span><button type="button" aria-label="关闭留言窗口" onClick={onClose} disabled={busy}>×</button></header>
      <div className="rc-visitor-intro"><span aria-hidden="true">{emoji}</span><div><h2 id="visitor-title">{config.title}</h2><p>{config.introduction}</p></div></div>
      <form onSubmit={submit}>
        <div className="rc-name-field">
          <label className="rc-message-label" htmlFor="visitor-name">01 / {config.nameLabel}</label>
          <input id="visitor-name" name="name" autoComplete="nickname" required maxLength={config.maxNameLength} disabled={busy}
            value={name} onChange={event => { setName(event.target.value); revise(); }} placeholder={config.namePlaceholder} aria-describedby="visitor-privacy visitor-feedback" />
        </div>
        <fieldset disabled={busy} className="rc-emoji-field"><legend>02 / {config.moodLabel}</legend>
          <div className="rc-emoji-grid">{config.emojis.map(item => <button key={item.value} type="button" aria-label={item.label}
            aria-pressed={emoji === item.value} onClick={() => { setEmoji(item.value); revise(); }}>{item.value}</button>)}</div>
        </fieldset>
        <label className="rc-message-label" htmlFor="visitor-message">03 / {config.messageLabel} <small>{message.length} / {config.maxLength}</small></label>
        <textarea id="visitor-message" name="message" required maxLength={config.maxLength} rows={3} disabled={busy}
          value={message} onChange={event => { setMessage(event.target.value); revise(); }} placeholder="比如：下次想在这座城里开一家什么小店？" aria-describedby="visitor-privacy visitor-feedback" />
        <div className="rc-visitor-honeypot" aria-hidden="true"><label>网站<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <p className="rc-visitor-privacy" id="visitor-privacy">{config.privacy}</p>
        <div id="visitor-feedback" className="rc-visitor-feedback" role="status" aria-live="polite">
          {error || (service && !service.configured ? "留言通道尚未接通，暂时无法发送。" : busy ? "正在发送，请稍候…" : "")}
        </div>
        <button className="rc-visitor-submit" type="submit" disabled={busy || !name.trim() || !message.trim() || service?.configured === false}>
          <span>{busy ? "正在发送…" : "发送留言，降落城市"}</span><b aria-hidden="true">↗</b>
        </button>
        {service?.localDemo && !service.configured && <button className="rc-visitor-demo" type="button" disabled={busy || !name.trim() || !message.trim()}
          onClick={() => complete(true)}>本地体验跳伞 · 不发送留言</button>}
      </form>
      <footer><span>ESC 关闭</span></footer>
    </div>
  </dialog>;
}
