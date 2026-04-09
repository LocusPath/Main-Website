import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
    text: "Complete brand redesign and website for an artisan coffee shop.",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop",
    artDir: "John Doe",
    visual: "LocusPath Team"
  },
  {
    id: "w2",
    category: "Retail",
    title: "Luxe Avenue",
    text: "Full e-commerce platform for a luxury fashion boutique.",
    img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1600&auto=format&fit=crop",
    artDir: "Jane Smith",
    visual: "Studio Alpha"
  },
  {
    id: "w3",
    category: "Tech",
    title: "Aura Systems",
    text: "Dark-mode dashboard with interactive 3D data visualization.",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    artDir: "LocusPath",
    visual: "In-house"
  }
];

// --- Components ---

const NavBar = () => {
  return (
    <div className="fixed bottom-8 w-full flex justify-center z-50 pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#111]/80 border border-white/10 backdrop-blur-xl px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
      >
        {["Home", "Work", "Archive", "About"].map((item) => (
          <button key={item} className="px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase text-stone-400 hover:text-white hover:bg-white/10 transition-colors">
            {item}
          </button>
        ))}
      </motion.nav>
    </div>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-red-600 selection:text-white">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Deep Red Bottom Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-[800px] pointer-events-none bg-red-aura z-0 opacity-40 mix-blend-screen" />

      <NavBar />

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-center px-4">
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="font-display font-bold text-[12vw] leading-[0.8] tracking-tighter uppercase"
              >
                L/OCUS
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="font-display font-bold text-[12vw] leading-[0.8] tracking-tighter uppercase"
              >
                PATH
              </motion.h1>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-8 text-stone-400 max-w-lg mx-auto text-sm md:text-base font-medium tracking-wide uppercase"
            >
              Interactive web design. Brutalist minimalism. Contemporary & precise.
            </motion.p>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-stone-500 to-transparent animate-float" />
          </motion.div>
        </section>

        {/* SERVICES (Swiss Typography layout) */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="section-shell py-32 md:py-48"
        >
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="font-display text-4xl md:text-7xl font-bold uppercase leading-none tracking-tight">Services</h2>
              <p className="mt-6 text-stone-400 max-w-md">Services that transform. We partner with elite brands to create digital presences that convert.</p>
            </div>
            <div className="space-y-12">
              {services.map((srv, i) => (
                <div key={i} className="group border-b border-white/10 pb-6">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs text-stone-500 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                    <ArrowUpRight className="w-5 h-5 text-stone-600 transition-transform group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <h3 className="font-display text-2xl md:text-4xl uppercase font-bold tracking-tight">{srv.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {srv.points.map(pt => (
                      <span key={pt} className="text-xs uppercase tracking-widest text-stone-400 border border-white/10 rounded-full px-3 py-1">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* WORKS ARCHIVE (Masonry style / Expansive cards) */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="section-shell py-32"
        >
          <div className="flex justify-between items-end mb-20">
            <h2 className="font-display text-4xl md:text-7xl font-bold uppercase leading-none tracking-tight">Archive</h2>
            <p className="hidden md:block uppercase tracking-widest text-xs text-red-500">Selected Works 2026</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work, i) => (
              <motion.div 
                key={work.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative cursor-pointer"
              >
                <div className="overflow-hidden rounded-md bg-[#111] aspect-[4/5] relative">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    src={work.img} 
                    alt={work.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 mb-2">{work.category}</p>
                    <h3 className="font-display text-3xl font-bold uppercase">{work.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PROCESS WITH 3D/Hover feel */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="section-shell py-32 border-t border-white/5 relative"
        >
          <h2 className="font-display text-4xl md:text-7xl font-bold uppercase leading-none tracking-tight mb-20 text-center">Protocol</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {processSteps.map((step, i) => (
              <div key={step.title} className="p-8 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="font-display text-8xl font-bold italic">{i+1}</span>
                </div>
                <h3 className="font-display text-xl uppercase font-bold text-white mb-4">{step.title}</h3>
                <p className="text-sm text-stone-400 relative z-10">{step.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* FOOTER */}
        <motion.footer 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="section-shell py-32 border-t border-red-900/30"
        >
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="font-display text-5xl md:text-8xl font-bold uppercase leading-none tracking-tight">Let's<br/>Connect.</h2>
              <p className="mt-8 text-stone-400">locus.path1@gmail.com</p>
              <p className="text-stone-400">+91 8467853399 / +91 8287768083</p>
            </div>
            <div className="flex flex-col justify-end items-start md:items-end gap-4">
              <a href="#" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-white transition-colors text-stone-400">Twitter(X)</a>
              <a href="#" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-white transition-colors text-stone-400">Instagram</a>
              <a href="#" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-white transition-colors text-stone-400">Github</a>
            </div>
          </div>
          <p className="mt-32 text-center text-[10px] uppercase tracking-[0.3em] text-stone-600">
            © 2026 LocusPath. All Rights Reserved. Crafted with deep red gradients.
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
