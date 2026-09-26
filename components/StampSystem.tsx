"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type StampId = "city" | "puzzle" | "agent";

type StampContextValue = {
  stamps: StampId[];
  award: (id: StampId) => void;
};

const STAMP_KEY = "zhiyuan-portfolio-stamps-v1";
const DISMISSED_KEY = "zhiyuan-portfolio-stamp-complete-dismissed";
const StampContext = createContext<StampContextValue | null>(null);

const stampLabels: Record<StampId, string> = {
  city: "城市探索",
  puzzle: "解谜",
  agent: "AI 协作",
};

export function StampProvider({ children }: { children: React.ReactNode }) {
  const [stamps, setStamps] = useState<StampId[]>([]);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STAMP_KEY) || "[]") as StampId[];
      setStamps(saved.filter((item) => item in stampLabels));
      setDismissed(window.localStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      setStamps([]);
    }
    setReady(true);
  }, []);

  const award = useCallback((id: StampId) => {
    setStamps((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      window.localStorage.setItem(STAMP_KEY, JSON.stringify(next));
      if (next.length === 3) {
        window.localStorage.removeItem(DISMISSED_KEY);
        setDismissed(false);
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ stamps, award }), [stamps, award]);

  const close = () => {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <StampContext.Provider value={value}>
      {children}
      {ready && <StampCounter stamps={stamps} />}
      {ready && stamps.length === 3 && !dismissed && (
        <div className="completion-backdrop" role="presentation" onMouseDown={close}>
          <section
            className="completion-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={close} aria-label="关闭">
              ×
            </button>
            <div className="completion-mark" aria-hidden="true">完成</div>
            <p className="eyebrow">3 / 3 · 探索完成</p>
            <h2 id="completion-title">探索完成</h2>
            <p>你已经体验了我最想展示的三个产品能力：</p>
            <ul>
              <li>用户体验</li>
              <li>商业落地</li>
              <li>AI 产品设计</li>
            </ul>
            <div className="button-row">
              <Link className="button dark" href="/about">查看简历</Link>
              <a className="button light" href="mailto:your-email@example.com">联系我</a>
            </div>
          </section>
        </div>
      )}
    </StampContext.Provider>
  );
}

function StampCounter({ stamps }: { stamps: StampId[] }) {
  return (
    <aside className="stamp-counter" aria-label={`探索印章 ${stamps.length} / 3`}>
      <span className="stamp-counter-number">{stamps.length} / 3</span>
      <span className="stamp-counter-label">探索</span>
      <div className="stamp-dots" aria-hidden="true">
        {(Object.keys(stampLabels) as StampId[]).map((id) => (
          <span key={id} className={stamps.includes(id) ? "collected" : ""} />
        ))}
      </div>
      <div className="stamp-tooltip">
        {(Object.keys(stampLabels) as StampId[]).map((id) => (
          <p key={id} className={stamps.includes(id) ? "collected" : ""}>
            {stamps.includes(id) ? "✓" : "○"} {stampLabels[id]}
          </p>
        ))}
      </div>
    </aside>
  );
}

export function useStamps() {
  const context = useContext(StampContext);
  if (!context) throw new Error("useStamps must be used within StampProvider");
  return context;
}
