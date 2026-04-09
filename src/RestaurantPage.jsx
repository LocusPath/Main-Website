import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── calm animation variants ── */
const calmFade = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -15 }
};
const calmTransition = { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] };

const sectionReveal = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 }
};
const sectionTransition = { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] };

const menuItems = [
  // pizzas
  { id: 1, name: 'Makhani Margherita (Verace)', desc: 'San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil.', price: '₹595', category: 'Wood Fired Pizza' },
  { id: 2, name: 'Teekha Chicken Diavola', desc: 'Tomato sauce, fior di latte, spicy chicken pepperoni, chili oil, roasted peppers.', price: '₹895', category: 'Wood Fired Pizza' },
  { id: 3, name: 'Char Magaz Formaggi', desc: 'Mozzarella, gorgonzola dolce, parmigiano reggiano, fontina, truffle honey.', price: '₹950', category: 'Wood Fired Pizza' },
  { id: 4, name: 'Smoked Chicken & Rucola', desc: 'Cherry tomatoes, mozzarella, wood-smoked chicken breast, wild arugula, shaved parmesan.', price: '₹895', category: 'Wood Fired Pizza' },
  { id: 20, name: 'Tandoori Paneer Tikka Pizza', desc: 'San Marzano sauce, fresh mozzarella, charred paneer tikka, red onions, mint crema.', price: '₹650', category: 'Wood Fired Pizza' },
  { id: 21, name: 'Palak & Roasted Garlic Bianca', desc: 'Creamy spinach base, fior di latte, roasted garlic cloves, chili flakes, feta crumbles.', price: '₹595', category: 'Wood Fired Pizza' },
  { id: 22, name: 'Quattro Formaggi Malai', desc: 'Mozzarella, gorgonzola, smoked scamorza, malai paneer, truffle honey drizzle.', price: '₹750', category: 'Wood Fired Pizza' },

  // pastas
  { id: 5, name: 'Reshmi Chicken Carbonara', desc: 'Crispy smoked chicken, egg yolk, pecorino romano, cracked black pepper. No cream.', price: '₹850', category: 'Handmade Pasta' },
  { id: 6, name: 'Murg Ragu Pappardelle', desc: 'Wide ribbon pasta, slow-braised minced chicken ragù, juniper berries, pecorino.', price: '₹795', category: 'Handmade Pasta' },
  { id: 7, name: 'Samundari Linguine', desc: 'Fresh shrimp & calamari, white wine, garlic, parsley, Calabrian chili flakes.', price: '₹1095', category: 'Handmade Pasta' },
  { id: 8, name: 'Kala Truffle Gnocchi', desc: 'Potato dumplings, black truffle cream, wild mushrooms, parmesan crisp.', price: '₹995', category: 'Handmade Pasta' },
  { id: 23, name: 'Palak Paneer Lasagna', desc: 'Layered fresh pasta, spinach and paneer ricotta mix, rich makhani sauce, baked with mozzarella.', price: '₹695', category: 'Handmade Pasta' },
  { id: 24, name: 'Tandoori Mushroom Risotto', desc: 'Arborio rice, tandoori roasted wild mushrooms, parmesan, saffron infusion.', price: '₹750', category: 'Handmade Pasta' },
  { id: 25, name: 'Shahi Paneer Gnocchi', desc: 'Soft potato gnocchi tossed in a velvety sweet tomato cashew cream sauce.', price: '₹650', category: 'Handmade Pasta' },
  { id: 26, name: 'Malai Kofta Ravioli', desc: 'Handmade ravioli stuffed with malai kofta, served in a light brown butter sage sauce.', price: '₹695', category: 'Handmade Pasta' },

  // mains
  { id: 9, name: 'Tandoori Roast Chicken (Pollo)', desc: 'Half roasted organic chicken, grilled lemon, rosemary roasted potatoes. Designed for two.', price: '₹1495', category: 'Secondi (Mains)' },
  { id: 10, name: 'Tandoori Branzino', desc: 'Whole roasted Mediterranean sea bass, cherry tomatoes, capers, white wine sauce.', price: '₹1895', category: 'Secondi (Mains)' },
  { id: 27, name: 'Truffle Malai Broccoli', desc: 'Wood-fired broccoli florets marinated in malai cheese and black truffle.', price: '₹595', category: 'Secondi (Mains)' },
  { id: 28, name: 'Melanzane Bharwa Parmigiana', desc: 'Stuffed eggplant layered with rich tomato masala sauce and parmesan cheese.', price: '₹650', category: 'Secondi (Mains)' },

  // starters
  { id: 18, name: 'Lahsuni Garlic Bread Classico', desc: 'Fresh baked ciabatta, roasted garlic butter, parsley, sea salt.', price: '₹295', category: 'Antipasti e Pane' },
  { id: 19, name: 'Cheese Chilly Garlic Bread', desc: 'Melted mozzarella, green chilies, roasted garlic butter, parmesan crust.', price: '₹450', category: 'Antipasti e Pane' },
  { id: 12, name: 'Malai Burrata', desc: 'Fresh burrata cheese, blistered cherry tomatoes, aged balsamic, basil oil.', price: '₹750', category: 'Antipasti e Pane' },
  { id: 13, name: 'Hara Bhara Carciofi', desc: 'Shaved raw artichokes, fennel, mint, pecorino, lemon vinaigrette.', price: '₹650', category: 'Antipasti e Pane' },
  { id: 29, name: 'Kurkuri Zucchini Fritti', desc: 'Crispy fried zucchini strings tossed in chaat masala, served with garlic aioli.', price: '₹395', category: 'Antipasti e Pane' },

  // desserts
  { id: 15, name: 'Shahi Tiramisu', desc: 'Espresso-soaked ladyfingers, mascarpone silk, dark cocoa powder.', price: '₹550', category: 'Dolci' },
  { id: 16, name: 'Panna Cotta ki Kheer', desc: 'Vanilla bean and sweet basil infused cream, strawberry balsamico compote.', price: '₹495', category: 'Dolci' },
  { id: 17, name: 'Meetha Cannoli', desc: 'Crispy shells filled with sweet ricotta, candied orange, pistachios.', price: '₹550', category: 'Dolci' }
];

