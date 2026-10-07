import { useEffect, useState } from 'react';

/**
 * useScrollSpy
 * Detects the active section ID using an IntersectionObserver with rootMargin tuned
 * to trigger when a section occupies the upper-middle portion of the viewport.
 * Also ensures 'contact' stays highlighted when scrolled to the footer/bottom of the page.
 */
export function useScrollSpy(sectionIds: string[], defaultId = 'home'): string {
  const [activeId, setActiveId] = useState<string>(defaultId);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 80) {
        setActiveId(defaultId);
      } else if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80
      ) {
        // Scrolled to bottom / footer: keep the final section (contact) active
        const lastId = sectionIds[sectionIds.length - 1];
        if (lastId) {
          setActiveId(lastId);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver observing section elements
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't override if scrolled to the bottom of the page
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 80
        ) {
          return;
        }

        entries.forEach((entry) => {
          if (entry.isIntersecting && window.scrollY >= 80) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [sectionIds, defaultId]);

  return activeId;
}
