import CursorGlow from './components/CursorGlow'
import Features from './components/Features'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Lab from './components/Lab'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Showcase from './components/Showcase'
import TechMarquee from './components/TechMarquee'
import ThemesSection from './components/ThemesSection'
import { ThemeProvider } from './theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <Intro />
      <CursorGlow />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Lab />
        <Showcase />
        <ThemesSection />
        <TechMarquee />
      </main>
      <Footer />
    </ThemeProvider>
  )
}