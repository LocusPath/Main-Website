import { motion, useScroll, useTransform, AnimatePresence, useVelocity, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
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

const works = [
  {
    id: "w1",
    category: "Cafe",
    title: "Brew & Bean",
    text: "Complete brand redesign and website for an artisan coffee shop. Developed using headless architecture.",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop",
    artDir: "John Doe",
    visual: "LocusPath Team"
  },
  {
    id: "w2",
    category: "Retail",
    title: "Luxe Avenue",
    text: "Full e-commerce platform for a luxury fashion boutique with an elite checkout experience.",
    img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1600&auto=format&fit=crop",
    artDir: "Jane Smith",
    visual: "Studio Alpha"
  },
  {
    id: "w3",
    category: "Tech",
    title: "Aura Systems",
    text: "Dark-mode dashboard with interactive 3D data visualization specifically for the biotech industry.",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    artDir: "LocusPath",
    visual: "In-house"
  }
];

const easeHighFashion = [0.22, 1, 0.36, 1]; 

// 3D perspective entrance — elements tilt forward from below
const section3DReveal = {
  hidden: { opacity: 0, y: 80, rotateX: 8, scale: 0.96 },
  visible: { 
    opacity: 1, y: 0, rotateX: 0, scale: 1,
    transition: { ease: easeHighFashion, duration: 1.8 } 
  }
};

const liquidDropIn = {
  hidden: { opacity: 0, rotateX: 12, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, rotateX: 0, scale: 1, y: 0, 
    transition: { ease: easeHighFashion, duration: 1.5 } 
  }
};

const staggerText = {
  hidden: { opacity: 0, y: 25, rotateX: 6 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { ease: easeHighFashion, duration: 1.2 } }
};

// Card 3D entrance — slides up with depth rotation
const card3DReveal = {
  hidden: { opacity: 0, y: 60, rotateX: 10, rotateY: -3, scale: 0.9 },
  visible: { 
    opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1,
    transition: { ease: easeHighFashion, duration: 1.6 }
  }
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
    <motion.div
      ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="inline-block relative"
    >
      <motion.div 
         animate={{ y: [0, -4, 0] }} 
         transition={{ duration: randomDuration, repeat: Infinity, ease: "easeInOut" }}
         className="w-full h-full"
      >
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
  
  return (
    <motion.div ref={ref} style={{ filter }}>
      {children}
    </motion.div>
  );
};

// Marquee item separator
const MarqueeDot = () => <span className="text-red-600/40 text-xl mx-2 select-none">●</span>;

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
    Home: { x: "-20vw", y: "-10vh", scale: 1, opacity: 0.6, backgroundColor: "#e11d48", borderRadius: "40%" },
    Work: { x: "20vw", y: "15vh", scale: 1.3, opacity: 0.4, backgroundColor: "#f8fafc", borderRadius: "60%" },
    Archive: { x: "0vw", y: "5vh", scale: 1.6, opacity: 0.4, backgroundColor: "#6366f1", borderRadius: "30%" },
    About: { x: "-15vw", y: "20vh", scale: 1.2, opacity: 0.5, backgroundColor: "#10b981", borderRadius: "50%" }
  };

  // Build marquee data — duplicate enough for seamless loop
  const marqueeItems = [...works, ...works, ...works, ...works, ...works, ...works];

  return (
    <div className="relative bg-[#050505] font-sans antialiased text-[#f5f5f5] selection:bg-red-600 selection:text-white cursor-crosshair">
      
      {/* SVG DISPLACEMENT FILTER (Invisible Definition) */}
      <svg className="hidden">
        <filter id="liquidMask">
           <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
           <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Intense Glowing Blob transitioning through sections */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 blur-[100px] md:blur-[180px] mix-blend-screen"
        animate={accentMap[activeTab]}
        transition={{ duration: 2.5, ease: easeHighFashion }}
      />
      
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Persistent Nav (Pill) */}
      <div className="fixed bottom-10 w-full flex justify-center z-50 pointer-events-auto" style={{ perspective: "1000px" }}>
        <MagneticFloat force={12}>
           <motion.nav 
             initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1.2, ease: easeHighFashion }}
             className="flex items-center gap-1 rounded-full bg-[#111]/80 border border-white/10 backdrop-blur-xl p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
           >
             <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none bg-gradient-to-r from-red-500/20 via-blue-500/20 to-green-500/20 blur-md mix-blend-screen" />

             {["Home", "Work", "Archive", "About"].map((item) => (
               <button 
                 key={item} onClick={() => handleNavClick(item)}
                 className={`relative px-5 py-2.5 rounded-full text-[10px] font-semibold tracking-widest uppercase transition-colors duration-500 z-10 ${activeTab === item ? 'text-black' : 'text-stone-400 hover:text-white'}`}
               >
                 {activeTab === item && (
                   <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      transition={{ duration: 0.8, ease: easeHighFashion }}
                   />
                 )}
                 {item}
               </button>
             ))}
           </motion.nav>
        </MagneticFloat>
      </div>

      <VelocityStretch>
        <div className="relative w-full z-10 overflow-hidden" style={{ perspective: "1200px" }}>
          
          {/* ----------- HOME SECTION ----------- */}
          <section id="home">
              <motion.div onViewportEnter={() => setActiveTab("Home")} viewport={{ amount: 0.5, margin: "-100px" }}>
                <div className="h-[120vh] w-full relative flex flex-col items-center justify-center -z-10">
                  <FocalCameraBlur blurStrength={3}>
                    <motion.div style={{ x: driftLeft }} className="text-center px-4 relative z-10" >
                      <div className="overflow-hidden pb-4" style={{ perspective: "800px" }}>
                        <motion.h1 
                          initial={{ y: "110%", rotateX: -40, opacity: 0 }}
                          animate={{ y: 0, rotateX: 0, opacity: 1 }}
                          transition={{ duration: 1.8, ease: easeHighFashion, delay: 0.2 }}
                          style={{ transformOrigin: "center bottom" }}
                          className="font-display font-bold text-[13vw] leading-[0.8] tracking-tighter uppercase"
                        >
                          L/OCUS
                        </motion.h1>
                      </div>
                      <div className="overflow-hidden pb-4" style={{ perspective: "800px" }}>
                        <motion.h1 
                          initial={{ y: "110%", rotateX: -40, opacity: 0 }}
                          animate={{ y: 0, rotateX: 0, opacity: 1 }}
                          transition={{ duration: 1.8, ease: easeHighFashion, delay: 0.35 }}
                          style={{ transformOrigin: "center bottom" }}
                          className="font-display font-bold text-[13vw] leading-[0.8] tracking-tighter uppercase text-stone-300"
                        >
                          PATH
                        </motion.h1>
                      </div>
                      <motion.p 
                        initial={{ opacity: 0, y: 20, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay: 0.6, duration: 1.2, ease: easeHighFashion }}
                        className="mt-8 text-stone-400 max-w-lg mx-auto text-sm md:text-base font-medium tracking-wide uppercase"
                      >
                        Canvas-first interactive web design. Fluid brutalist evolution.
                      </motion.p>
                    </motion.div>
                  </FocalCameraBlur>
                </div>
              </motion.div>
          </section>

          {/* ----------- WORK SECTION ----------- */}
          <section id="work" className="bg-[#f5f5f5] text-[#050505] rounded-t-[4rem] shadow-[0_-30px_60px_rgba(0,0,0,0.9)] pt-32 pb-48 mt-[-20vh] z-20 relative px-4 md:px-10">
            <motion.div onViewportEnter={() => setActiveTab("Work")} viewport={{ margin: "-30%", amount: 0.1 }}>
               <div className="max-w-[1400px] mx-auto py-10" style={{ perspective: "1200px" }}>
                  <FocalCameraBlur offset={["start end", "center center"]} blurStrength={2}>
                    <motion.h1 
                       initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                       className="font-display text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-16 text-stone-900 border-b border-black/10 pb-8"
                    >
                       Selected Works
                    </motion.h1>
                  </FocalCameraBlur>
                  
                  <motion.div style={{ x: driftRight }} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    {works.map((work, i) => (
                      <motion.div 
                        key={work.id}
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
                        variants={card3DReveal}
                        transition={{ delay: i * 0.15 }}
                        style={{ transformOrigin: "center bottom" }}
                      >
                         <MagneticFloat force={8}>
                           <div className="group relative cursor-pointer w-full h-full" onClick={() => setSelectedWork(work)}>
                             <motion.div layoutId={`proj-container-${work.id}`} className="overflow-hidden rounded-2xl bg-stone-200 aspect-[4/5] relative shadow-lg group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition-shadow duration-500">
                               <motion.img 
                                 layoutId={`proj-img-${work.id}`}
                                 whileHover={{ scale: 1.05, filter: "saturate(1.1)" }}
                                 transition={{ duration: 1.5, ease: easeHighFashion }}
                                 src={work.img} alt={work.title} 
                                 className="w-full h-full object-cover"
                               />
                             </motion.div>
                             <div className="mt-6 flex flex-col items-start gap-2">
                               <h3 className="font-display text-xl font-bold uppercase text-stone-900 group-hover:text-red-600 transition-colors">{work.title}</h3>
                               <span className="text-[10px] uppercase tracking-[0.2em] text-red-600 border border-red-600/30 px-3 py-1 rounded-full font-bold">{work.category}</span>
                             </div>
                           </div>
                         </MagneticFloat>
                      </motion.div>
                    ))}
                  </motion.div>
               </div>
            </motion.div>
          </section>

          {/* ----------- ARCHIVE SECTION (INFINITE MARQUEE) ----------- */}
          <section id="archive" className="relative z-10 py-20 overflow-hidden">
            {/* Scrollspy detector — fires every time you scroll back to this section */}
            <motion.div onViewportEnter={() => setActiveTab("Archive")} viewport={{ margin: "-40%", amount: 0.3 }}>
              {/* 3D reveal — fires once */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={section3DReveal}
                style={{ transformOrigin: "center top" }}
              >
                <div className="flex flex-col gap-6">
                   <div className="px-4 md:px-10 max-w-[1400px] mx-auto w-full">
                      <h4 className="font-display text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-stone-600 mb-2">The Archive</h4>
                      <div className="w-16 h-px bg-stone-700" />
                   </div>

                   {/* Row 1 — scrolls left */}
                   <div className="relative flex whitespace-nowrap overflow-hidden py-3">
                      <motion.div 
                        animate={{ x: ["0%", "-50%"] }} 
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="flex items-center"
                      >
                        {marqueeItems.map((work, i) => (
                           <div key={`r1-${i}`} className="flex items-center group cursor-pointer" onClick={() => setSelectedWork(work)}>
                              <h3 className="font-display text-2xl md:text-[2.5vw] uppercase font-bold text-stone-700 group-hover:text-white transition-colors duration-500 px-3">{work.title}</h3>
                              <MarqueeDot />
                           </div>
                        ))}
                      </motion.div>
                   </div>

                   {/* Row 2 — scrolls right (reversed) */}
                   <div className="relative flex whitespace-nowrap overflow-hidden py-3">
                      <motion.div 
                        animate={{ x: ["-50%", "0%"] }} 
                        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                        className="flex items-center"
                      >
                        {marqueeItems.map((work, i) => (
                           <div key={`r2-${i}`} className="flex items-center group cursor-pointer" onClick={() => setSelectedWork(work)}>
                              <h3 className="font-display text-lg md:text-[1.5vw] uppercase font-bold text-stone-800 group-hover:text-indigo-400 transition-colors duration-500 px-3 italic">{work.category} — {work.title}</h3>
                              <span className="text-stone-800/30 text-xs mx-2 select-none">◆</span>
                           </div>
                        ))}
                      </motion.div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* ----------- ABOUT SECTION ----------- */}
          <section id="about" className="relative z-10 pt-40 pb-64 px-4 md:px-10">
            <motion.div onViewportEnter={() => setActiveTab("About")} viewport={{ margin: "-20%", amount: 0.15 }}>
               <div className="max-w-[1400px] mx-auto" style={{ perspective: "1200px" }}>
                  <FocalCameraBlur offset={["start end", "center center"]} blurStrength={2}>
                    <motion.div style={{ x: driftRight }}>
                      <motion.h1 
                         initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                         style={{ transformOrigin: "center bottom" }}
                         className="font-display text-4xl md:text-[6vw] max-w-[85vw] font-bold uppercase tracking-tight mb-28 leading-[0.9]"
                      >
                         LocusPath is a creative agency driven by pixel-perfect design.
                      </motion.h1>
                    </motion.div>
                  </FocalCameraBlur>

                  <div className="grid md:grid-cols-2 gap-16">
                    <motion.div 
                      initial="hidden" whileInView="visible" viewport={{ once: true }}
                      variants={section3DReveal}
                      style={{ transformOrigin: "left center" }}
                    >
                      <MagneticFloat force={10}>
                        <div>
                          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white mb-4">Services</h2>
                          <p className="text-stone-400 font-medium max-w-sm leading-relaxed">We develop hyper-interactive brand systems and fluid digital experiences for elite technical companies.</p>
                        </div>
                      </MagneticFloat>
                    </motion.div>
                    
                    <div className="space-y-10">
                      {services.map((srv, i) => (
                        <motion.div 
                          key={i}
                          initial="hidden" whileInView="visible" viewport={{ once: true }}
                          variants={staggerText}
                          transition={{ delay: i * 0.08 }}
                          className="group border-b border-white/10 pb-6"
                        >
                          <div className="flex justify-between items-baseline mb-3">
                            <span className="text-xs text-stone-500 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                            <ArrowUpRight className="w-4 h-4 text-stone-500 transition-transform group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </div>
                          <h3 className="font-display text-xl md:text-2xl uppercase font-bold text-stone-300">{srv.title}</h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {srv.points.map(pt => (
                              <span key={pt} className="text-[9px] uppercase tracking-widest text-stone-500 border border-white/10 rounded-full px-3 py-1.5 bg-white/5">
                                {pt}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-40" style={{ perspective: "1000px" }}>
                     <motion.h2 
                       initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                       className="font-display text-4xl font-bold uppercase mb-14 text-stone-500 border-b border-white/10 pb-8"
                     >
                       Protocol Overview
                     </motion.h2>
                     <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {processSteps.map((step, i) => (
                           <motion.div
                             key={step.title}
                             initial="hidden" whileInView="visible" viewport={{ once: true }}
                             variants={card3DReveal} 
                             transition={{ delay: i * 0.12 }}
                             style={{ transformOrigin: "center bottom" }}
                           >
                             <MagneticFloat force={15}>
                               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-colors relative h-full flex flex-col justify-end backdrop-blur-xl">
                                  <span className="font-display text-7xl font-bold italic opacity-[0.03] absolute top-3 right-5 text-white">{i+1}</span>
                                  <div className="pt-20 relative z-10">
                                    <h3 className="font-display text-xl uppercase font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-xs text-stone-400 leading-relaxed max-w-[200px]">{step.text}</p>
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
        </div>
      </VelocityStretch>

      {/* ----------- SCALE TO FILL MODAL ----------- */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateX: 5 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateX: -5 }}
            transition={{ ease: easeHighFashion, duration: 1 }}
            className="fixed inset-0 z-[100] bg-[#050505] text-[#f5f5f5] overflow-y-auto hide-scrollbar"
            style={{ perspective: "1000px", transformOrigin: "center center" }}
            data-lenis-prevent="true"
          >
            <motion.div layoutId={`proj-container-${selectedWork.id}`} className="relative h-[70vh] w-full bg-black">
              <motion.img 
                layoutId={`proj-img-${selectedWork.id}`}
                src={selectedWork.img}
                className="w-full h-full object-cover opacity-60"
              />
              <button 
                onClick={() => setSelectedWork(null)}
                className="fixed top-8 left-8 md:top-10 md:left-10 px-6 py-3 bg-[#0a0a0a]/80 border border-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all z-[110] text-white group shadow-2xl"
              >
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-black transition-colors" />
                   <span className="font-display font-bold uppercase tracking-[0.2em] text-xs">Close</span>
                </div>
              </button>
            </motion.div>

            <div className="max-w-[1400px] mx-auto py-16 relative -mt-28 z-10 px-4 md:px-10" style={{ perspective: "1000px" }}>
              <MagneticFloat force={5}>
                <div className="bg-[#111] p-8 md:p-20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 relative w-full">
                  <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="space-y-6"
                  >
                    <motion.div variants={staggerText}>
                      <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">{selectedWork.category}</p>
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
