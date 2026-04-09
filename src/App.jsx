const services = [
  {
    title: "Web Design & Development",
    points: ["Responsive Design", "Custom CMS", "E-Commerce"],
  },
  {
    title: "Brand Identity Design",
    points: ["Logo Design", "Brand Guidelines", "Visual Identity"],
  },
  {
    title: "UI/UX Design",
    points: ["User Research", "Wireframing", "Prototyping"],
  },
  {
    title: "Digital Marketing & SEO",
    points: ["SEO Strategy", "Content Marketing", "Social Media"],
  },
  {
    title: "E-Commerce Solutions",
    points: ["Shopify", "WooCommerce", "Custom Stores"],
  },
  {
    title: "Maintenance & Support",
    points: ["24/7 Support", "Security", "Updates"],
  },
];

const processSteps = [
  {
    title: "Discovery",
    text: "We dive deep into your brand, audience, and goals. Research-driven insights guide every creative decision we make.",
  },
  {
    title: "Design",
    text: "Wireframes evolve into stunning visual designs. We iterate based on your feedback until every pixel is perfect.",
  },
  {
    title: "Develop",
    text: "Clean, performant code brings designs to life. Mobile-first responsive development with rigorous testing.",
  },
  {
    title: "Deploy & Grow",
    text: "Launch with confidence. Ongoing support, analytics, and optimization ensure continuous growth for your brand.",
  },
];

const works = [
  {
    category: "Cafe",
    title: "Brew & Bean",
    text: "Complete brand redesign and website for an artisan coffee shop.",
  },
  {
    category: "Retail",
    title: "Luxe Avenue",
    text: "Full e-commerce platform for a luxury fashion boutique.",
  },
];

function App() {
  return (
    <div className="relative overflow-x-hidden bg-stone-950">
      <div className="pointer-events-none absolute inset-0 bg-grain-light" />

      <header className="section-shell sticky top-0 z-30 mt-4">
        <div className="glass-card flex items-center justify-between px-5 py-4">
          <div className="text-sm font-semibold tracking-[0.2em]">LOCUSPATH</div>
          <nav className="hidden gap-6 text-sm text-stone-300 md:flex">
            {["Home", "About", "Services", "Portfolio", "Contact"].map((item) => (
              <a key={item} href="#" className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>
          <button className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium uppercase tracking-widest transition hover:bg-white hover:text-stone-900">
            Start a Project
          </button>
        </div>
      </header>

      <main className="space-y-24 pb-20 pt-16 md:space-y-32">
        <section className="section-shell">
          <p className="muted-kicker mb-6">Now Accepting New Projects - 2026</p>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-stone-100 md:text-6xl">
                We Craft Digital Magic <span className="text-stone-400">For Your Brand</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-stone-300">
                We are a creative agency that transforms businesses into unforgettable digital
                experiences. From cozy cafes to luxury boutiques, we make your brand shine online.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-200">
                  View Our Work
                </button>
                <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white hover:text-stone-900">
                  Let&apos;s Talk
                </button>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-stone-400">
                {[
                  "Web Design",
                  "Branding",
                  "UI/UX",
                  "Development",
                  "E-Commerce",
                  "SEO",
                  "Marketing",
                  "Analytics",
                ].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-4 py-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass-card relative min-h-80 overflow-hidden p-8">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <p className="muted-kicker mb-6">Why Brands Choose Us</p>
              <ul className="space-y-6">
                {[
                  ["Pixel-Perfect Design", "Unique, hand-crafted visuals tailored to your identity."],
                  ["Lightning-Fast Delivery", "Production-ready websites on tight timelines."],
                  ["Built to Convert", "Every screen designed to drive measurable growth."],
                ].map(([title, desc]) => (
                  <li key={title}>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-stone-300">{desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="muted-kicker mb-4">Who We Are</p>
            <h2 className="text-3xl font-semibold md:text-5xl">
              We Don&apos;t Just Build Websites. We Build Your Vision.
            </h2>
          </div>
          <div className="space-y-6 text-stone-300">
            <p>
              LocusPath is a fresh creative agency driven by passion for pixel-perfect design and
              powerful digital storytelling.
            </p>
            <p>
              We partner with cafes, restaurants, boutiques, fitness studios, salons, and tech
              startups to create digital presences that convert visitors into loyal customers.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Results-Driven", "Fresh Perspective", "Dedicated Support"].map((item) => (
                <div key={item} className="glass-card p-4 text-sm text-stone-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <p className="muted-kicker mb-4">What We Do</p>
          <h2 className="mb-10 text-3xl font-semibold md:text-5xl">Services That Transform</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, idx) => (
              <article key={service.title} className="glass-card p-6">
                <p className="mb-4 text-sm text-stone-400">0{idx + 1}</p>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <ul className="mt-5 space-y-2 text-sm text-stone-300">
                  {service.points.map((point) => (
                    <li key={point}>- {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <p className="muted-kicker mb-4">How We Work</p>
          <h2 className="mb-10 text-3xl font-semibold md:text-5xl">Our Process</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {processSteps.map((step, idx) => (
              <article key={step.title} className="glass-card p-6">
                <p className="text-sm text-stone-400">0{idx + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-stone-300">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <p className="muted-kicker mb-4">Our Work</p>
          <h2 className="mb-10 text-3xl font-semibold md:text-5xl">Showcase Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {works.map((work) => (
              <article key={work.title} className="glass-card group overflow-hidden p-6">
                <div className="h-48 rounded-xl border border-white/10 bg-gradient-to-br from-stone-800 to-stone-900 transition group-hover:scale-[1.01]" />
                <p className="mt-5 text-sm uppercase tracking-[0.25em] text-stone-500">{work.category}</p>
                <h3 className="mt-2 text-2xl font-semibold">{work.title}</h3>
                <p className="mt-2 text-stone-300">{work.text}</p>
                <button className="mt-5 text-sm font-semibold text-white/90">View Project -&gt;</button>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <div className="glass-card grid gap-8 p-8 md:grid-cols-2 md:p-10">
            <div>
              <p className="muted-kicker mb-4">Get In Touch</p>
              <h2 className="text-3xl font-semibold md:text-5xl">Let&apos;s Connect</h2>
              <p className="mt-4 text-stone-300">
                Have a project in mind? We&apos;d love to hear about it. Your next chapter starts
                with one conversation.
              </p>
              <div className="mt-8 space-y-3 text-sm text-stone-300">
                <p>locus.path1@gmail.com</p>
                <p>+91 8467853399 / +91 8287768083</p>
                <p>24/7 Support Available</p>
              </div>
            </div>
            <form className="space-y-4">
              {["Your Name", "Email Address", "Business Type", "Project Budget"].map((placeholder) => (
                <input
                  key={placeholder}
                  className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-white/50"
                  placeholder={placeholder}
                />
              ))}
              <textarea
                rows={4}
                className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-white/50"
                placeholder="Tell Us About Your Project"
              />
              <button className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-200">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="section-shell border-t border-white/10 py-8 text-sm text-stone-400">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <p>Crafting digital experiences that inspire, engage, and convert.</p>
          <p>© 2026 LocusPath Creative Agency. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
