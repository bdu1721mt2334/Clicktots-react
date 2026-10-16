import React, { useEffect, useRef, useState } from "react";
import "./App.css";

/* ====== PUT YOUR IMAGES IN  public/images/  AND EDIT THESE PATHS ====== */
const GIRL_IMG = "/images/girl.png";
const LOGO = "/images/logo.png";
const SLIDES = [
  ["/images/slide1.jpg", "VB Designer Studio"],
  ["/images/slide2.jpg", "Wrist World"],
  ["/images/slide3.jpg", "Diksha Eye Care"],
  ["/images/slide4.jpg", "Sai Housing & Properties"],
];
/* ======================================================================= */

const NAV = ["Home", "About Us", "Services", "Work", "Blogs", "Career", "Contact Us"];
const SERVICES = [
  { t: "Digital Marketing", d: "Get noticed. Get results.", c: "#1f5bff", i: "📣" },
  { t: "Web Development", d: "Websites that work for your business.", c: "#7b4dff", i: "</>" },
  { t: "Creative Design", d: "Designs that make an impact.", c: "#ff4f6d", i: "🎨" },
  { t: "App Development", d: "Turn ideas into powerful apps.", c: "#16b981", i: "📱" },
];
const REVIEWS = [
  ["Sindhi School", "Clicktot's 15 years of expertise make them a reliable digital marketing partner. They gave us the edge we needed.", "#ff4f6d"],
  ["PeakPoint", "Their mobile app team took our vision and turned it into reality quickly and efficiently. We were most impressed.", "#7b4dff"],
  ["Fresh2day", "Worked with them for website development and design. Very impressed with their work. Highly recommend it.", "#16b981"],
  ["Induce Evolution", "They understood my unique needs and made the digital marketing process easy and cost-effective.", "#ff9d00"],
];
const BLOGS = [
  ["Digital Marketing", "Jan 15, 2025", "What is Inbound and Outbound Marketing", "A modern strategy for the digital age. Learn the key differences.", "#1f5bff"],
  ["Marketing Tips", "Oct 28, 2024", "15 Diwali Marketing Ideas To Drive Sales in 2025", "Light up your brand with winning festive marketing ideas.", "#ff4f6d"],
  ["Content Marketing", "Sep 10, 2024", "7 Content Marketing Skills You Need to Master", "Attract, engage and convert your audience in 2025.", "#16b981"],
];
const FOOT_SERVICES = ["Digital Marketing","Website Development","Website Design","Mobile App Development","E-Commerce Web Development","Search Engine Optimization","Pay Per Click","Social Media Marketing","Content Marketing","Video Marketing","Influencer Marketing","Affiliate Marketing","OTT Marketing","Email Marketing","Brand Management","Digital Analytics Tracking"];

/* ---------- hooks ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting && !e.target.classList.contains("in")) { e.target.classList.add("in"); const el = e.target; setTimeout(() => (el.style.transitionDelay = "0s"), 1500); } }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCount(to, key = 0, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, s;
    const step = (t) => {
      s = s || t;
      const p = Math.min((t - s) / ms, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, key, ms]);
  return v;
}

function CountOnView({ to, suffix = "" }) {
  const ref = useRef();
  const [go, setGo] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setGo(1), { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const v = useCount(go ? to : 0, go);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ---------- Navbar ---------- */
function PlaneIcon({ fill = "#1f5bff", wing = "#5b8cff", size = 30 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}><path d="M4 30 60 6 44 58 32 40 22 50 20 36z" fill={fill} /><path d="M20 36 60 6 32 40z" fill={wing} /></svg>
  );
}

function TalkBtn({ onTalk }) {
  const [n, setN] = useState(0);
  return (
    <button className="btn primary talk" onClick={onTalk} onMouseEnter={() => setN((x) => x + 1)}>
      <span className="talk-ic"><PlaneIcon fill="#fff" wing="#cfe0ff" size={18} /></span> Talk to our Expert
      {n > 0 && <span className="outplane" key={n}><PlaneIcon size={34} /></span>}
    </button>
  );
}

