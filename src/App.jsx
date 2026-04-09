import { motion, useScroll, useTransform, AnimatePresence, useVelocity, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Lenis from "lenis";

// --- Data ---
const services = [
  { title: "Web Design & Development", points: ["Responsive Design", "Custom CMS", "WebGL & 3D"] },
  { title: "Brand Identity Design", points: ["Verbal Identity", "Design Systems", "Logomarks"] },
  { title: "UI/UX Design", points: ["Interactive Prototypes", "Wireframing", "User Research"] },
  { title: "Digital Marketing & SEO", points: ["Growth Strategy", "Content creation", "Analytics"] }
];

const processSteps = [
  { title: "Discovery", text: "Research-driven insights guide every creative decision." },
  { title: "Design", text: "Wireframes evolve into stunning, high-contrast visual systems." },
  { title: "Develop", text: "Performant code, fluid motion, and rigorous testing." },
  { title: "Deploy", text: "Launch with confidence and measure continuous growth." }
];

const capabilities = [
  { title: "Strategy & Research", desc: "Deep audience analysis, competitive audits, and user journey mapping to build bulletproof digital strategies.", icon: "01" },
  { title: "Visual Design", desc: "From wireframes to pixel-perfect interfaces — editorial typography, curated palettes, and obsessive attention to detail.", icon: "02" },
  { title: "Motion & Interaction", desc: "Physics-based animations, scroll-driven narratives, and micro-interactions that create emotional resonance.", icon: "03" },
  { title: "Frontend Engineering", desc: "Performant React architectures, WebGL experiences, and headless CMS integrations built for scale.", icon: "04" },
  { title: "Brand Systems", desc: "Comprehensive identity design — logomarks, type hierarchies, design tokens, and multi-platform asset libraries.", icon: "05" },
  { title: "Growth & Analytics", desc: "SEO foundations, conversion optimization, and data-driven iteration to maximize organic reach and retention.", icon: "06" }
];

const works = [
  {
    id: "w1", category: "Cafe", title: "Brew & Bean",
    text: "Complete brand redesign and website for an artisan coffee shop. Developed using headless architecture with a custom CMS.",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop",
    artDir: "John Doe", visual: "LocusPath Team", year: "2024"
  },
  {
    id: "w2", category: "Retail", title: "Luxe Avenue",
    text: "Full e-commerce platform for a luxury fashion boutique with an elite checkout experience and AR try-on.",
    img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1600&auto=format&fit=crop",
    artDir: "Jane Smith", visual: "Studio Alpha", year: "2024"
  },
  {
    id: "w3", category: "Tech", title: "Aura Systems",
    text: "Dark-mode dashboard with interactive 3D data visualization specifically for the biotech industry.",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    artDir: "LocusPath", visual: "In-house", year: "2023"
  }
];

const easeHighFashion = [0.22, 1, 0.36, 1]; 

const section3DReveal = {
  hidden: { opacity: 0, y: 80, rotateX: 8, scale: 0.96 },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { ease: easeHighFashion, duration: 1.8 } }
};

const liquidDropIn = {
  hidden: { opacity: 0, rotateX: 12, y: 40, scale: 0.95 },
  visible: { opacity: 1, rotateX: 0, scale: 1, y: 0, transition: { ease: easeHighFashion, duration: 1.5 } }
};

const staggerText = {
  hidden: { opacity: 0, y: 25, rotateX: 6 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { ease: easeHighFashion, duration: 1.2 } }
};

const card3DReveal = {
  hidden: { opacity: 0, y: 60, rotateX: 10, rotateY: -3, scale: 0.9 },
  visible: { opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1, transition: { ease: easeHighFashion, duration: 1.6 } }
};

// --- PHYSICS ENGINES ---

