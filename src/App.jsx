import { motion, useScroll, useTransform, AnimatePresence, useVelocity, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ArrowUpRight, ArrowDown, X, Send, CheckCircle } from "lucide-react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- Shared mobile detection hook (avoids duplicate listeners) ---
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    let rafId;
    const check = () => { rafId = requestAnimationFrame(() => setIsMobile(window.innerWidth < breakpoint)); };
    window.addEventListener("resize", check, { passive: true });
    return () => { window.removeEventListener("resize", check); cancelAnimationFrame(rafId); };
  }, [breakpoint]);
  return isMobile;
};

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
    id: "w1", category: "Restaurant", title: "Basilico Blu",
    text: "Complete brand identity, website, and reservation system for a premium Indo-Italian fine-dining restaurant. Wood-fired artisan cuisine meets vibrant Indian spices.",
    img: "/restaurant/hero_dish.png",
    artDir: "LocusPath", visual: "In-house", year: "2025",
    isLive: true, liveUrl: "https://basilico-blu-1.vercel.app/"
  },
  {
    id: "w2", category: "Cafe", title: "Brew & Soul",
    text: "Full brand identity and immersive website for an artisan coffee experience. Bean-to-cup philosophy with curated single-origin selections.",
    img: "/works/cafe.png",
    artDir: "LocusPath", visual: "In-house", year: "2025",
    isLive: true, liveUrl: "https://brew-soul.vercel.app/"
  },
  {
    id: "w3", category: "Boutique", title: "Maison Élégance",
    text: "Luxury fashion boutique e-commerce platform with curated collections, editorial lookbooks, and an elite shopping experience.",
    img: "/works/boutique.png",
    artDir: "LocusPath", visual: "In-house", year: "2026",
    isLive: true, liveUrl: "https://mason-elegance-1.vercel.app/"
  }
];


const easeHighFashion = [0.22, 1, 0.36, 1];
const easePowerOut = [0.16, 1, 0.3, 1]; // fast start, buttery settle

// Mobile-friendly variants: lighter 3D transforms + shorter durations for smooth 60fps
const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;

const section3DReveal = {
  hidden: { opacity: 0, y: isMobileDevice ? 40 : 80, scale: isMobileDevice ? 0.98 : 0.96, ...(isMobileDevice ? {} : { rotateX: 8 }) },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { ease: easeHighFashion, duration: isMobileDevice ? 1.0 : 1.8 } }
};

const liquidDropIn = {
  hidden: { opacity: 0, y: isMobileDevice ? 25 : 40, scale: isMobileDevice ? 0.97 : 0.95, ...(isMobileDevice ? {} : { rotateX: 12 }) },
  visible: { opacity: 1, rotateX: 0, scale: 1, y: 0, transition: { ease: easeHighFashion, duration: isMobileDevice ? 0.8 : 1.5 } }
};

const staggerText = {
  hidden: { opacity: 0, y: isMobileDevice ? 16 : 25, ...(isMobileDevice ? {} : { rotateX: 6 }) },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { ease: easeHighFashion, duration: isMobileDevice ? 0.7 : 1.2 } }
};

const card3DReveal = {
  hidden: { opacity: 0, y: isMobileDevice ? 30 : 60, scale: isMobileDevice ? 0.95 : 0.9, ...(isMobileDevice ? {} : { rotateX: 10, rotateY: -3 }) },
  visible: { opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1, transition: { ease: easeHighFashion, duration: isMobileDevice ? 0.8 : 1.6 } }
};

// --- PHYSICS ENGINES (mobile-optimized) ---

const VelocityStretch = ({ children }) => {
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 100, stiffness: 600 });
  const velocityScaleY = useTransform(smoothVelocity, [-1500, 1500], [0.98, 1.02]);
  const velocityScaleX = useTransform(smoothVelocity, [-1500, 1500], [1.01, 0.99]);

  // On mobile: pure passthrough div — zero spring overhead rendered
  if (isMobile) return <div className="w-full">{children}</div>;

  return (
    <motion.div
      style={{ scaleY: velocityScaleY, scaleX: velocityScaleX }}
      className="w-full transform-gpu active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
};

