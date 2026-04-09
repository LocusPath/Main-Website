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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ease: easeHighFashion, duration: 1 } }
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
      lerp: 0.05, // Buttery smooth slightly delayed
      smoothWheel: true,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 400]);

  return (
    <div className="bg-[#050505] selection:bg-red-600 selection:text-white min-h-screen font-sans antialiased overflow-x-hidden">
      
      {/* Morphing Nav Pill to Canvas Transition Background */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
         <AnimatePresence mode="wait">
            <motion.div 
               key={activeTab}
               layoutId={`nav-bg-${activeTab}`}
               initial={{ opacity: 0.5, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.05 }}
               transition={{ duration: 1.2, ease: easeHighFashion }}
               className={`absolute inset-0 w-full h-full ${activeTab === 'Home' ? 'bg-[#050505]' : activeTab === 'Work' ? 'bg-[#f5f5f5]' : 'bg-[#0a0a0a]'}`}
            />
         </AnimatePresence>
      </div>

      {/* Persistent Nav */}
      <div className="fixed bottom-8 w-full flex justify-center z-50 pointer-events-none">
        <motion.nav 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1.2, ease: easeHighFashion }}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#111]/80 border border-white/10 backdrop-blur-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.7)] relative"
        >
          {["Home", "Work", "Archive", "About"].map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors z-10 ${activeTab === item ? 'text-black' : 'text-stone-400 hover:text-white'}`}
            >
              {activeTab === item && (
                <motion.div 
                   layoutId={`nav-bg-${item}`}
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
         {activeTab === "Home" && (
            <motion.div 
              key="home-page"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: easeHighFashion }}
              className="relative w-full"
            >
              <div className="noise-overlay opacity-20" />
              <div className="fixed bottom-0 left-0 right-0 h-[800px] pointer-events-none bg-red-aura z-0 opacity-40 mix-blend-screen" />

              {/* Physical sliding dark back-layer setup */}
              <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden -z-10 text-[#f5f5f5]">
                <motion.div style={{ y: yHero }} className="text-center px-4 relative z-10">
                  <div className="overflow-hidden">
                    <motion.h1 
                      initial={{ y: "100%" }} animate={{ y: 0 }}
                      transition={{ duration: 1.5, ease: easeHighFashion, delay: 0.1 }}
                      className="font-display font-bold text-[12vw] leading-[0.8] tracking-tighter uppercase"
                    >
                      L/OCUS
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h1 
                      initial={{ y: "100%" }} animate={{ y: 0 }}
                      transition={{ duration: 1.5, ease: easeHighFashion, delay: 0.2 }}
                      className="font-display font-bold text-[12vw] leading-[0.8] tracking-tighter uppercase text-stone-300"
                    >
                      PATH
                    </motion.h1>
                  </div>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1.2, ease: easeHighFashion }}
                    className="mt-8 text-stone-400 max-w-lg mx-auto text-sm md:text-base font-medium tracking-wide uppercase"
                  >
                    Canvas-first interactive web design. Brutalist minimalist evolution.
                  </motion.p>
                </motion.div>
              </div>

              {/* White Sliding Panel (The Physical Slide Over) */}
              <main className="relative z-10 bg-[#f5f5f5] text-[#050505] rounded-t-[3rem] mt-[100vh] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                
                {/* RECENT WORK - Scale-to-Fill Grid */}
                <section className="section-shell py-32">
                  <ParallaxHeader offset={150}>
                    <h2 className="font-display text-5xl md:text-8xl font-bold uppercase leading-none tracking-tight opacity-10">Recent Work</h2>
                    <h2 className="font-display text-5xl md:text-8xl font-bold uppercase leading-none tracking-tight absolute inset-0 bg-clip-text text-transparent bg-gradient-to-b from-[#050505] to-transparent">Recent Work</h2>
                  </ParallaxHeader>
                  
                  <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {works.map((work, i) => (
                      <motion.div 
                        key={work.id}
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
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
                          <h3 className="font-display text-xl font-bold uppercase">{work.title}</h3>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-red-600 font-bold">{work.category}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* SERVICES WITH PARALLAX OFFSETS */}
                <section className="section-shell py-32 border-t border-stone-200">
                  <div className="grid md:grid-cols-2 gap-20">
                    <ParallaxHeader offset={80}>
                      <h2 className="font-display text-4xl md:text-7xl font-bold uppercase leading-none tracking-tight text-stone-800">Services</h2>
                      <p className="mt-6 text-stone-500 max-w-md font-medium">Services that transform. We partner with elite brands to create fluid, canvas-driven presences.</p>
                    </ParallaxHeader>
                    
                    <div className="space-y-12 relative z-10">
                      {services.map((srv, i) => (
                        <motion.div 
                          key={i}
                          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                          variants={staggerText}
                          className="group border-b border-stone-300 pb-6"
                        >
                          <div className="flex justify-between items-baseline mb-4">
                            <span className="text-xs text-stone-400 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                            <ArrowUpRight className="w-5 h-5 text-stone-800 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </div>
                          <h3 className="font-display text-2xl md:text-4xl uppercase font-bold tracking-tight text-stone-900">{srv.title}</h3>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {srv.points.map(pt => (
                              <span key={pt} className="text-xs uppercase tracking-widest text-stone-500 border border-stone-300 rounded-full px-3 py-1">
                                {pt}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

              </main>

            </motion.div>
         )}

         {activeTab === "About" && (
            <motion.div 
              key="about-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: easeHighFashion }}
              className="relative w-full min-h-screen flex items-center justify-center text-white"
            >
               <h1 className="text-4xl font-display uppercase tracking-widest">About Canvas</h1>
            </motion.div>
         )}
         {/* Additional tabs can follow similar structure */}
      </AnimatePresence>

      {/* Project Deep-Dive Scale-to-Fill Modal */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505] text-[#f5f5f5] overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <motion.div layoutId={`proj-container-${selectedWork.id}`} className="relative h-[70vh] w-full">
              <motion.img 
                layoutId={`proj-img-${selectedWork.id}`}
                src={selectedWork.img}
                className="w-full h-full object-cover brightness-75"
              />
              <button 
                onClick={() => setSelectedWork(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-50 text-white"
              >
                <X className="w-5 h-5"/>
              </button>
            </motion.div>

            <div className="section-shell py-20 relative -mt-32">
              <div className="bg-[#111] p-10 md:p-20 rounded-3xl shadow-2xl relative">
                <motion.div 
                  initial="hidden" animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-6"
                >
                  <motion.div variants={staggerText}>
                    <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">{selectedWork.category}</p>
                    <h2 className="font-display text-5xl md:text-8xl font-bold uppercase leading-none tracking-tight">{selectedWork.title}</h2>
                  </motion.div>
                  
                  <motion.div variants={staggerText} className="grid md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-white/10">
                    <div>
                      <p className="text-stone-400 text-lg leading-relaxed">{selectedWork.text}</p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-stone-500 uppercase tracking-widest text-xs mb-1">Art Direction</p>
                        <p className="font-display text-xl uppercase font-bold">{selectedWork.artDir}</p>
                      </div>
                      <div>
                        <p className="text-stone-500 uppercase tracking-widest text-xs mb-1">Visual Design</p>
                        <p className="font-display text-xl uppercase font-bold">{selectedWork.visual}</p>
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
