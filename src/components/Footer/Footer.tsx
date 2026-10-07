import React, { useRef } from 'react';
import { SunburstIcon } from '../Navbar';
import { navItems } from '../../data/portfolio';
import { contactData } from '../../data/contact';
import { Wordmark } from './Wordmark';
import { BackToTop } from './BackToTop';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  const socialLinks = [
    {
      name: 'Gmail',
      href: contactData.emailCtaHref,
      logo: '/logos/gmail.svg',
      brand: '#EA4335',
      isExternal: false,
      ariaLabel: 'Send an email to Mathan Babu',
    },
    {
      name: 'LinkedIn',
      href: contactData.linkedin.url,
      logo: '/logos/linkedin.svg',
      brand: '#0A66C2',
      isExternal: true,
      ariaLabel: "Open Mathan's LinkedIn profile (opens in a new tab)",
    },
    {
      name: 'GitHub',
      href: contactData.github.url,
      logo: '/logos/github.svg',
      brand: '#ffffff',
      isExternal: true,
      ariaLabel: "Open Mathan's GitHub profile (opens in a new tab)",
    },
    {
      name: 'Instagram',
      href: contactData.instagram.url,
      logo: '/logos/instagram.svg',
      brand: '#D62976',
      isExternal: true,
      ariaLabel: "Open Mathan's Instagram profile (opens in a new tab)",
    },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-black text-white [overflow-x:clip] select-none"
    >
      {/* Top Hairline */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Block 1: 12-col Grid (Brand, Navigate, Connect) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pt-20 pb-16">
          {/* Brand Column (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <SunburstIcon className="h-6 w-6 text-white" />
              <span className="font-instrument-sans text-lg font-semibold text-white tracking-tight">
                Mathan Babu S
              </span>
            </div>

            <p className="font-instrument-serif italic text-xl text-white/80 leading-relaxed max-w-sm">
              {contactData.footer.tagline}
            </p>
          </div>

          {/* Navigate Column (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-white/50">
              NAVIGATION
            </span>

            <nav aria-label="Footer navigation">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className="group relative inline-block text-sm text-white/70 transition-colors hover:text-white py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff] rounded"
                    >
                      <span>{item.label}</span>
                      {/* Underline sweep animation on hover */}
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-[#b4c0ff] transition-all duration-300 ease-out group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect Column (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-white/50">
              CONNECT
            </span>

            <div className="flex items-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={item.ariaLabel}
                  style={{ '--brand': item.brand } as React.CSSProperties}
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-[color-mix(in_srgb,var(--brand)_50%,transparent)] hover:shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff]"
                >
                  <img
                    src={item.logo}
                    width={20}
                    height={20}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain pointer-events-none"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Block 2: Cropped Rising Wordmark */}
        <Wordmark footerRef={footerRef} />

        {/* Block 3: Bottom Bar (Copyright & BackToTop) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/10">
          <p className="font-instrument-sans text-sm text-white/60">
            {contactData.footer.copyright}
          </p>

          <BackToTop />
        </div>
      </div>
    </footer>
  );
};
