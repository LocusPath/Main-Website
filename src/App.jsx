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

// Liquid Ripple & Chromatic Aberration Transition (DOM based)
const liquidDropIn = {
  hidden: { opacity: 0, filter: "url(#liquidMask) blur(6px)", scale: 0.98, y: 30 },
  visible: { 
    opacity: 1, filter: "none", scale: 1, y: 0, 
    transition: { ease: easeHighFashion, duration: 1.5 } 
  }
};

const staggerText = {
  hidden: { opacity: 0, filter: "url(#liquidMask)", y: 20 },
  visible: { opacity: 1, filter: "none", y: 0, transition: { ease: easeHighFashion, duration: 1.2 } }
};

// --- PHYSICS ENGINES ---

const VelocityStretch = ({ children }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 100, stiffness: 600 });
  const velocityScaleY = useTransform(smoothVelocity, [-1500, 1500], [0.96, 1.04]);
  const velocityScaleX = useTransform(smoothVelocity, [-1500, 1500], [1.02, 0.98]);

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

  // Generate a random unique duration for the infinite sine wave
  const randomDuration = useRef(4 + Math.random() * 2).current;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
  
  // Wider range in the middle (0.2 to 0.8) where blur is exactly 0
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [blurStrength, 0, 0, blurStrength]);
  
  // Use 'none' when blur is 0 to ensure absolute clarity
  const filter = useTransform(blur, value => value <= 0.1 ? "none" : `blur(${value}px)`);
  
  return (
    <motion.div ref={ref} style={{ filter }}>
      {children}
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedWork, setSelectedWork] = useState(null);

  // Laminar Flow - Gentle continuous side drifts based on overall document scroll
  const { scrollYProgress } = useScroll();
  const driftLeft = useTransform(scrollYProgress, [0, 1], ["0vw", "-5vw"]);
  const driftRight = useTransform(scrollYProgress, [0, 1], ["0vw", "5vw"]);

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
      
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.25] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Persistent Nav (Pill) -> Magnetic Micro Float */}
      <div className="fixed bottom-12 w-full flex justify-center z-50 pointer-events-auto perspective-[1000px]">
        <MagneticFloat force={15}>
           <motion.nav 
             initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1.2, ease: easeHighFashion }}
             className="flex items-center gap-2 rounded-full bg-[#111]/80 border border-white/10 backdrop-blur-xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
           >
             {/* Dynamic chromatic refraction on the background of the nav */}
             <div className="absolute inset-0 z-[-1] opacity-50 pointer-events-none bg-gradient-to-r from-red-500/20 via-blue-500/20 to-green-500/20 blur-md mix-blend-screen" />

             {["Home", "Work", "Archive", "About"].map((item) => (
               <button 
                 key={item} onClick={() => handleNavClick(item)}
                 className={`relative px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors duration-500 z-10 ${activeTab === item ? 'text-black' : 'text-stone-400 hover:text-white'}`}
               >
                 {activeTab === item && (
                   <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
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
        <div className="relative w-full z-10 overflow-hidden">
          
          {/* ----------- HOME SECTION ----------- */}
          <section id="home">
              <motion.div onViewportEnter={() => setActiveTab("Home")} viewport={{ amount: 0.5, margin: "-100px" }}>
                <div className="h-[120vh] w-full relative flex flex-col items-center justify-center -z-10">
                  <FocalCameraBlur blurStrength={5}>
                    <motion.div style={{ x: driftLeft }} className="text-center px-4 relative z-10">
                      <div className="overflow-hidden pb-4">
                        <motion.h1 
                          initial="hidden" animate="visible" variants={liquidDropIn}
                          className="font-display font-bold text-[13vw] leading-[0.8] tracking-tighter uppercase"
                        >
                          L/OCUS
                        </motion.h1>
                      </div>
                      <div className="overflow-hidden pb-4">
                        <motion.h1 
                          initial="hidden" animate="visible" variants={liquidDropIn} transition={{ delay: 0.1 }}
                          className="font-display font-bold text-[13vw] leading-[0.8] tracking-tighter uppercase text-stone-300"
                        >
                          PATH
                        </motion.h1>
                      </div>
                      <motion.p 
                        initial="hidden" animate="visible" variants={liquidDropIn} transition={{ delay: 0.2 }}
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
               <div className="max-w-[1600px] mx-auto py-10 perspective-[1000px]">
                  <FocalCameraBlur offset={["start end", "center center"]} blurStrength={2}>
                    <motion.h1 
                       initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                       className="font-display text-4xl md:text-8xl font-bold uppercase tracking-tighter mb-20 text-stone-900 border-b border-black/10 pb-10"
                    >
                       Selected Works
                    </motion.h1>
                  </FocalCameraBlur>
                  
                  <motion.div style={{ x: driftRight }} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-14">
                    {works.map((work, i) => (
                      <motion.div 
                        key={work.id}
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                        variants={staggerText}
                        transition={{ delay: i * 0.1 }}
                      >
                         <MagneticFloat force={8}>
                           <div className="group relative cursor-pointer w-full h-full" onClick={() => setSelectedWork(work)}>
                              {/* Scale-and-Stretch happens automatically under VelocityStretch, but we give the image extra Z-depth */}
                             <motion.div layoutId={`proj-container-${work.id}`} className="overflow-hidden rounded-2xl bg-stone-200 aspect-[4/5] relative shadow-lg group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition-shadow duration-500">
                               <motion.img 
                                 layoutId={`proj-img-${work.id}`}
                                 whileHover={{ scale: 1.05, filter: "saturate(1.1)" }}
                                 transition={{ duration: 1.5, ease: easeHighFashion }}
                                 src={work.img} alt={work.title} 
                                 className="w-full h-full object-cover"
                               />
                             </motion.div>
                             <div className="mt-8 flex flex-col items-start gap-2">
                               <h3 className="font-display text-2xl font-bold uppercase text-stone-900 group-hover:text-red-600 transition-colors">{work.title}</h3>
                               <span className="text-[10px] uppercase tracking-[0.2em] text-red-600 border border-red-600/30 px-4 py-1 rounded-full font-bold">{work.category}</span>
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
        <section id="archive" className="relative z-10 py-32 border-y border-white/5 overflow-hidden">
          <motion.div onViewportEnter={() => setActiveTab("Archive")} viewport={{ margin: "-30%", amount: 0.2 }}>
            <div className="flex flex-col gap-6">
               <div className="px-4 md:px-10 max-w-[1600px] mx-auto w-full">
                  <FocalCameraBlur offset={["start end", "center center"]} blurStrength={2}>
                    <motion.h1 
                       initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                       className="font-display text-xl md:text-3xl font-bold uppercase tracking-tight text-stone-500 mb-2"
                    >
                       The Archive
                    </motion.h1>
                  </FocalCameraBlur>
               </div>

               {/* The Marquee Row */}
               <div className="relative flex whitespace-nowrap overflow-hidden py-6">
                  <motion.div 
                    animate={{ x: ["0%", "-50%"] }} 
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-10 pr-10"
                  >
                    {[...works, ...works, ...works, ...works].map((work, i) => (
                       <div 
                          key={i} 
                          className="flex items-baseline gap-4 group cursor-pointer"
                          onClick={() => setSelectedWork(work)}
                       >
                          <h3 className="font-display text-3xl md:text-[4vw] uppercase font-bold text-stone-800 group-hover:text-white transition-all duration-700 group-hover:scale-[1.02]">{work.title}</h3>
                          <span className="font-mono text-xs md:text-sm text-red-600 opacity-30 group-hover:opacity-100 transition-opacity">/{work.category}</span>
                       </div>
                    ))}
                  </motion.div>
               </div>
            </div>
          </motion.div>
        </section>

          {/* ----------- ABOUT SECTION ----------- */}
          <section id="about" className="relative z-10 pt-48 pb-64 px-4 md:px-10">
            <motion.div onViewportEnter={() => setActiveTab("About")} viewport={{ margin: "-30%", amount: 0.2 }}>
               <div className="max-w-[1600px] mx-auto perspective-[1200px]">
                  <FocalCameraBlur offset={["start end", "center center" ]} blurStrength={3}>
                    <motion.div style={{ x: driftRight }}>
                      <motion.h1 
                         initial="hidden" whileInView="visible" viewport={{ once: true }} variants={liquidDropIn}
                         className="font-display text-5xl md:text-[7vw] max-w-[90vw] font-bold uppercase tracking-tight mb-32 leading-[0.9]"
                      >
                         LocusPath is an agency driven by zero-gravity physics.
                      </motion.h1>
                    </motion.div>
                  </FocalCameraBlur>

                  <div className="grid md:grid-cols-2 gap-20">
                    <MagneticFloat force={10}>
                      <div>
                        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white mb-6">Services</h2>
                        <p className="text-stone-400 font-medium max-w-sm leading-relaxed text-lg">We develop hyper-interactive brand systems and fluid digital experiences for elite technical companies.</p>
                      </div>
                    </MagneticFloat>
                    
                    <div className="space-y-12">
                      {services.map((srv, i) => (
                        <motion.div 
                          key={i}
                          initial="hidden" whileInView="visible" viewport={{ once: true }}
                          variants={staggerText}
                          className="group border-b border-white/10 pb-6"
                        >
                          <div className="flex justify-between items-baseline mb-4">
                            <span className="text-xs text-stone-500 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                            <ArrowUpRight className="w-5 h-5 text-stone-400 transition-transform group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </div>
                          <h3 className="font-display text-2xl md:text-3xl uppercase font-bold text-stone-300">{srv.title}</h3>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {srv.points.map(pt => (
                              <span key={pt} className="text-[10px] uppercase tracking-widest text-stone-500 border border-white/10 rounded-full px-4 py-2 bg-white/5">
                                {pt}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-48">
                     <h2 className="font-display text-5xl font-bold uppercase mb-16 text-stone-500 border-b border-white/10 pb-10">Protocol Overview</h2>
                     <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {processSteps.map((step, i) => (
                           <MagneticFloat key={step.title} force={15}>
                             <motion.div 
                                initial="hidden" whileInView="visible" viewport={{ once: true }}
                                variants={liquidDropIn} transition={{ delay: i * 0.15 }}
                                className="p-10 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-colors relative h-full flex flex-col justify-end backdrop-blur-xl"
                             >
                                <span className="font-display text-8xl font-bold italic opacity-[0.03] absolute top-4 right-6 text-white">{i+1}</span>
                                <div className="pt-24 relative z-10">
                                  <h3 className="font-display text-2xl uppercase font-bold text-white mb-4">{step.title}</h3>
                                  <p className="text-sm text-stone-400 leading-relaxed max-w-[200px]">{step.text}</p>
                                </div>
                             </motion.div>
                           </MagneticFloat>
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
            initial={{ opacity: 0, filter: "url(#liquidMask) blur(10px)" }} 
            animate={{ opacity: 1, filter: "blur(0px)" }} 
            exit={{ opacity: 0, filter: "url(#liquidMask) blur(10px)" }}
            transition={{ ease: easeHighFashion, duration: 1.2 }}
            className="fixed inset-0 z-[100] bg-[#050505] text-[#f5f5f5] overflow-y-auto hide-scrollbar"
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
                className="fixed top-8 left-8 md:top-12 md:left-12 px-8 py-4 bg-[#0a0a0a]/80 border border-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all z-[110] text-white group shadow-2xl"
              >
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-black transition-colors" />
                   <span className="font-display font-bold uppercase tracking-[0.2em] text-sm">Close Project</span>
                </div>
              </button>
            </motion.div>

            <div className="max-w-[1600px] mx-auto py-20 relative -mt-32 z-10 px-4 md:px-10 perspective-[1000px]">
              <MagneticFloat force={5}>
                <div className="bg-[#111] p-10 md:p-24 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 relative w-full">
                  <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="space-y-6"
                  >
                    <motion.div variants={staggerText}>
                      <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">{selectedWork.category}</p>
                      <h2 className="font-display text-5xl md:text-[8vw] font-bold uppercase leading-[0.9] tracking-tight">{selectedWork.title}</h2>
                    </motion.div>
                    
                    <motion.div variants={staggerText} className="grid md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-white/10">
                      <div><p className="text-stone-400 text-xl leading-relaxed max-w-lg">{selectedWork.text}</p></div>
                      <div className="space-y-6">
                        <div>
                          <p className="text-stone-500 uppercase tracking-widest text-xs mb-1">Art Direction</p>
                          <p className="font-display text-2xl uppercase font-bold text-stone-200">{selectedWork.artDir}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 uppercase tracking-widest text-xs mb-1">Visual Design</p>
                          <p className="font-display text-2xl uppercase font-bold text-stone-200">{selectedWork.visual}</p>
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
