import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

// --- Utilities ---
const easeHighFashion = [0.22, 1, 0.36, 1]; // High-fashion snap and smooth
const staggerText = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { ease: easeHighFashion, duration: 1.2 } }
};

// --- Components ---
const ParallaxHeader = ({ children, offset = 100 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative z-0">
      {children}
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedWork, setSelectedWork] = useState(null);

  // Initialize smooth scrolling with Lerp (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05, 
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Keep black canvas always; only move this accent element per tab
  const accentMap = {
    Home: {
      x: "-28vw",
      y: "-22vh",
      scale: 1,
      opacity: 0.5,
      background:
        "radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(0,0,0,0) 70%)"
    },
    Work: {
      x: "24vw",
      y: "-15vh",
      scale: 1.15,
      opacity: 0.4,
      background:
        "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 38%, rgba(0,0,0,0) 70%)"
    },
    Archive: {
      x: "18vw",
      y: "22vh",
      scale: 1.05,
      opacity: 0.35,
      background:
        "radial-gradient(circle at center, rgba(220,38,38,0.18) 0%, rgba(220,38,38,0.05) 35%, rgba(0,0,0,0) 70%)"
    },
    About: {
      x: "-20vw",
      y: "18vh",
      scale: 1.1,
      opacity: 0.42,
      background:
      x: "-20vw", y: "18vh", scale: 1.1, opacity: 0.42,
      background: "radial-gradient(circle at center, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 70%)"
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] font-sans antialiased selection:bg-red-600 selection:text-white overflow-hidden">
      {/* Background element morphing through tabs */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[85vmax] w-[85vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-50"
        animate={accentMap[activeTab]}
        transition={{ duration: 1.5, ease: easeHighFashion }}
      />
      
      {/* Global Noise */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Persistent Nav (Pill) */}
      <div className="fixed bottom-8 w-full flex justify-center z-50 pointer-events-none">
        <motion.nav 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: easeHighFashion }}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#111]/90 border border-white/10 backdrop-blur-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.7)] relative"
        >
          {["Home", "Work", "Archive", "About"].map((item) => (
            <button 
              key={item} 
              onClick={() => {
                window.scrollTo(0, 0);
                setActiveTab(item);
              }}
              className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors duration-500 z-10 ${activeTab === item ? 'text-black' : 'text-stone-400 hover:text-white'}`}
            >
              {activeTab === item && (
                <motion.div 
                   layoutId="active-pill"
                   className="absolute inset-0 bg-white rounded-full -z-10"
                   transition={{ duration: 0.8, ease: easeHighFashion }}
                />
              )}
              {item}
            </button>
          ))}
        </motion.nav>
      </div>

      <AnimatePresence mode="wait">
         {/* ----------- HOME PAGE ----------- */}
         {activeTab === "Home" && (
            <motion.div 
              key="home-page"
              initial={{ clipPath: "circle(0% at 50% 100%)", opacity: 0 }}
              animate={{ clipPath: "circle(150% at 50% 100%)", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: easeHighFashion }}
              className="relative w-full text-[#f5f5f5]"
            >
              {/* Deep Red Bottom Glow specific to Home */}
              <div className="fixed bottom-0 left-0 right-0 h-[600px] pointer-events-none bg-red-aura z-0 opacity-60 mix-blend-screen" />

              {/* Sticky Landing / Physical Slide Over Container */}
              <div className="relative w-full">
                {/* The Sticky Layer */}
                <div className="h-screen w-full sticky top-0 flex flex-col items-center justify-center overflow-hidden -z-10 bg-[#050505]">
                  <motion.div className="text-center px-4 relative z-10">
                    <div className="overflow-hidden pb-4">
                      <motion.h1 
                        initial={{ y: "100%" }} animate={{ y: 0 }}
                        transition={{ duration: 1.5, ease: easeHighFashion, delay: 0.2 }}
                        className="font-display font-bold text-[13vw] leading-[0.8] tracking-tighter uppercase"
                      >
                        L/OCUS
                      </motion.h1>
                    </div>
                    <div className="overflow-hidden pb-4">
                      <motion.h1 
                        initial={{ y: "100%" }} animate={{ y: 0 }}
                        transition={{ duration: 1.5, ease: easeHighFashion, delay: 0.3 }}
                        className="font-display font-bold text-[13vw] leading-[0.8] tracking-tighter uppercase text-stone-300"
                      >
                        PATH
                      </motion.h1>
                    </div>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 1.2, ease: easeHighFashion }}
                      className="mt-8 text-stone-400 max-w-lg mx-auto text-sm md:text-base font-medium tracking-wide uppercase"
                    >
                      Canvas-first interactive web design. Brutalist minimalist evolution.
                    </motion.p>
                  </motion.div>
                </div>

                {/* The Paper Sliding Over (Starts exactly at bottom of screen) */}
                <main className="relative z-10 bg-[#f5f5f5] text-[#050505] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-32">
                  <section className="section-shell pt-32 pb-20">
                    <ParallaxHeader offset={150}>
                      <h2 className="font-display text-5xl md:text-8xl font-bold uppercase leading-none tracking-tight opacity-10">Recent Work</h2>
                      <h2 className="font-display text-5xl md:text-8xl font-bold uppercase leading-none tracking-tight absolute inset-0 bg-clip-text text-transparent bg-gradient-to-b from-[#050505] to-transparent">Recent Work</h2>
                    </ParallaxHeader>
                    
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      {works.slice(0, 2).map((work, i) => (
                        <motion.div 
                          key={work.id}
                          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }}
                          variants={staggerText}
                          transition={{ delay: i * 0.1 }}
                          className="group relative cursor-pointer"
                          onClick={() => setSelectedWork(work)}
                        >
                          <motion.div layoutId={`proj-container-${work.id}`} className="overflow-hidden rounded-xl bg-stone-200 aspect-[4/5] relative">
                            <motion.img 
                              layoutId={`proj-img-${work.id}`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.8, ease: easeHighFashion }}
                              src={work.img} alt={work.title} 
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <div className="mt-4 flex justify-between items-baseline">
                            <h3 className="font-display text-2xl font-bold uppercase">{work.title}</h3>
                            <span className="text-xs uppercase tracking-[0.2em] text-red-600 font-bold">{work.category}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </main>
              </div>
            </motion.div>
         )}

         {/* ----------- WORK PAGE ----------- */}
         {activeTab === "Work" && (
            <motion.div 
              key="work-page"
              initial={{ clipPath: "circle(0% at 50% 100%)", opacity: 0 }}
              animate={{ clipPath: "circle(150% at 50% 100%)", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: easeHighFashion }}
              className="relative w-full min-h-screen text-[#f5f5f5] pt-32 pb-48"
            >
               <div className="section-shell">
                  <motion.h1 
                     initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 1.2, ease: easeHighFashion }}
                     className="font-display text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-20 text-stone-100"
                  >
                     All Works
                  </motion.h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {works.map((work, i) => (
                      <motion.div 
                        key={work.id}
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={staggerText}
                        transition={{ delay: i * 0.1 }}
                        className="group relative cursor-pointer"
                        onClick={() => setSelectedWork(work)}
                      >
                        <motion.div layoutId={`proj-container-${work.id}`} className="overflow-hidden rounded-xl bg-stone-200 aspect-square relative">
                          <motion.img 
                            layoutId={`proj-img-${work.id}`}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.8, ease: easeHighFashion }}
                            src={work.img} alt={work.title} 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <div className="mt-4">
                          <h3 className="font-display text-xl font-bold uppercase text-stone-100">{work.title}</h3>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold">{work.category}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
               </div>
            </motion.div>
         )}

         {/* ----------- ARCHIVE PAGE ----------- */}
         {activeTab === "Archive" && (
            <motion.div 
              key="archive-page"
              initial={{ clipPath: "circle(0% at 50% 100%)", opacity: 0 }}
              animate={{ clipPath: "circle(150% at 50% 100%)", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: easeHighFashion }}
              className="relative w-full min-h-screen text-[#f5f5f5] pt-32 pb-48"
            >
               <div className="section-shell">
                  <motion.h1 
                     initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 1.2, ease: easeHighFashion }}
                     className="font-display text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-20 text-stone-300"
                  >
                     The Archive
                  </motion.h1>
                  <div className="space-y-4">
                     {works.map((work, i) => (
                        <motion.div 
                           key={work.id}
                           initial="hidden" whileInView="visible" viewport={{ once: true }}
                           variants={staggerText}
                           transition={{ delay: i * 0.1 }}
                           className="flex w-full items-baseline justify-between border-b border-white/10 pb-4 hover:border-white transition-colors cursor-pointer"
                           onClick={() => setSelectedWork(work)}
                        >
                           <h3 className="font-display text-3xl md:text-5xl uppercase font-bold text-stone-400 hover:text-white transition-colors">{work.title}</h3>
                           <p className="font-mono text-sm uppercase text-stone-600">{work.category}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </motion.div>
         )}

         {/* ----------- ABOUT PAGE ----------- */}
         {activeTab === "About" && (
            <motion.div 
              key="about-page"
              initial={{ clipPath: "circle(0% at 50% 100%)", opacity: 0 }}
              animate={{ clipPath: "circle(150% at 50% 100%)", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: easeHighFashion }}
              className="relative w-full min-h-screen text-[#f5f5f5] pt-32 pb-48"
            >
               <div className="section-shell max-w-5xl">
                  <motion.h1 
                     initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 1.2, ease: easeHighFashion }}
                     className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-32 leading-[0.9]"
                  >
                     LocusPath is a creative agency driven by pixel-perfect design.
                  </motion.h1>

                  <div className="grid md:grid-cols-2 gap-20">
                    <ParallaxHeader offset={80}>
                      <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white">Services</h2>
                      <p className="mt-6 text-stone-400 font-medium">Services that transform. We partner with elite brands.</p>
                    </ParallaxHeader>
                    
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
                          <h3 className="font-display text-2xl uppercase font-bold text-stone-200">{srv.title}</h3>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {srv.points.map(pt => (
                              <span key={pt} className="text-[10px] uppercase tracking-widest text-stone-500 border border-white/10 rounded-full px-3 py-1">
                                {pt}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Protocol */}
                  <div className="mt-48">
                     <h2 className="font-display text-5xl font-bold uppercase mb-16 text-center text-stone-500">Protocol</h2>
                     <div className="grid md:grid-cols-4 gap-4">
                        {processSteps.map((step, i) => (
                           <motion.div 
                              key={step.title}
                              initial="hidden" whileInView="visible" viewport={{ once: true }}
                              variants={staggerText} transition={{ delay: i * 0.1 }}
                              className="p-8 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors relative"
                           >
                              <span className="font-display text-6xl font-bold italic opacity-10 absolute top-2 right-4">{i+1}</span>
                              <h3 className="font-display text-lg uppercase font-bold text-white mb-4 relative z-10">{step.title}</h3>
                              <p className="text-xs text-stone-400 relative z-10 leading-relaxed">{step.text}</p>
                           </motion.div>
                        ))}
                     </div>
                  </div>

               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* ----------- SCALE TO FILL MODAL ----------- */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                className="fixed top-8 left-8 md:top-12 md:left-12 px-8 py-4 bg-[#0a0a0a] border border-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all z-[110] text-white group shadow-2xl"
              >
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-black transition-colors" />
                   <span className="font-display font-bold uppercase tracking-[0.2em] text-sm">Close Project</span>
                </div>
              </button>
            </motion.div>

            <div className="section-shell py-20 relative -mt-32 z-10">
              <div className="bg-[#111] p-10 md:p-20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 relative">
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  className="space-y-6"
                >
                  <motion.div variants={staggerText}>
                    <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">{selectedWork.category}</p>
                    <h2 className="font-display text-5xl md:text-8xl font-bold uppercase leading-none tracking-tight">{selectedWork.title}</h2>
                  </motion.div>
                  
                  <motion.div variants={staggerText} className="grid md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-white/10">
                    <div><p className="text-stone-400 text-lg leading-relaxed">{selectedWork.text}</p></div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
