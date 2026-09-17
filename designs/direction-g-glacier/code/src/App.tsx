import VideoBackground from './components/VideoBackground'
import Nav from './components/Nav'
import Hero from './components/Hero'
import { Record, Wedge, Team, Process, Firm, Contact } from './components/Sections'
import './index.css'

export default function App() {
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* The glacier plate stays fixed behind every section, all the way down. */}
      <VideoBackground />
      <Nav />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <Record />
        <Wedge />
        <Team />
        <Process />
        <Firm />
        <Contact />
      </main>
    </div>
  )
}