const MagneticFloat = ({ children, force = 10 }) => {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20, mass: 0.1 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [force, -force]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-force, force]);
  const randomDuration = useRef(4 + Math.random() * 2).current;

  // On mobile: gentle CSS-based float (GPU-friendly translate only, no spring physics)
  if (isMobile) {
    return (
      <motion.div
        className="inline-block relative w-full h-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: randomDuration + 1, repeat: Infinity, ease: "easeInOut" }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.div>
    );
  }

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="inline-block relative">
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: randomDuration, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full">
         {children}
      </motion.div>
    </motion.div>
  );
};

const FocalCameraBlur = ({ children, offset = ["start end", "end start"], blurStrength = 4 }) => {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [blurStrength, 0, 0, blurStrength]);
  const filter = useTransform(blur, value => value <= 0.1 ? "none" : `blur(${value}px)`);
  // Mobile: use scroll-driven opacity fade instead of blur (opacity is GPU-composited)
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);

  if (isMobile) return <motion.div ref={ref} style={{ opacity: mobileOpacity }}>{children}</motion.div>;

  return <motion.div ref={ref} style={{ filter }} className="will-change-[filter]">{children}</motion.div>;
};



export default function App() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedWork, setSelectedWork] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [formState, setFormState] = useState("idle"); // idle | sending | sent | error
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", budget: "", message: "" });

  const { scrollYProgress } = useScroll();
  const driftLeft = useTransform(scrollYProgress, [0, 1], ["0vw", "-3vw"]);
  const driftRight = useTransform(scrollYProgress, [0, 1], ["0vw", "3vw"]);

  // ── Vertical Eclipse: scroll-driven Home→Work transition ──
  const eclipseRef = useRef(null);
  const { scrollYProgress: eclipseProgress } = useScroll({
    target: eclipseRef,
    offset: ["start start", "end start"]
  });

  // Background (Home) transforms — eclipsed
  const bgScale = useTransform(eclipseProgress, [0, 0.5, 1], [1, 0.98, 0.95]);
  const bgOpacity = useTransform(eclipseProgress, [0, 0.4, 0.8, 1], [1, 0.85, 0.4, 0.15]);
  
  // Disable focal blur on mobile for buttery scroll
  const bgBlurVal = useTransform(eclipseProgress, [0, 0.5, 1], [0, 1.5, 4]);
  const bgFilter = useTransform(bgBlurVal, v => {
    if (isMobile) return "none";
    return v <= 0.1 ? "none" : `blur(${v}px)`;
  });
  const bgParallaxY = useTransform(eclipseProgress, [0, 1], isMobile ? ["0%", "-5%"] : ["0%", "-15%"]);
  const scrollIndicatorOpacity = useTransform(eclipseProgress, [0, 0.1], [1, 0]);

  // Cover (Work) transforms — lighter on mobile (simpler shadow, subtle scale)
  const coverBorderRadius = useTransform(eclipseProgress, [0.2, 0.6, 0.9, 1], isMobile ? [28, 14, 4, 0] : [60, 36, 12, 0]);
  const coverBorderRadiusStr = useTransform(coverBorderRadius, v => `${v}px ${v}px 0 0`);
  const coverScale = useTransform(eclipseProgress, [0.2, 0.7, 1], isMobile ? [0.97, 0.99, 1] : [0.92, 0.97, 1]);
  const coverShadowIntensity = useTransform(eclipseProgress, [0.2, 0.7, 1], [0, 0.5, 1]);
  const coverShadowDesktop = useTransform(coverShadowIntensity,
    v => `0 -${Math.round(15 + v * 45)}px ${Math.round(30 + v * 90)}px rgba(0,0,0,${(0.15 + v * 0.55).toFixed(2)})`
  );
  // Mobile: simpler static shadow (no per-frame computation)
  const coverShadowMobile = useTransform(coverShadowIntensity,
    v => `0 -8px 24px rgba(0,0,0,${(0.2 + v * 0.4).toFixed(2)})`
  );
  const coverMarginX = useTransform(eclipseProgress, [0.2, 0.9, 1], isMobile ? [8, 2, 0] : [20, 4, 0]);

  useEffect(() => {
    if (isMobile) {
      // Mobile: GSAP ScrollTrigger snap scrolling
      let rafId;
      const lenis = new Lenis({ lerp: 1, smoothWheel: false, smoothTouch: false });
      window.lenis = lenis;
      function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);

      // Delay snap setup so DOM is fully rendered and measured
      const timer = setTimeout(() => {
        ScrollTrigger.refresh(true);

        const sectionIds = ["#home", "#work", "#services", "#about"];
        const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

        if (sections.length > 0) {
          // Calculate snap positions using getBoundingClientRect (works with nested elements)
          const getSnapPositions = () => {
            const maxScroll = ScrollTrigger.maxScroll(window);
            if (maxScroll <= 0) return [0];
            return sections.map(el => {
              const rect = el.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              return Math.max(0, Math.min(1, (rect.top + scrollTop) / maxScroll));
            });
          };

          ScrollTrigger.create({
            snap: {
              snapTo(progress) {
                const positions = getSnapPositions();
                // Find the nearest snap point
                return positions.reduce((prev, curr) =>
                  Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
                );
              },
              duration: { min: 0.25, max: 0.6 },
              delay: 0.15,
              ease: "power1.inOut",
            },
          });
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(rafId);
        ScrollTrigger.getAll().forEach(t => t.kill());
        lenis.destroy();
        delete window.lenis;
      };
    } else {
      // Desktop: Lenis smooth inertial scrolling
      const lenis = new Lenis({ lerp: 0.07, smoothWheel: true, wheelMultiplier: 0.8 });
      window.lenis = lenis;
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      return () => { lenis.destroy(); delete window.lenis; };
    }
  }, [isMobile]);

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (isMobile) {
      gsap.to(window, {
        scrollTo: { y: `#${id.toLowerCase()}`, offsetY: 0 },
        duration: 0.8,
        ease: "power2.inOut",
      });
    } else if (window.lenis) {
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

      {/* Ambient Blob — Primary (smaller + less blur on mobile) */}
      <motion.div aria-hidden
        className={`pointer-events-none fixed left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen ${isMobile ? 'h-[25vmax] w-[25vmax] blur-[40px]' : 'h-[35vmax] w-[35vmax] blur-[200px] will-change-transform'}`}
        animate={isMobile ? { ...accentMap[activeTab], opacity: (accentMap[activeTab]?.opacity || 0.5) * 0.5 } : accentMap[activeTab]}
        transition={{ duration: isMobile ? 1.5 : 3, ease: easePowerOut }}
      />
      {/* Ambient Blob — Secondary (smaller on mobile) */}
      <motion.div aria-hidden
        className={`pointer-events-none fixed left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen ${isMobile ? 'h-[15vmax] w-[15vmax] blur-[30px]' : 'h-[20vmax] w-[20vmax] blur-[140px] will-change-transform'}`}
        animate={{
          x: accentMap[activeTab]?.x === "-25vw" ? "15vw" : "-15vw",
          y: accentMap[activeTab]?.y === "-15vh" ? "20vh" : "-10vh",
          opacity: isMobile ? (accentMap[activeTab]?.opacity || 0.3) * 0.2 : (accentMap[activeTab]?.opacity || 0.3) * 0.4,
          backgroundColor: activeTab === "Home" ? "#7c2d12" : activeTab === "Services" ? "#1e1b4b" : "#1c1917",
          scale: isMobile ? 0.6 : 0.8
        }}
        transition={{ duration: isMobile ? 2 : 4, ease: easePowerOut }}
      />
      
      {/* Noise overlay — reduced opacity on mobile */}
      <div className={`pointer-events-none fixed inset-0 z-50 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isMobile ? 'opacity-[0.08]' : 'opacity-[0.2]'}`} />
      
      {/* Persistent Nav */}
      <div className="fixed bottom-10 left-0 right-0 flex items-center justify-center z-50 pointer-events-auto" style={{ perspective: "1000px" }}>
        <MagneticFloat force={12}>
           <motion.nav initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1.2, ease: easePowerOut }}
             className={`flex items-center justify-center gap-1 rounded-full bg-[#111]/80 border border-white/10 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'}`}>
             <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none bg-gradient-to-r from-red-500/20 via-blue-500/20 to-green-500/20 blur-md mix-blend-screen" />
             {["Home", "Work", "Services", "About"].map((item) => (
               <motion.button key={item} onClick={() => handleNavClick(item)}
                 whileTap={{ scale: 0.9 }}
                 className={`relative px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-semibold tracking-widest uppercase transition-colors duration-500 z-10 ${activeTab === item ? 'text-black' : 'text-stone-400 hover:text-white'}`}>
                 {activeTab === item && (
                   <motion.div layoutId="active-pill" className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      transition={{ duration: 0.8, ease: easePowerOut }} />
                 )}
                 {item}
               </motion.button>
             ))}
           </motion.nav>
        </MagneticFloat>
      </div>

      <VelocityStretch>
        <div className="relative w-full z-10" style={{ perspective: "1200px" }}>
          
          {/* ═══════════ HOME → WORK ECLIPSE CONTAINER ═══════════ */}
          <div ref={eclipseRef} id="home" className="relative" style={{ height: "150vh" }}>

            {/* ── BACKGROUND LAYER: Home (gets eclipsed) ── */}
            <motion.div onViewportEnter={() => setActiveTab("Home")} viewport={{ amount: 0.3 }}>
              <motion.div 
                className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-0 will-change-transform"
                style={{ scale: bgScale, opacity: bgOpacity, filter: bgFilter }}
              >
                <motion.div style={{ y: bgParallaxY }} className="text-center px-4 relative z-10">
                  {/* Eyebrow */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 1.5 }}
                    className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px w-12 bg-stone-600" />
                    <span className="text-[10px] tracking-[0.4em] uppercase text-stone-500 font-semibold">Creative Studio</span>
                    <div className="h-px w-12 bg-stone-600" />
                  </motion.div>

                  <div className="overflow-hidden pb-2" style={{ perspective: "800px" }}>
                    <motion.h1 initial={{ y: "110%", rotateX: -40, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }}
                      transition={{ duration: 1.8, ease: easePowerOut, delay: 0.2 }} style={{ transformOrigin: "center bottom" }}
                      className="font-display font-bold text-[15vw] leading-[0.85] tracking-tighter uppercase">
                      L/OCUS
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden pb-2" style={{ perspective: "800px" }}>
                    <motion.h1 initial={{ y: "110%", rotateX: -40, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }}
                      transition={{ duration: 1.8, ease: easePowerOut, delay: 0.35 }} style={{ transformOrigin: "center bottom" }}
                      className="font-display font-bold text-[15vw] leading-[0.85] tracking-tighter uppercase text-stone-400">
                      PATH
                    </motion.h1>
                  </div>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1.2, ease: easePowerOut }}
                    className="mt-8 text-stone-500 max-w-md mx-auto text-xs md:text-sm font-medium tracking-wider uppercase leading-relaxed">
                    We architect immersive digital experiences<br />for brands that refuse to blend in.
                  </motion.p>
                </motion.div>

                {/* Scroll indicator — fades out as eclipse begins */}
                <motion.div style={{ opacity: scrollIndicatorOpacity }}
                  className="absolute bottom-20 flex flex-col items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-stone-600">Scroll</span>
                  <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowDown className="w-4 h-4 text-stone-600" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* ── COVER LAYER: Work (the singularity that eclipses Home) ── */}
          <motion.section id="work"
            className="bg-[#f5f5f5] text-[#050505] pt-28 pb-40 z-30 relative px-4 md:px-10 will-change-transform"
            style={{
              borderRadius: coverBorderRadiusStr,
              scale: coverScale,
              boxShadow: isMobile ? coverShadowMobile : coverShadowDesktop,
              marginLeft: coverMarginX,
              marginRight: coverMarginX,
              marginTop: "-50vh",
            }}
          >
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
                           <div className="group relative cursor-pointer w-full h-full" onClick={() => work.isLive ? window.open(work.liveUrl, '_blank', 'noopener,noreferrer') : setSelectedWork(work)}>
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
                               <div className="flex items-center gap-2 mt-1 shrink-0">
                                  {work.isLive && <span className="text-[9px] uppercase tracking-[0.15em] text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live</span>}
                                  <span className="text-[9px] uppercase tracking-[0.15em] text-red-600 border border-red-600/30 px-3 py-1 rounded-full font-bold">{work.category}</span>
                                </div>
                             </div>
                           </div>
                         </MagneticFloat>
                      </motion.div>
                    ))}
                  </motion.div>
               </div>
            </motion.div>
          </motion.section>

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
                    <button onClick={() => setShowContact(true)}
                      className="bg-white text-black font-display font-bold uppercase tracking-widest text-xs px-10 py-5 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500 group flex items-center gap-3">
                      Start a Project
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <a href="mailto:locuspath0904@gmail.com"
                      className="font-display text-xl md:text-2xl font-bold text-stone-400 hover:text-white transition-colors uppercase tracking-tight">
                      locuspath0904@gmail.com
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
                      <a href="https://x.com/LocusPath" target="_blank" rel="noopener noreferrer" className="block text-sm text-stone-500 hover:text-white transition-colors py-1 uppercase tracking-wider font-medium">Twitter/X</a>
                      <a href="https://www.linkedin.com/in/locus-path-445274402" target="_blank" rel="noopener noreferrer" className="block text-sm text-stone-500 hover:text-white transition-colors py-1 uppercase tracking-wider font-medium">LinkedIn</a>
                      <a href="https://dribbble.com/locuspath" target="_blank" rel="noopener noreferrer" className="block text-sm text-stone-500 hover:text-white transition-colors py-1 uppercase tracking-wider font-medium">Dribbble</a>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between gap-6">
                    <div className="md:text-right">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-3">Contact</h4>
                      <a href="tel:+919318368267" className="block text-sm text-stone-500 hover:text-white transition-colors font-medium">+91 9318368267</a>
                      <a href="tel:+918287768083" className="block text-sm text-stone-500 hover:text-white transition-colors font-medium mt-1">+91 8287768083</a>
                      <a href="mailto:locuspath0904@gmail.com" className="block text-sm text-stone-500 hover:text-white transition-colors font-medium mt-2">locuspath0904@gmail.com</a>
                    </div>
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
      {/* ═══════════ CONTACT MODAL ═══════════ */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easePowerOut }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowContact(false); setFormState("idle"); } }}
          >
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 8, y: 60 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: -5, y: 40 }}
              transition={{ duration: 0.8, ease: easePowerOut }}
              className="relative z-10 w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden"
              style={{ perspective: "1000px" }}
              data-lenis-prevent="true"
            >
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Close button */}
              <button onClick={() => { setShowContact(false); setFormState("idle"); }}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>

              {formState === "sent" ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 space-y-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                  </motion.div>
                  <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-white">Message Sent</h3>
                  <p className="text-stone-400 text-sm max-w-sm mx-auto">Thanks for reaching out! We'll review your project details and get back to you within 24 hours.</p>
                  <button onClick={() => { setShowContact(false); setFormState("idle"); setFormData({ name: "", email: "", phone: "", budget: "", message: "" }); }}
                    className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-widest font-bold text-stone-300 hover:bg-white hover:text-black transition-all">
                    Close
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-stone-600 font-semibold">New Project Inquiry</span>
                    <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mt-2">Let's Talk</h3>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setFormState("sending");
                    try {
                      const res = await fetch("https://formsubmit.co/ajax/locuspath0904@gmail.com", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Accept: "application/json" },
                        body: JSON.stringify({
                          _subject: `New Inquiry from ${formData.name}`,
                          Name: formData.name,
                          Email: formData.email,
                          Phone: formData.phone,
                          Budget: formData.budget,
                          Message: formData.message,
                        }),
                      });
                      if (res.ok) setFormState("sent");
                      else setFormState("error");
                    } catch { setFormState("error"); }
                  }} className="space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 block">Name *</label>
                        <input required type="text" value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                          placeholder="Your name" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 block">Email *</label>
                        <input required type="email" value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                          placeholder="you@company.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 block">Phone</label>
                        <input type="tel" value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                          placeholder="+91 98765 43210" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 block">Budget Range</label>
                        <select value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer">
                          <option value="" className="bg-[#111]">Select</option>
                          <option value="Under ₹50K" className="bg-[#111]">Under ₹50K</option>
                          <option value="₹50K – ₹1L" className="bg-[#111]">₹50K – ₹1L</option>
                          <option value="₹1L – ₹3L" className="bg-[#111]">₹1L – ₹3L</option>
                          <option value="₹3L+" className="bg-[#111]">₹3L+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-[0.3em] text-stone-600 font-bold mb-2 block">Project Brief *</label>
                      <textarea required value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all resize-none"
                        placeholder="Tell us about your project, goals, and timeline..." />
                    </div>

                    {formState === "error" && (
                      <p className="text-red-400 text-xs">Something went wrong. Please try again or email us directly.</p>
                    )}

                    <button type="submit" disabled={formState === "sending"}
                      className="w-full bg-white text-black font-display font-bold uppercase tracking-widest text-xs px-8 py-5 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group">
                      {formState === "sending" ? (
                        <><span className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Submit Inquiry</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
