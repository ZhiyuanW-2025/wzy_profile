import { aboutContent } from "@/content/site";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-title">
          <p className="eyebrow">关于我 / RESUME</p>
          <h1>{aboutContent.name}</h1>
          <p>{aboutContent.role}</p>
        </div>
        <p className="about-intro">{aboutContent.intro}</p>
      </section>
      <section className="about-grid">
        <div className="about-section-label"><span>01</span><p>教育与经历</p></div>
        <div className="background-list">
          {aboutContent.background.map((item, index) => (
            <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
          ))}
        </div>
        <div className="about-section-label"><span>02</span><p>简历与联系</p></div>
        <div className="contact-list">
          {aboutContent.links.map((link) => (
            <a key={link.label} href={link.href}>
              <strong>{link.label}</strong><small>{link.note}</small><span>↗</span>
            </a>
          ))}
        </div>
      </section>
      <section className="about-closing">
        <p>我持续关注</p>
        <h2>AI × 真实用户 ×<br />真实世界体验</h2>
        <span>寻找 2027 秋招 AI 产品经理机会</span>
      </section>
    </main>
  );
}