const categoryIcons = {
  'Wood Fired Pizza': '🍕',
  'Handmade Pasta': '🍝',
  'Secondi (Mains)': '🔥',
  'Antipasti e Pane': '🌿',
  'Dolci': '☕'
};

/* ── Exported Restaurant Page (full standalone) ── */
export default function RestaurantPage({ onClose }) {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
    // Scroll the restaurant container to top
    const container = document.getElementById('restaurant-scroll-root');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      id="restaurant-scroll-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] overflow-y-auto hide-scrollbar"
      style={{ background: '#00120f' }}
      data-lenis-prevent="true"
    >
      {/* Inject restaurant-specific styles */}
      <style>{restaurantCSS}</style>

      <div className="bb-app">
        {/* Close button — return to portfolio */}
        <button
          onClick={onClose}
          className="bb-close-btn"
          aria-label="Back to Portfolio"
        >
          <span className="bb-close-dot" />
          <span>Back to Portfolio</span>
        </button>

        {/* Navbar */}
        <motion.nav
          className="bb-navbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <div className="bb-brand" onClick={() => navigateTo('home')}>
            <img src="/restaurant/logo.svg" alt="Basilico Blu Logo" className="bb-logo" />
            <h1 className="bb-brand-title">Basilico Blu</h1>
          </div>

          <div className="bb-nav-links">
            <span className={`bb-nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>Home</span>
            <span className={`bb-nav-item ${currentPage === 'menu' ? 'active' : ''}`} onClick={() => navigateTo('menu')}>Menu</span>
            <span className={`bb-nav-item ${currentPage === 'booking' ? 'active' : ''}`} onClick={() => navigateTo('booking')}>Reservations</span>
          </div>
        </motion.nav>

        {/* Pages */}
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <HomePage key="home" setPage={navigateTo} />}
          {currentPage === 'menu' && <MenuPage key="menu" />}
          {currentPage === 'booking' && <BookingPage key="booking" />}
        </AnimatePresence>

        {/* Footer */}
        <footer className="bb-footer">
          <div className="bb-footer-grid">
            <div className="bb-footer-col">
              <h3 className="bb-footer-brand">Basilico Blu</h3>
              <p className="bb-footer-desc">Where two ancient culinary traditions come together in perfect harmony. Since 2018.</p>
            </div>
            <div className="bb-footer-col">
              <h4 className="bb-footer-heading">Visit Us</h4>
              <p className="bb-footer-text">
                📍 777 Starlight Avenue, Culinary District<br />
                &nbsp;&nbsp;&nbsp;&nbsp;Metroburg 10001<br />
                📞 +91 9318368267, +91 8287768083<br />
                ✉️ locuspath0904@gmail.com
              </p>
            </div>
            <div className="bb-footer-col">
              <h4 className="bb-footer-heading">Hours</h4>
              <p className="bb-footer-text">
                Lunch: 12:00 PM – 3:00 PM<br />
                Dinner: 7:00 PM – 11:30 PM<br />
                Bar: 5:00 PM – 12:30 AM
              </p>
            </div>
          </div>
          <div className="bb-footer-bottom">
            © 2025 Basilico Blu. All rights reserved. — Built by LocusPath
          </div>
        </footer>

        {/* Floating Widget */}
        <motion.div
          className="bb-floating-widget"
          onClick={() => navigateTo('booking')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
        >
          📅 <span>Reserve</span>
        </motion.div>
      </div>
    </motion.div>
  );
}


/* ══════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════ */
function HomePage({ setPage }) {
  return (
    <motion.div className="bb-page" {...calmFade} transition={calmTransition}>
      {/* Hero */}
      <section className="bb-hero">
        <div className="bb-hero-grid">
          <motion.div
            className="bb-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          >
            <h3 className="bb-subheading">A TASTE OF MILAN & DELHI</h3>
            <h1 className="bb-hero-title">Real Italian pasta<br />with an Indian heart</h1>
            <p className="bb-hero-desc">
              Experience a world-class culinary journey where traditional Italian heritage meets the vibrant, bold spices of India in an unforgettable fine-dining atmosphere.
            </p>
            <button className="bb-accent-btn" onClick={() => setPage('menu')}>
              Explore The Menu
            </button>
          </motion.div>

          <motion.div
            className="bb-hero-img-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          >
            <img src="/restaurant/hero_dish.png" alt="Signature Dish" className="bb-hero-dish" />
          </motion.div>
        </div>
      </section>

      {/* Story Details */}
      <section className="bb-details-section">
        <div className="bb-details-grid">
          {[
            { title: 'Our Heritage', text: 'Born from the winding streets of Napoli, our recipes have been passed down through five generations. We honor the simplicity and passion of traditional Italian gastronomy.', accent: '#3a9e8f' },
            { title: 'Wood-Fired', text: 'Our custom brick oven, imported directly from Italy, burns oak and olive wood to give our dough its signature blistered crust and smoky aroma.', accent: '#e3a93c' },
            { title: 'Imported Ingredients', text: 'San Marzano tomatoes from the volcanic soils of Mount Vesuvius, D.O.P. buffalo mozzarella from Campania, and extra virgin olive oil pressed in Apulia.', accent: '#c76a42' }
          ].map((card, i) => (
            <motion.div
              key={i}
              className="bb-detail-card"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...sectionTransition, delay: i * 0.15 }}
            >
              <h2 className="bb-detail-title">{card.title}</h2>
              <div className="bb-detail-line" style={{ backgroundColor: card.accent }} />
              <p className="bb-detail-text">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="bb-gallery-strip">
        <motion.div
          className="bb-gallery-grid"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={sectionTransition}
        >
          {[
            { src: '/restaurant/pizza.png', label: 'Artisan Wood-Fired' },
            { src: '/restaurant/pasta.png', label: 'Handmade Pasta' },
            { src: '/restaurant/hero_dish.png', label: 'Signature Dishes' },
            { src: '/restaurant/pasta_dish.png', label: 'Rich Flavors' },
            { src: '/restaurant/hot_dish.png', label: 'Indo-Italian Fusion' },
            { src: '/restaurant/interior.png', label: 'Beautiful Setting' },
          ].map((item, i) => (
            <div key={i} className="bb-gallery-item">
              <img src={item.src} alt={item.label} className="bb-gallery-img" />
              <div className="bb-gallery-label">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Chef Story */}
      <section className="bb-chef-section">
        <div className="bb-chef-overlay">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={sectionTransition}
          >
            <h2 className="bb-chef-title">La Famiglia</h2>
            <div className="bb-detail-line" style={{ margin: '0 auto 2rem auto' }} />
            <p className="bb-chef-text">
              Chef Alessandro Singh brings his dual heritage to Basilico Blu. Trained in the heart of Milan and raised in the vibrant streets of Delhi, he masterfully harmonizes the rich, earthy flavors of traditional Italian recipes with the fragrant, bold spices of India. Every dish is a bridge between two ancient culinary worlds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Ribbon */}
      <section className="bb-info-ribbon">
        <motion.div
          className="bb-ribbon-content"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={sectionTransition}
        >
          {[
            { label: 'Established', value: '2018' },
            { label: 'Dishes Served', value: '50,000+' },
            { label: 'Wood-Fired Oven', value: '900°F' },
            { label: 'Cuisines Fused', value: '2 Worlds' }
          ].map((stat, i) => (
            <div key={i} className="bb-ribbon-stat">
              <span className="bb-ribbon-value">{stat.value}</span>
              <span className="bb-ribbon-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bb-cta-section">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={sectionTransition}
          style={{ textAlign: 'center' }}
        >
          <h2 className="bb-cta-title">Ready for an Unforgettable Evening?</h2>
          <p className="bb-cta-text">
            Reserve your table now and let us craft an evening of extraordinary flavors, warm hospitality, and memories that linger.
          </p>
          <button className="bb-accent-btn" onClick={() => setPage('booking')}>
            Reserve a Table
          </button>
        </motion.div>
      </section>
    </motion.div>
  );
}


/* ══════════════════════════════════════
   MENU PAGE
   ══════════════════════════════════════ */
function MenuPage() {
  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <motion.div className="bb-page bb-menu-page" {...calmFade} transition={calmTransition}>
      <div className="bb-page-header">
        <motion.h1 className="bb-page-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>I Nostri Piatti</motion.h1>
        <motion.p className="bb-page-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}>A culinary journey through Italy & India</motion.p>
      </div>

      <div className="bb-menu-container">
        {categories.map((cat, idx) => (
          <div key={idx} className="bb-menu-category">
            <motion.h2
              className="bb-category-title"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={sectionTransition}
            >
              <span className="bb-category-icon">{categoryIcons[cat]}</span>{cat}
            </motion.h2>
            <div className="bb-menu-list">
              {menuItems.filter(item => item.category === cat).map((item, i) => (
                <motion.div
                  key={item.id}
                  className="bb-menu-item"
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ ...sectionTransition, delay: i * 0.08 }}
                >
                  <div className="bb-menu-item-info">
                    <h3 className="bb-item-name">{item.name}</h3>
                    <p className="bb-item-desc">{item.desc}</p>
                  </div>
                  <div className="bb-item-price">{item.price}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


/* ══════════════════════════════════════
   BOOKING PAGE
   ══════════════════════════════════════ */
function BookingPage() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('booked');
    const container = document.getElementById('restaurant-scroll-root');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === 'booked') {
    return (
      <motion.div className="bb-page bb-center" {...calmFade} transition={calmTransition}>
        <div className="bb-success-card">
          <div className="bb-success-icon">✅</div>
          <h1 className="bb-page-title">Table Confirmed</h1>
          <p className="bb-detail-text" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Your reservation has been secured. We look forward to welcoming you to Basilico Blu. A confirmation email has been sent.
          </p>
          <button className="bb-accent-btn" style={{ marginTop: '2rem' }} onClick={() => setStatus('idle')}>Book Another Table</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="bb-page" {...calmFade} transition={calmTransition}>
      <div className="bb-page-header">
        <motion.h1 className="bb-page-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>Reserve a Table</motion.h1>
        <motion.p className="bb-page-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}>Experience the magic of authentic Indo-Italian dining</motion.p>
      </div>

      <div className="bb-booking-container">
        <motion.form
          className="bb-booking-form"
          onSubmit={handleSubmit}
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={sectionTransition}
        >
          <h2 className="bb-form-title">Seat Booking System</h2>

          <div className="bb-form-grid">
            <div className="bb-input-group">
              <label>📅 Date</label>
              <input type="date" required className="bb-input" />
            </div>
            <div className="bb-input-group">
              <label>🕐 Time</label>
              <input type="time" required className="bb-input" defaultValue="19:00" />
            </div>
            <div className="bb-input-group">
              <label>👥 Party Size</label>
              <select className="bb-input" required>
                {[1,2,3,4,5,6,7,8,"9+"].map(n => <option key={n}>{n} Guests</option>)}
              </select>
            </div>
            <div className="bb-input-group">
              <label>Seating Preference</label>
              <select className="bb-input" required>
                <option>Main Dining Room</option>
                <option>Outdoor Terrazzo</option>
                <option>Chef's Counter</option>
                <option>Private Wine Cellar</option>
              </select>
            </div>
          </div>

          <div className="bb-input-group bb-full-width">
            <label>💬 Special Requests & Occasions</label>
            <textarea
              className="bb-textarea"
              placeholder="Let us know about allergies, romantic setups, Birthdays, etc..."
              rows={3}
            />
          </div>

          <div className="bb-input-group bb-full-width">
            <label>Contact Information</label>
            <div className="bb-form-grid">
              <input type="text" placeholder="Full Name" required className="bb-input" />
              <input type="tel" placeholder="Phone Number" required className="bb-input" />
              <input type="email" placeholder="Email Address" required className="bb-input" style={{ gridColumn: '1 / -1' }} />
            </div>
          </div>

          <button type="submit" className="bb-accent-btn bb-submit-btn">
            Confirm Reservation
          </button>
        </motion.form>

        <motion.div
          className="bb-booking-sidebar"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ ...sectionTransition, delay: 0.3 }}
        >
          <h3 className="bb-sidebar-title">Important Details</h3>
          <ul className="bb-sidebar-list">
            <li><strong>Grace Period:</strong> Tables are held for 15 minutes past the reserved time.</li>
            <li><strong>Dress Code:</strong> Smart casual dining attire is appreciated.</li>
            <li><strong>Cancellations:</strong> Please notify us at least 24 hours in advance.</li>
            <li><strong>Large Parties:</strong> For parties of 9 or more, a specialized chef's tasting menu is provided.</li>
          </ul>

          <div className="bb-contact-box">
            <h4>Need assistance?</h4>
            <p>Call us at: +91 9318368267, +91 8287768083<br />Email: locuspath0904@gmail.com</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}


/* ══════════════════════════════════════════════════════════════
   RESTAURANT CSS — scoped via .bb- prefix to avoid conflicts
   with the main LocusPath portfolio styles
   ══════════════════════════════════════════════════════════════ */
const restaurantCSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Great+Vibes&display=swap');

.bb-app {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #00120f;
  background:
    radial-gradient(ellipse at top right, rgba(0, 60, 45, 0.5), #00120f 65%),
    radial-gradient(ellipse at bottom left, rgba(199, 106, 66, 0.08), transparent 50%),
    radial-gradient(ellipse at center, rgba(58, 158, 143, 0.04), transparent 60%);
  color: #fdfbf7;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.bb-app h1, .bb-app h2, .bb-app h3, .bb-app h4, .bb-app h5, .bb-app h6 {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
}

/* ── CLOSE BUTTON ── */
.bb-close-btn {
  position: fixed;
  top: 2.5rem;
  right: 2.5rem;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.5rem;
  background: rgba(0, 18, 15, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50px;
  color: #fdfbf7;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
}
.bb-close-btn:hover {
  background: rgba(255,255,255,0.95);
  color: #00120f;
  border-color: transparent;
}
.bb-close-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e3a93c;
  transition: background 0.3s;
}
.bb-close-btn:hover .bb-close-dot { background: #00120f; }

/* ── NAVBAR ── */
.bb-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem 8%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(0, 18, 15, 0.75);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(227, 169, 60, 0.08);
}
.bb-brand { cursor: pointer; display: flex; align-items: center; gap: 1rem; }
.bb-logo { height: 48px; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.4)); }
.bb-brand-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
.bb-nav-links { display: flex; gap: 3.5rem; }
.bb-nav-item {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #c9dcd6;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.bb-nav-item.active, .bb-nav-item:hover { color: #fdfbf7; }
.bb-nav-item::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #e3a93c;
  transition: width 0.3s ease;
}
.bb-nav-item.active::after, .bb-nav-item:hover::after { width: 100%; }

/* ── PAGE ── */
.bb-page { min-height: 100vh; display: flex; flex-direction: column; }
.bb-center { justify-content: center; align-items: center; }

/* ── HERO ── */
.bb-hero {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 6rem 0 2rem 0;
}
.bb-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1300px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 5%;
}
.bb-hero-text { position: relative; z-index: 10; display: flex; flex-direction: column; }
.bb-subheading {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #c9dcd6;
  margin-bottom: 1.5rem;
  font-weight: 500;
}
.bb-hero-title {
  font-size: 5.5rem;
  line-height: 1.1;
  margin-bottom: 2rem;
  font-family: 'Playfair Display', serif;
  text-shadow: 0 10px 30px rgba(0,0,0,0.8);
  letter-spacing: 1px;
}
.bb-hero-desc {
  color: #c9dcd6;
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 500px;
  margin-bottom: 2.5rem;
}
.bb-hero-img-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
.bb-hero-dish {
  width: 100%;
  max-width: 550px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 120px rgba(0, 80, 60, 0.2), 0 0 60px rgba(227, 169, 60, 0.1);
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  aspect-ratio: 1/1;
}
.bb-hero-dish:hover { transform: scale(1.04) rotate(1.5deg); }

/* ── ACCENT BUTTON ── */
.bb-accent-btn {
  background: linear-gradient(135deg, #e3a93c, #c08a20);
  color: #00120f;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 16px 45px;
  border-radius: 50px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(227, 169, 60, 0.25);
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  display: inline-block;
}
.bb-accent-btn:hover {
  background: linear-gradient(135deg, #f0c050, #d49a30);
  box-shadow: 0 18px 50px rgba(227, 169, 60, 0.45);
  transform: translateY(-3px) scale(1.03);
}

/* ── DETAILS SECTION ── */
.bb-details-section {
  background: rgba(0, 33, 26, 0.6);
  padding: 8rem 10%;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.bb-details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; }
.bb-detail-card { text-align: left; }
.bb-detail-title { font-size: 1.8rem; font-family: 'Playfair Display', serif; color: #fdfbf7; margin-bottom: 1rem; }
.bb-detail-line { width: 40px; height: 2px; background-color: #e3a93c; margin-bottom: 1.5rem; }
.bb-detail-text { font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.8; color: #c9dcd6; }

/* ── GALLERY ── */
.bb-gallery-strip { padding: 5rem 8%; background: rgba(0, 20, 16, 0.5); }
.bb-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.bb-gallery-item { position: relative; overflow: hidden; border-radius: 12px; aspect-ratio: 4/3; }
.bb-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.bb-gallery-item:hover .bb-gallery-img { transform: scale(1.06); }
.bb-gallery-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(transparent, rgba(0,18,15,0.9));
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #e3a93c;
}

/* ── CHEF STORY ── */
.bb-chef-section {
  position: relative;
  background: linear-gradient(rgba(0,18,15,0.75), rgba(0,18,15,0.92)), url('/restaurant/chef_bg.png');
  background-size: cover;
  background-position: center;
}
.bb-chef-overlay { padding: 8rem 10%; text-align: center; }
.bb-chef-title { font-size: 2.8rem; color: #e3a93c; margin-bottom: 0.5rem; font-family: 'Playfair Display', serif; }
.bb-chef-text { max-width: 750px; margin: 0 auto; font-size: 1.1rem; line-height: 2; color: #c9dcd6; }

/* ── INFO RIBBON ── */
.bb-info-ribbon {
  background: rgba(0, 33, 26, 0.5);
  border-top: 1px solid rgba(58, 158, 143, 0.2);
  border-bottom: 1px solid rgba(58, 158, 143, 0.2);
  padding: 4rem 10%;
}
.bb-ribbon-content { display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 2rem; max-width: 1100px; margin: 0 auto; }
.bb-ribbon-stat { text-align: center; }
.bb-ribbon-value { display: block; font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #e3a93c; margin-bottom: 0.4rem; }
.bb-ribbon-label { font-family: 'Inter', sans-serif; font-size: 0.85rem; letter-spacing: 3px; text-transform: uppercase; color: #c9dcd6; }

/* ── CTA ── */
.bb-cta-section {
  padding: 8rem 10%;
  background: linear-gradient(rgba(0,18,15,0.6), rgba(0,18,15,0.85)), url('/restaurant/interior.png');
  background-size: cover;
  background-position: center;
}
.bb-cta-title { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 1rem; }
.bb-cta-text { color: #c9dcd6; font-size: 1.1rem; margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }

/* ── MENU PAGE ── */
.bb-menu-page { background: #001a15; }
.bb-page-header { text-align: center; padding: 6rem 1rem 4rem 1rem; }
.bb-page-title { font-size: 3.5rem; font-family: 'Playfair Display', serif; margin-bottom: 1rem; }
.bb-page-subtitle { font-family: 'Inter', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 4px; color: #e3a93c; }
.bb-menu-container { max-width: 1000px; margin: 0 auto; padding: 0 5% 8rem 5%; }
.bb-menu-category { margin-bottom: 6rem; }
.bb-category-title {
  font-size: 2.2rem;
  font-family: 'Playfair Display', serif;
  text-align: center;
  margin-bottom: 3rem;
  border-bottom: 1px solid rgba(227, 169, 60, 0.15);
  padding-bottom: 1rem;
}
.bb-category-icon { margin-right: 10px; filter: drop-shadow(0px 4px 6px rgba(227,169,60,0.5)); }
.bb-menu-list { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem 5rem; }
.bb-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.03);
  background: rgba(0,26,21,0.5);
  transition: background 0.5s ease, border-color 0.5s ease;
}
.bb-menu-item:hover { background: rgba(0,40,32,0.7); border-color: rgba(227, 169, 60, 0.12); }
.bb-menu-item-info { flex: 1; }
.bb-item-name { font-size: 1.3rem; font-family: 'Playfair Display', serif; font-weight: 700; margin-bottom: 0.5rem; }
.bb-item-desc { font-family: 'Inter', sans-serif; font-size: 0.95rem; line-height: 1.5; color: #8baaa1; font-style: italic; }
.bb-item-price { font-size: 1.2rem; font-family: 'Playfair Display', serif; font-weight: 700; color: #e3a93c; white-space: nowrap; }

/* ── BOOKING ── */
.bb-booking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5% 8rem 5%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 5rem;
}
.bb-booking-form {
  background: rgba(0, 33, 26, 0.6);
  padding: 4rem;
  border-radius: 4px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}
.bb-form-title { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; }
.bb-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
.bb-input-group { display: flex; flex-direction: column; gap: 0.8rem; }
.bb-input-group.bb-full-width { margin-top: 2.5rem; }
.bb-input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #c9dcd6;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.bb-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  color: #fdfbf7;
  padding: 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  transition: all 0.3s;
  width: 100%;
}
.bb-input:focus { outline: none; border-bottom-color: #e3a93c; }
.bb-input option { background: rgba(0, 33, 26, 0.95); color: #fdfbf7; }
.bb-textarea {
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fdfbf7;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  resize: vertical;
  border-radius: 4px;
  width: 100%;
}
.bb-submit-btn { width: 100%; margin-top: 4rem; padding: 20px; font-size: 1.1rem; }
.bb-booking-sidebar { padding-top: 2rem; }
.bb-sidebar-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 2rem; }
.bb-sidebar-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1.5rem; }
.bb-sidebar-list li { font-family: 'Inter', sans-serif; font-size: 0.95rem; line-height: 1.6; color: #c9dcd6; }
.bb-sidebar-list strong { color: #e3a93c; display: block; margin-bottom: 0.2rem; font-family: 'Playfair Display', serif; letter-spacing: 1px; }
.bb-contact-box { margin-top: 2rem; }
.bb-contact-box h4 { font-size: 1rem; margin-bottom: 0.5rem; }
.bb-contact-box p { color: #c9dcd6; }

.bb-success-card {
  background: rgba(0, 33, 26, 0.6);
  padding: 5rem;
  text-align: center;
  border-radius: 4px;
  max-width: 600px;
}
.bb-success-icon { font-size: 4rem; margin-bottom: 2rem; }

/* ── FOOTER ── */
.bb-footer {
  background: rgba(0, 10, 8, 0.9);
  border-top: 1px solid rgba(255,255,255,0.04);
  padding: 5rem 10% 3rem 10%;
}
.bb-footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 3rem; margin-bottom: 2rem; }
.bb-footer-brand { font-family: 'Playfair Display', serif; font-size: 1.6rem; margin-bottom: 1rem; }
.bb-footer-desc { color: #c9dcd6; line-height: 1.8; font-size: 0.95rem; }
.bb-footer-heading { color: #e3a93c; font-family: 'Inter', sans-serif; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1rem; font-size: 0.85rem; }
.bb-footer-text { color: #c9dcd6; line-height: 2; font-size: 0.9rem; }
.bb-footer-bottom { text-align: center; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.05); color: #8baaa1; font-size: 0.8rem; letter-spacing: 1px; }

/* ── FLOATING WIDGET ── */
.bb-floating-widget {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background: linear-gradient(135deg, #e3a93c, #c08a20);
  color: #00120f;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  cursor: pointer;
  z-index: 200;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.bb-floating-widget:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 50px rgba(227, 169, 60, 0.35);
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .bb-details-grid { grid-template-columns: 1fr; gap: 3rem; }
  .bb-booking-container { grid-template-columns: 1fr; }
  .bb-menu-list { grid-template-columns: 1fr; }
  .bb-hero-grid { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
  .bb-ribbon-content { flex-direction: column; gap: 3rem; }
  .bb-footer-grid { grid-template-columns: 1fr; }
  .bb-gallery-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .bb-hero-title { font-size: 3rem; }
  .bb-nav-links { display: none; }
  .bb-form-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .bb-booking-form { padding: 2rem; }
  .bb-hero-text, .bb-hero-title, .bb-subheading, .bb-hero-desc { text-align: center !important; }
  .bb-hero-desc { margin-left: auto !important; margin-right: auto !important; }
  .bb-gallery-grid { grid-template-columns: 1fr; }
  .bb-close-btn { top: 1.5rem; right: 1.5rem; padding: 0.5rem 1rem; }
}
`;