function Navbar({ onTalk }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={"nav-wrap " + (scrolled ? "scrolled" : "")}>
      <nav className="nav">
        <a href="#home" className="logo"><img src={LOGO} alt="Clicktots Technologies" /></a>
        <ul className={open ? "open" : ""}>
          {NAV.map((n, i) => (
            <li key={n}><a className={i === 0 ? "active" : ""} href={"#" + n.replace(/\s/g, "").toLowerCase()} onClick={() => setOpen(false)}>{n}{n === "Services" && " ▾"}</a></li>
          ))}
        </ul>
        <TalkBtn onTalk={onTalk} />
        <button className="burger" onClick={() => setOpen(!open)} aria-label="menu">☰</button>
      </nav>
    </header>
  );
}

/* ---------- Flying plane ---------- */
function Plane({ flight }) {
  if (!flight) return null;
  return (
    <div className="plane" key={flight.id} style={{ left: flight.x, top: flight.y }}>
      <svg viewBox="0 0 64 64" width="56" height="56"><path d="M4 30 60 6 44 58 32 40 22 50 20 36z" fill="#1f5bff" /><path d="M20 36 60 6 32 40z" fill="#5b8cff" /></svg>
      <span className="trail" />
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero({ fly, toServices }) {
  const stage = useRef();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [traffic, setTraffic] = useState(0);
  const [aim, setAim] = useState(0);
  const [soc, setSoc] = useState(0);
  const pct = useCount(256, traffic);
  const eng = useCount(180, soc);

  const move = (e) => {
    const r = stage.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    setTilt({ x: (p.clientX - r.left) / r.width - 0.5, y: (p.clientY - r.top) / r.height - 0.5 });
  };
  const sh = (m) => ({ transform: `translate(${tilt.x * m}px,${tilt.y * m}px)` });

  return (
    <section id="home" className="hero">
      <div className="blob b1" /><div className="blob b2" />
      <div className="hero-text">
        <p className="eyebrow"><i /> Digital marketing agency in Chennai</p>
        <h1>Turn Clicks into <span className="grad">Customers</span></h1>
        <p className="sub">Creative strategies, powerful digital solutions and result-driven marketing to help your brand grow faster, reach wider and achieve more.</p>
        <div className="cta">
          <button className="btn primary big" onClick={(e) => { fly(e); setTimeout(toServices, 1300); }}>✈ Explore Our Services</button>
          <button className="btn ghost big" onClick={fly}>📞 Schedule a Call</button>
        </div>
        <div className="stats">
          <div><b>15+</b><span>Years Experience</span></div>
          <div><b>500+</b><span>Happy Clients</span></div>
          <div><b>1000+</b><span>Projects Delivered</span></div>
        </div>
      </div>

      <div className="stage" ref={stage} onMouseMove={move} onTouchMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
        <div className="ring" style={sh(-18)} />
        <div className="girl-wrap" style={sh(14)}><img className="girl" src={GIRL_IMG} alt="Marketer working on laptop" /></div>

        {/* Traffic card: hover / touch replays chart + counter */}
        <div className="fcard traffic" style={sh(26)} onMouseEnter={() => setTraffic((n) => n + 1)} onTouchStart={() => setTraffic((n) => n + 1)}>
          <small>Website Traffic</small>
          <b>+{pct}%</b>
          <svg viewBox="0 0 160 50" key={traffic}><polyline className="draw" points="0,44 25,30 45,36 75,20 100,26 130,8 160,2" fill="none" stroke="#1f5bff" strokeWidth="3" strokeLinecap="round" /></svg>
          <span className="up">↗</span>
        </div>
        <div className="chip" style={sh(34)}>Higher Growth ↗</div>

        {/* Aim: click shoots the arrow */}
        <div className="fcard aim" style={sh(30)} onClick={() => setAim((n) => n + 1)} onMouseEnter={() => setAim((n) => n + 1)}>
          <div className="target" key={aim}>
            <span className="rings" /><span className="arrow" />
          </div>
          <p>More Leads<br />More Business</p>
        </div>

        <div className="fcard social" style={sh(22)} onMouseEnter={() => setSoc((n) => n + 1)} onTouchStart={() => setSoc((n) => n + 1)}>
          <small>Social Engagement</small>
          <div className="icons"><i className="ig">◎</i><i className="fb">f</i><i className="lnk">in</i><i className="yt">▶</i></div>
          <b>+{eng}% ↗</b>
        </div>
        <div className="script">Your<br />Growth<br />Partner</div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function Services() {
  const glow = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px");
    e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px");
  };
  return (
    <section id="services" className="services">
      {SERVICES.map((s, i) => (
        <article key={s.t} className="svc reveal" style={{ "--c": s.c, transitionDelay: i * 90 + "ms" }} onMouseMove={glow}>
          <div className="svc-icon">{s.i}</div>
          <h3>{s.t}</h3>
          <p>{s.d}</p>
          <span className="go">→</span>
          <div className="spot" />
        </article>
      ))}
    </section>
  );
}

/* ---------- Client success slider (your 4 banners) ---------- */
function Success() {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  const n = SLIDES.length;
  useEffect(() => {
    if (pause) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4200);
    return () => clearInterval(t);
  }, [pause, n, i]);
  return (
    <section id="work" className="success reveal" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      {SLIDES.map(([src, alt], k) => (
        <img key={k} src={src} alt={alt} className={"slide " + (k === i ? "show" : k === (i - 1 + n) % n ? "prev" : "")} />
      ))}
      <button className="arr l" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous">‹</button>
      <button className="arr r" onClick={() => setI((i + 1) % n)} aria-label="Next">›</button>
      <div className="dots">{SLIDES.map((_, k) => <button key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={"Slide " + (k + 1)} />)}</div>
      {!pause && <div className="bar" key={i} />}
    </section>
  );
}

/* ---------- Reviews / Blogs ---------- */
function Reviews() {
  const tilt = (e) => {
    const p = e.touches ? e.touches[0] : e;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (p.clientX - r.left) / r.width - 0.5, y = (p.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--rx", -y * 16 + "deg");
    e.currentTarget.style.setProperty("--ry", x * 16 + "deg");
    e.currentTarget.style.setProperty("--gx", (x + 0.5) * 100 + "%");
    e.currentTarget.style.setProperty("--gy", (y + 0.5) * 100 + "%");
  };
  const reset = (e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };
  return (
    <section className="block">
      <p className="eyebrow c reveal"><i /> Testimonials</p>
      <h2 className="title reveal">Our Client <span className="grad">Reviews</span></h2>
      <div className="grid4">
        {REVIEWS.map(([n, t, c], k) => (
          <div key={n} className="review reveal" style={{ "--c": c, transitionDelay: k * 90 + "ms" }} onMouseMove={tilt} onTouchStart={tilt} onTouchMove={tilt} onMouseLeave={reset} onTouchEnd={reset}>
            <div className="q">“</div>
            <h4>{n}</h4><p>{t}</p>
            <div className="stars">{[0,1,2,3,4].map((s) => <span key={s} style={{ "--d": s * 70 + "ms" }}>★</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
function Blogs() {
  const [a, setA] = useState(0);
  const [pause, setPause] = useState(false);
  const n = BLOGS.length;
  useEffect(() => {
    if (pause) return;
    const t = setInterval(() => setA((x) => (x + 1) % n), 4500);
    return () => clearInterval(t);
  }, [pause, n]);
  const go = (d) => setA((a + d + n) % n);
  return (
    <section id="blogs" className="block">
      <p className="eyebrow c reveal"><i /> Our blogs</p>
      <h2 className="title reveal">Latest Blogs &amp; <span className="grad">Insights</span></h2>
      <div className="arc reveal" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
        <svg className="arcline" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 190 Q500 -40 1000 190" fill="none" stroke="#bcd0ff" strokeWidth="3" strokeDasharray="8 10" /></svg>
        <button className="arr l" onClick={() => go(-1)} aria-label="Previous blog">‹</button>
        <button className="arr r" onClick={() => go(1)} aria-label="Next blog">›</button>
        {BLOGS.map(([tag, date, t, d, c], k) => {
          let o = k - a; if (o > n / 2) o -= n; if (o < -n / 2) o += n;
          return (
            <article key={t} className={"blog" + (o === 0 ? " center" : "")} onClick={() => setA(k)}
              style={{ "--c": c, "--o": o, zIndex: 10 - Math.abs(o) }}>
              <div className="cover"><span>{tag}</span></div>
              <small>📅 {date} · 5 min read</small>
              <h4>{t}</h4><p>{d}</p>
              <a href="#blogs">Read More →</a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Proposal + Milestones ---------- */
const MILES = [
  { ic: "🏆", n: 15, l: "Years of Journey", c: "#ff9d00", kind: "years" },
  { ic: "🌍", n: 25, l: "Countries", c: "#1f5bff", kind: "pins" },
  { ic: "👥", n: 600, l: "Satisfied Clients", c: "#16b981", kind: "faces" },
  { ic: "📄", n: 750, l: "Projects Completed", c: "#ff4f6d", kind: "bars" },
];

function Mile({ m, k }) {
  const mini = {
    years: <div className="tl">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--i": i }} />)}</div>,
    pins: <div className="pins">{[["8%", "55%"], ["28%", "15%"], ["50%", "60%"], ["70%", "20%"], ["88%", "55%"]].map(([x, y], i) => <i key={i} style={{ "--x": x, "--y": y, "--i": i }} />)}</div>,
    faces: <div className="faces">{["A", "S", "R", "M", "+"].map((t, i) => <i key={i} style={{ "--i": i, "--bg": ["#ff4f6d", "#7b4dff", "#1f5bff", "#ff9d00", "#16b981"][i] }}>{t}</i>)}</div>,
    bars: <div className="bars">{[35, 55, 45, 75, 100].map((h, i) => <i key={i} style={{ "--h": h + "%", "--i": i }} />)}</div>,
  }[m.kind];
  return (
    <div className="mile reveal" style={{ "--c": m.c, transitionDelay: k * 90 + "ms" }}>
      <div className="mile-blob" />
      <div className="mile-icon">{m.ic}</div>
      <b><CountOnView to={m.n} suffix="+" /></b>
      <small>{m.l}</small>
      <div className="mini">{mini}</div>
      <div className="mile-line" />
    </div>
  );
}

function Proposal() {
  return (
    <section className="block">
      <div className="proposal reveal">
        <div>
          <p className="eyebrow"><i /> Our proposal</p>
          <h2 className="title l">Up your growth game with our <span className="grad">10X Strategy</span></h2>
          <p className="sub">Don't let unessential traffic disappoint you. Stand out with customised, data-tested strategies for better page rankings and up to 97% lead conversions. Enter your website link for a proposal.</p>
          <button className="btn primary big">Enquiry now →</button>
        </div>
        <div className="book"><div className="cover2"><b>DIGITAL<br />MARKETING</b><em>PROPOSAL</em></div><div className="pod" /></div>
      </div>
      <p className="eyebrow c reveal"><i /> Our milestones</p>
      <h2 className="title reveal">Lets Work Together</h2>
      <div className="grid4">
        {MILES.map((m, k) => <Mile key={m.l} m={m} k={k} />)}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer id="contactus" className="footer">
      <div className="fgrid">
        <div>
          <a href="#home" className="logo"><img src={LOGO} alt="Clicktots Technologies" /></a>
          <h3>You've come this far.<br />Let's <span className="grad">Connect!</span></h3>
          <p>Ready to grow your business online? Let's discuss your next big idea.</p>
          <p className="pill">📞 +91 99627 34666</p>
          <p className="pill">✉ info@clicktots.com</p>
          <p className="addr">📍 18, PLN Complex, 3rd floor, Conron Smith Road, Gopalapuram, Chennai 600 086</p>
        </div>
        <div><h5>Our Services</h5><ul className="two">{FOOT_SERVICES.map((s) => <li key={s}><a href="#services">{s}</a></li>)}</ul></div>
        <div>
          <h5>Quick Links</h5>
          <ul>{["FAQ", "Career", "Case Study", "Privacy Policy", "Terms & Conditions"].map((s) => <li key={s}><a href="#home">{s}</a></li>)}</ul>
          <h5>Follow us on</h5>
          <div className="soc"><i>in</i><i>f</i><i>X</i><i>◎</i><i>▶</i></div>
        </div>
      </div>
      <div className="copy"><span>Copyright © 2026 Clicktots Technologies | All Rights Reserved.</span><span>Privacy Policy | Terms &amp; Conditions | Sitemap</span></div>
      <button className="totop" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
    </footer>
  );
}

/* ---------- App ---------- */
function Cursor() {
  const plane = useRef();
  const ring = useRef();
  const [hot, setHot] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("has-cursor");
    const COLORS = ["#ff4f6d", "#16b981", "#1b3f8f", "#ff9d00"]; // logo tile colours
    let x = -100, y = -100, rx = -100, ry = -100, ang = -135, tAng = -135, lastT = 0, raf;
    const tile = (px, py, extra = {}) => {
      if (calm) return;
      const t = document.createElement("i");
      t.className = "tile";
      t.style.left = px + "px";
      t.style.top = py + "px";
      t.style.background = COLORS[Math.floor(Math.random() * 4)];
      Object.entries(extra).forEach(([k, v]) => t.style.setProperty(k, v));
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 800);
    };
    const move = (e) => {
      const dx = e.clientX - x, dy = e.clientY - y, d = Math.hypot(dx, dy);
      if (d > 4) tAng = (Math.atan2(dy, dx) * 180) / Math.PI;
      x = e.clientX; y = e.clientY;
      const now = performance.now();
      if (d > 3 && now - lastT > 45) { lastT = now; tile(x, y); }
      setHot(!!e.target.closest("a,button,.svc,.review,.blog,.fcard,.mile,.book,.arr"));
      plane.current.style.opacity = 1; ring.current.style.opacity = 1;
    };
    const click = (e) => {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        tile(e.clientX, e.clientY, { "--dx": Math.cos(a) * 56 + "px", "--dy": Math.sin(a) * 56 + "px" });
      }
    };
    const leave = () => { plane.current.style.opacity = 0; ring.current.style.opacity = 0; };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ang += (((tAng - ang + 540) % 360) - 180) * 0.2;
      plane.current.style.transform = `translate(${x}px,${y}px) rotate(${ang}deg)`;
      ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("has-cursor");
    };
  }, []);
  return (
    <>
      <div className="cur" ref={ring}><div className={"cur-ring" + (hot ? " hot" : "")} /></div>
      <div className="cur" ref={plane}>
        <svg className="cur-plane" viewBox="0 0 30 24" width="30" height="24"><polygon points="0,0 29,12 0,24 7,12" fill="#1f5bff" /><polygon points="7,12 29,12 0,24" fill="#7aa2ff" /></svg>
      </div>
    </>
  );
}

export default function App() {
  const [flight, setFlight] = useState(null);
  useReveal();

  const fly = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setFlight({ id: Date.now(), x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setTimeout(() => setFlight(null), 1700);
  };
  const toServices = () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Navbar onTalk={fly} />
      <Plane flight={flight} />
      <Cursor />
      <main>
        <Hero fly={fly} toServices={toServices} />
        <Services />
        <Success />
        <Reviews />
        <Blogs />
        <Proposal />
      </main>
      <Footer />
    </>
  );
}
