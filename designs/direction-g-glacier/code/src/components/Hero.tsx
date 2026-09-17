import { motion } from 'framer-motion'

/* The Glacier exhibition lockup, kept: centred brand, two-weight Playfair
 * headline, italic serif subtitle, true-ellipse outline button, and the footer
 * bar pinned to the bottom of the first screen. Only the words changed.
 */
export default function Hero() {
  return (
    <section
      id="top"
      style={{ position: 'relative', width: '100%', minHeight: '100svh', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '26px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2 L20 9 L12 22 L4 9 Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M4 9 H20 M12 2 V22 M8 9 L12 22 L16 9" stroke="#fff" strokeWidth="0.7" opacity="0.55" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#fff', fontFamily: "'Inter', sans-serif", paddingLeft: '0.28em' }}>Caprae Tech</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontFamily: "'Inter', sans-serif", paddingLeft: '0.34em' }}>Part of Caprae Capital</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.24, ease: 'easeOut' }}
          style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", textTransform: 'uppercase', color: '#fff', textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
        >
          <span style={{ display: 'block', fontWeight: 400, fontSize: 'clamp(2.6rem, 7.4vw, 5.6rem)', lineHeight: 1, letterSpacing: '0.02em' }}>Engineers who</span>
          <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.4rem, 7vw, 5.4rem)', lineHeight: 0.98, letterSpacing: '0.01em' }}>Already Build</span>
          <span style={{ display: 'block', fontWeight: 400, fontSize: 'clamp(2.6rem, 7.4vw, 5.6rem)', lineHeight: 1, letterSpacing: '0.02em' }}>For Operators</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42, ease: 'easeOut' }}
          style={{ margin: '26px 0 0', maxWidth: '540px', fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '18px', lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 20px rgba(0,0,0,0.5)' }}
        >
          Four products live, one open source. The team that builds Caprae's own software is now available to yours.
        </motion.p>

        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.58, ease: 'easeOut' }}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          whileTap={{ scale: 0.97 }}
          style={{ marginTop: '38px', padding: '20px 58px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.6)', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", backgroundColor: 'rgba(255,255,255,0)' }}
        >
          Book a call
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        className="mono"
        style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px 26px', fontSize: '10.5px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}
      >
        <span>Four products live · One open source</span>
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Scroll</span>
          <span>To The Record</span>
        </span>
        <span>partners@capraecapital.com</span>
      </motion.div>
    </section>
  )
}