const VelocityStretch = ({ children }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 100, stiffness: 600 });
  const velocityScaleY = useTransform(smoothVelocity, [-1500, 1500], [0.97, 1.03]);
  const velocityScaleX = useTransform(smoothVelocity, [-1500, 1500], [1.015, 0.985]);
  return <motion.div style={{ scaleY: velocityScaleY, scaleX: velocityScaleX }} className="w-full">{children}</motion.div>;
};

const MagneticFloat = ({ children, force = 10 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20, mass: 0.1 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [force, -force]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-force, force]);
  const randomDuration = useRef(4 + Math.random() * 2).current;
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="inline-block relative">
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: randomDuration, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full">
         {children}
      </motion.div>
    </motion.div>
  );
};

const FocalCameraBlur = ({ children, offset = ["start end", "end start"], blurStrength = 4 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [blurStrength, 0, 0, blurStrength]);
  const filter = useTransform(blur, value => value <= 0.1 ? "none" : `blur(${value}px)`);
  return <motion.div ref={ref} style={{ filter }}>{children}</motion.div>;
};



export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedWork, setSelectedWork] = useState(null);

  const { scrollYProgress } = useScroll();
  const driftLeft = useTransform(scrollYProgress, [0, 1], ["0vw", "-3vw"]);
  const driftRight = useTransform(scrollYProgress, [0, 1], ["0vw", "3vw"]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.05, smoothWheel: true });
    window.lenis = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); delete window.lenis; };
  }, []);

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.lenis) {
      window.lenis.scrollTo(`#${id.toLowerCase()}`, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  };

  const accentMap = {
    Home:     { x: "-25vw", y: "-15vh", scale: 1,   opacity: 0.5,  backgroundColor: "#be123c", borderRadius: "45%" },
    Work:     { x: "30vw",  y: "10vh",  scale: 1.4, opacity: 0.2,  backgroundColor: "#d4d4d8", borderRadius: "55%" },
    Services: { x: "-10vw", y: "0vh",   scale: 1.2, opacity: 0.35, backgroundColor: "#4338ca", borderRadius: "35%" },
    About:    { x: "40vw",  y: "-40vh", scale: 0.8, opacity: 0.15, backgroundColor: "#065f46", borderRadius: "50%" }
  };

  return (
    <div className="relative bg-[#050505] font-sans antialiased text-[#f5f5f5] selection:bg-red-600 selection:text-white cursor-crosshair">
      
      <svg className="hidden">
        <filter id="liquidMask">
           <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
           <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Ambient Blob — Primary */}
      <motion.div aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[35vmax] w-[35vmax] -translate-x-1/2 -translate-y-1/2 blur-[120px] md:blur-[200px] mix-blend-screen"
        animate={accentMap[activeTab]} transition={{ duration: 3, ease: easeHighFashion }}
      />
      {/* Ambient Blob — Secondary (subtle counter-movement) */}
      <motion.div aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[20vmax] w-[20vmax] -translate-x-1/2 -translate-y-1/2 blur-[80px] md:blur-[140px] mix-blend-screen"
        animate={{
          x: accentMap[activeTab]?.x === "-25vw" ? "15vw" : "-15vw",
          y: accentMap[activeTab]?.y === "-15vh" ? "20vh" : "-10vh",
          opacity: (accentMap[activeTab]?.opacity || 0.3) * 0.4,
          backgroundColor: activeTab === "Home" ? "#7c2d12" : activeTab === "Services" ? "#1e1b4b" : "#1c1917",
          scale: 0.8
        }}
        transition={{ duration: 4, ease: easeHighFashion }}
      />
      
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Persistent Nav */}
      <div className="fixed bottom-10 w-full flex justify-center z-50 pointer-events-auto" style={{ perspective: "1000px" }}>
        <MagneticFloat force={12}>
           <motion.nav initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1.2, ease: easeHighFashion }}
             className="flex items-center gap-1 rounded-full bg-[#111]/80 border border-white/10 backdrop-blur-xl p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
             <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none bg-gradient-to-r from-red-500/20 via-blue-500/20 to-green-500/20 blur-md mix-blend-screen" />
             {["Home", "Work", "Services", "About"].map((item) => (
               <button key={item} onClick={() => handleNavClick(item)}
                 className={`relative px-5 py-2.5 rounded-full text-[10px] font-semibold tracking-widest uppercase transition-colors duration-500 z-10 ${activeTab === item ? 'text-black' : 'text-stone-400 hover:text-white'}`}>
                 {activeTab === item && (
                   <motion.div layoutId="active-pill" className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      transition={{ duration: 0.8, ease: easeHighFashion }} />
                 )}
                 {item}
               </button>
             ))}
           </motion.nav>
        </MagneticFloat>
      </div>

      <VelocityStretch>
        <div className="relative w-full z-10 overflow-hidden" style={{ perspective: "1200px" }}>
          
          {/* ═══════════ HOME SECTION (STICKY — gets covered by Work) ═══════════ */}
          <div id="home" className="relative h-[200vh]">
            <motion.div onViewportEnter={() => setActiveTab("Home")} viewport={{ amount: 0.3 }}>
              <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-0">
                <FocalCameraBlur blurStrength={3}>
                  <motion.div style={{ x: driftLeft }} className="text-center px-4 relative z-10">
                    {/* Eyebrow */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 1.5 }}
                      className="flex items-center justify-center gap-4 mb-10">
                      <div className="h-px w-12 bg-stone-600" />
                      <span className="text-[10px] tracking-[0.4em] uppercase text-stone-500 font-semibold">Creative Studio</span>
                      <div className="h-px w-12 bg-stone-600" />
                    </motion.div>

                    <div className="overflow-hidden pb-2" style={{ perspective: "800px" }}>
                      <motion.h1 initial={{ y: "110%", rotateX: -40, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }}
                        transition={{ duration: 1.8, ease: easeHighFashion, delay: 0.2 }} style={{ transformOrigin: "center bottom" }}
                        className="font-display font-bold text-[15vw] leading-[0.85] tracking-tighter uppercase">
                        L/OCUS
                      </motion.h1>
                    </div>
                    <div className="overflow-hidden pb-2" style={{ perspective: "800px" }}>
                      <motion.h1 initial={{ y: "110%", rotateX: -40, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }}
                        transition={{ duration: 1.8, ease: easeHighFashion, delay: 0.35 }} style={{ transformOrigin: "center bottom" }}
                        className="font-display font-bold text-[15vw] leading-[0.85] tracking-tighter uppercase text-stone-400">
                        PATH
                      </motion.h1>
                    </div>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 1.2, ease: easeHighFashion }}
                      className="mt-8 text-stone-500 max-w-md mx-auto text-xs md:text-sm font-medium tracking-wider uppercase leading-relaxed">
                      We architect immersive digital experiences<br />for brands that refuse to blend in.
                    </motion.p>
                  </motion.div>
                </FocalCameraBlur>

                {/* Scroll indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                  className="absolute bottom-20 flex flex-col items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-stone-600">Scroll</span>
                  <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowDown className="w-4 h-4 text-stone-600" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ═══════════ WORK SECTION (slides over Home) ═══════════ */}
          <section id="work" className="bg-[#f5f5f5] text-[#050505] rounded-t-[4rem] shadow-[0_-40px_80px_rgba(0,0,0,0.7)] pt-28 pb-40 z-30 relative px-4 md:px-10">
            <motion.div onViewportEnter={() => setActiveTab("Work")} viewport={{ amount: 0.15 }}>
               <div className="max-w-[1400px] mx-auto py-10" style={{ perspective: "1200px" }}>
                  <FocalCameraBlur offset={["start end", "center center"]} blurStrength={2}>
                    <motion.h1 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                       className="font-display text-3xl md:text-7xl font-bold uppercase tracking-tighter mb-4 text-stone-900">
                       Our Work
                    </motion.h1>
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerText}
                      className="text-stone-500 text-sm md:text-base max-w-lg mb-16 leading-relaxed">
                      A curated collection of projects where strategy, design, and engineering converge to create lasting digital impact.
                    </motion.p>
                  </FocalCameraBlur>
                  
                  <motion.div style={{ x: driftRight }} className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                    {works.map((work, i) => (
                      <motion.div key={work.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                        variants={card3DReveal} transition={{ delay: i * 0.1 }} style={{ transformOrigin: "center bottom" }}>
                         <MagneticFloat force={8}>
                           <div className="group relative cursor-pointer w-full h-full" onClick={() => setSelectedWork(work)}>
                             <motion.div layoutId={`proj-container-${work.id}`} className="overflow-hidden rounded-2xl bg-stone-200 aspect-[4/5] relative shadow-lg group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition-shadow duration-500">
                               <motion.img layoutId={`proj-img-${work.id}`}
                                 whileHover={{ scale: 1.05, filter: "saturate(1.1)" }}
                                 transition={{ duration: 1.5, ease: easeHighFashion }}
                                 src={work.img} alt={work.title} className="w-full h-full object-cover" />
                               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                                 {work.year}
                               </div>
                             </motion.div>
                             <div className="mt-5 flex items-start justify-between">
                               <div>
                                 <h3 className="font-display text-lg font-bold uppercase text-stone-900 group-hover:text-red-600 transition-colors">{work.title}</h3>
                                 <p className="text-xs text-stone-500 mt-1">{work.text.substring(0, 60)}...</p>
                               </div>
                               <span className="text-[9px] uppercase tracking-[0.15em] text-red-600 border border-red-600/30 px-3 py-1 rounded-full font-bold mt-1 shrink-0">{work.category}</span>
                             </div>
                           </div>
                         </MagneticFloat>
                      </motion.div>
                    ))}
                  </motion.div>
               </div>
            </motion.div>
          </section>

          {/* ═══════════ WHAT WE DO / CAPABILITIES ═══════════ */}
          <section id="services" className="relative z-10 pt-40 pb-32 px-4 md:px-10">
            <motion.div onViewportEnter={() => setActiveTab("Services")} viewport={{ amount: 0.2 }}>
              <div className="max-w-[1400px] mx-auto" style={{ perspective: "1200px" }}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
                  <div>
                    <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerText}
                      className="text-[10px] uppercase tracking-[0.4em] text-stone-600 font-semibold mb-4 block">What We Do</motion.span>
                    <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                      style={{ transformOrigin: "center bottom" }}
                      className="font-display text-4xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9] text-white">
                      Full-Spectrum<br/><span className="text-stone-500">Digital Craft</span>
                    </motion.h2>
                  </div>
                  <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerText}
                    className="text-stone-500 text-sm max-w-md leading-relaxed md:text-right">
                    From initial strategy through final deployment — we handle every pixel, every interaction, every line of code.
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {capabilities.map((cap, i) => (
                    <motion.div key={cap.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      variants={card3DReveal} transition={{ delay: i * 0.08 }} style={{ transformOrigin: "center bottom" }}>
                      <MagneticFloat force={10}>
                        <div className="group p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 relative overflow-hidden h-full">
                          <div className="absolute top-4 right-4 font-display text-5xl font-bold italic opacity-[0.04] text-white">{cap.icon}</div>
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          <div className="relative z-10">
                            <div className="w-10 h-px bg-red-600/50 mb-8 group-hover:w-16 transition-all duration-500" />
                            <h3 className="font-display text-xl uppercase font-bold text-stone-200 mb-4 group-hover:text-white transition-colors">{cap.title}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed group-hover:text-stone-400 transition-colors">{cap.desc}</p>
                          </div>
                        </div>
                      </MagneticFloat>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Band */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section3DReveal}
                  className="mt-20 bg-white/[0.03] border border-white/5 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">Have a project in mind?</h3>
                    <p className="text-stone-500 text-sm mt-2">Let's talk about how we can bring your vision to life.</p>
                  </div>
                  <a href="mailto:hello@locuspath.co" className="relative z-10 bg-white text-black font-display font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500 shrink-0">
                    Get In Touch
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ═══════════ ABOUT SECTION ═══════════ */}
          <section id="about" className="relative z-10 pt-32 pb-20 px-4 md:px-10">
            <motion.div onViewportEnter={() => setActiveTab("About")} viewport={{ amount: 0.15 }}>
               <div className="max-w-[1400px] mx-auto" style={{ perspective: "1200px" }}>
                  <FocalCameraBlur offset={["start end", "center center"]} blurStrength={2}>
                    <motion.div style={{ x: driftRight }}>
                      <motion.h1 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                         style={{ transformOrigin: "center bottom" }}
                         className="font-display text-4xl md:text-[5.5vw] max-w-[80vw] font-bold uppercase tracking-tight mb-24 leading-[0.9]">
                         We don't just design websites.<br/><span className="text-stone-500">We engineer obsessions.</span>
                      </motion.h1>
                    </motion.div>
                  </FocalCameraBlur>

                  <div className="grid md:grid-cols-2 gap-16">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section3DReveal} style={{ transformOrigin: "left center" }}>
                      <MagneticFloat force={10}>
                        <div>
                          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white mb-4">Services</h2>
                          <p className="text-stone-400 font-medium max-w-sm leading-relaxed text-sm">We develop hyper-interactive brand systems and fluid digital experiences for elite technical companies worldwide.</p>
                        </div>
                      </MagneticFloat>
                    </motion.div>
                    
                    <div className="space-y-8">
                      {services.map((srv, i) => (
                        <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                          variants={staggerText} transition={{ delay: i * 0.08 }} className="group border-b border-white/10 pb-5">
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs text-stone-600 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                            <ArrowUpRight className="w-4 h-4 text-stone-500 transition-transform group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </div>
                          <h3 className="font-display text-xl md:text-2xl uppercase font-bold text-stone-300">{srv.title}</h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {srv.points.map(pt => (
                              <span key={pt} className="text-[9px] uppercase tracking-widest text-stone-500 border border-white/10 rounded-full px-3 py-1.5 bg-white/5">{pt}</span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Protocol */}
                  <div className="mt-32" style={{ perspective: "1000px" }}>
                     <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                       className="font-display text-3xl font-bold uppercase mb-12 text-stone-500 border-b border-white/10 pb-6">
                       Protocol Overview
                     </motion.h2>
                     <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {processSteps.map((step, i) => (
                           <motion.div key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
                             variants={card3DReveal} transition={{ delay: i * 0.12 }} style={{ transformOrigin: "center bottom" }}>
                             <MagneticFloat force={15}>
                               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-colors relative h-full flex flex-col justify-end backdrop-blur-xl">
                                  <span className="font-display text-6xl font-bold italic opacity-[0.03] absolute top-3 right-4 text-white">{i+1}</span>
                                  <div className="pt-16 relative z-10">
                                    <h3 className="font-display text-lg uppercase font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-xs text-stone-400 leading-relaxed">{step.text}</p>
                                  </div>
                               </div>
                             </MagneticFloat>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          </section>

          {/* ═══════════ FOOTER ═══════════ */}
          <footer className="relative z-10 border-t border-white/5 pt-32 pb-32 px-4 md:px-10 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={section3DReveal}>
                
                {/* Big CTA */}
                <div className="mb-24">
                  <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                    style={{ transformOrigin: "center bottom" }}
                    className="font-display text-5xl md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.85] text-white">
                    Let's Build<br/><span className="text-stone-600">Something Together</span>
                  </motion.h2>
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerText}
                    className="mt-10 flex flex-col sm:flex-row gap-6 items-start">
                    <a href="mailto:hello@locuspath.co"
                      className="bg-white text-black font-display font-bold uppercase tracking-widest text-xs px-10 py-5 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500 group flex items-center gap-3">
                      Start a Project
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                    <a href="mailto:hello@locuspath.co"
                      className="font-display text-xl md:text-2xl font-bold text-stone-400 hover:text-white transition-colors uppercase tracking-tight">
                      hello@locuspath.co
                    </a>
                  </motion.div>
                </div>

                {/* Footer Grid */}
                <div className="grid md:grid-cols-3 gap-16 pt-16 border-t border-white/5">
                  <div>
                    <h2 className="font-display text-3xl font-bold uppercase tracking-tighter text-white">L/OCUS<br/>PATH</h2>
                    <p className="mt-4 text-stone-600 text-sm leading-relaxed max-w-xs">Canvas-first interactive design studio. Brutalist minimalist evolution.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-4">Navigation</h4>
                      {["Home", "Work", "Services", "About"].map(item => (
                        <button key={item} onClick={() => handleNavClick(item)}
                          className="block text-sm text-stone-500 hover:text-white transition-colors py-1 uppercase tracking-wider font-medium">{item}</button>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-4">Connect</h4>
                      {["Twitter/X", "LinkedIn", "Dribbble", "Instagram"].map(item => (
                        <a key={item} href="#" className="block text-sm text-stone-500 hover:text-white transition-colors py-1 uppercase tracking-wider font-medium">{item}</a>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-end">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-stone-700">© {new Date().getFullYear()} LocusPath. All rights reserved.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </footer>

        </div>
      </VelocityStretch>

      {/* ═══════════ PROJECT MODAL ═══════════ */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div initial={{ opacity: 0, scale: 0.95, rotateX: 5 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateX: -5 }} transition={{ ease: easeHighFashion, duration: 1 }}
            className="fixed inset-0 z-[100] bg-[#050505] text-[#f5f5f5] overflow-y-auto hide-scrollbar"
            style={{ perspective: "1000px", transformOrigin: "center center" }} data-lenis-prevent="true">
            
            <motion.div layoutId={`proj-container-${selectedWork.id}`} className="relative h-[70vh] w-full bg-black">
              <motion.img layoutId={`proj-img-${selectedWork.id}`} src={selectedWork.img} className="w-full h-full object-cover opacity-60" />
              <button onClick={() => setSelectedWork(null)}
                className="fixed top-8 left-8 md:top-10 md:left-10 px-6 py-3 bg-[#0a0a0a]/80 border border-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all z-[110] text-white group shadow-2xl">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-black transition-colors" />
                   <span className="font-display font-bold uppercase tracking-[0.2em] text-xs">Close</span>
                </div>
              </button>
            </motion.div>

            <div className="max-w-[1400px] mx-auto py-16 relative -mt-28 z-10 px-4 md:px-10" style={{ perspective: "1000px" }}>
              <MagneticFloat force={5}>
                <div className="bg-[#111] p-8 md:p-20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 relative w-full">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
                    <motion.div variants={staggerText}>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-red-500 uppercase tracking-[0.3em] text-xs font-bold">{selectedWork.category}</span>
                        <span className="text-stone-600 text-xs font-mono">{selectedWork.year}</span>
                      </div>
                      <h2 className="font-display text-4xl md:text-[7vw] font-bold uppercase leading-[0.9] tracking-tight">{selectedWork.title}</h2>
                    </motion.div>
                    <motion.div variants={staggerText} className="grid md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-white/10">
                      <div><p className="text-stone-400 text-lg leading-relaxed max-w-lg">{selectedWork.text}</p></div>
                      <div className="space-y-6">
                        <div>
                          <p className="text-stone-500 uppercase tracking-widest text-xs mb-1">Art Direction</p>
                          <p className="font-display text-xl uppercase font-bold text-stone-200">{selectedWork.artDir}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 uppercase tracking-widest text-xs mb-1">Visual Design</p>
                          <p className="font-display text-xl uppercase font-bold text-stone-200">{selectedWork.visual}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </MagneticFloat>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
