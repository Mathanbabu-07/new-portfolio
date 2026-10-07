import { useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About/About';
import { Skills } from './components/Skills/Skills';
import { Experience } from './components/Experience/Experience';
import { ShadesStage } from './components/ShadesStage';
import { Projects } from './components/Projects';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SiteBackground } from './components/SiteBackground';

export function App() {
  const bgZoneRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#3054ff] selection:text-white [overflow-x:clip] font-instrument-sans">
      <Navbar />

      <main>
        {/* 1. Extended Background Zone (Hero, About, Skills, Experience) */}
        <div id="bg-zone" ref={bgZoneRef} className="relative isolate [overflow-x:clip]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black will-change-transform">
              <SiteBackground containerRef={bgZoneRef} />
            </div>
            {/* End fade to pure black across the bottom of Experience */}
            <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-black via-black/85 to-transparent" />
          </div>

          <Hero />
          <About />
          <Skills />
          <Experience />
        </div>

        {/* 2. Standalone Scroll-Scrubbed Shades Figure Stage */}
        <ShadesStage />

        {/* 3. Featured Projects Section */}
        <Projects />

        {/* 4. Achievements & Education Section */}
        <Achievements />

        {/* 5. Contact Section */}
        <Contact />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

export default App;
