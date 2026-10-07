import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { skillsData } from '../../data/skills';
import { SpotlightCard } from './SpotlightCard';
import { SkillTile } from './SkillTile';
import { tileVariants, cardVariants, EASE_CUSTOM } from './motionVariants';
import { AiConstellation } from './AiConstellation';
import { SkillMarquee } from './SkillMarquee';
import { SkillIcon } from './skillIcons';

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: '0px 0px -15% 0px',
  });
  const shouldReduceMotion = useReducedMotion();

  const { categories } = skillsData;

  // Header Animation Variants
  const headerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const labelVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_CUSTOM },
    },
  };

  const wordVariants = {
    hidden: {
      y: shouldReduceMotion ? 0 : '110%',
      filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
      opacity: shouldReduceMotion ? 0 : 1,
    },
    visible: {
      y: 0,
      filter: 'blur(0px)',
      opacity: 1,
      transition: { duration: 0.7, ease: EASE_CUSTOM },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_CUSTOM },
    },
  };

  // Cards Grid Animation Variants (0.7s, 0.09s stagger in DOM order)
  const cardsGridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.15,
      },
    },
  };

  // Tiles stagger inside cards
  const tilesContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.25,
        staggerChildren: 0.04,
      },
    },
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative scroll-mt-24 py-24 lg:py-32 select-none"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-end gap-10"
        >
          {/* Header Left: Label + Masked Word Reveal H2 */}
          <div>
            <motion.div
              variants={labelVariants}
              className="flex items-center gap-2 mb-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#b4c0ff] font-mono font-medium">
                {skillsData.label}
              </span>
            </motion.div>

            <h2 className="font-instrument-sans font-semibold tracking-tight text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]">
              <span className="overflow-hidden inline-block py-1 mr-3">
                <motion.span
                  variants={wordVariants}
                  className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
                >
                  Skills &
                </motion.span>
              </span>
              <span className="overflow-hidden inline-block py-1">
                <motion.span
                  variants={wordVariants}
                  className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
                >
                  Technologies
                </motion.span>
              </span>
            </h2>
          </div>

          {/* Header Right: Subtitle */}
          <div className="mt-4 lg:mt-0 lg:flex lg:justify-end">
            <motion.p
              variants={subtitleVariants}
              className="text-white/75 max-w-md leading-[1.65] text-base lg:text-lg"
            >
              {skillsData.subtitle}
            </motion.p>
          </div>
        </motion.div>

        {/* Bento Grid: in strict DOM order */}
        <motion.div
          variants={cardsGridVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5"
        >
          {/* 1. AI / ML Card (Hero: col-span-7, row-span-2) */}
          <motion.div
            variants={cardVariants}
            custom={shouldReduceMotion}
            className="sm:col-span-2 lg:col-span-7 lg:row-span-2 flex flex-col"
          >
            <SpotlightCard
              id={categories.aiMl.id}
              title={categories.aiMl.title}
              caption={categories.aiMl.caption}
              iconName={categories.aiMl.iconName}
              badge={categories.aiMl.badge}
              className="h-full"
            >
              <AiConstellation
                skills={categories.aiMl.skills}
                isInView={isInView}
              />
            </SpotlightCard>
          </motion.div>

          {/* 2. Languages Card (lg:col-span-5) */}
          <motion.div
            variants={cardVariants}
            custom={shouldReduceMotion}
            className="sm:col-span-1 lg:col-span-5 flex flex-col"
          >
            <SpotlightCard
              id={categories.languages.id}
              title={categories.languages.title}
              caption={categories.languages.caption}
              iconName={categories.languages.iconName}
              className="h-full relative"
            >
              {/* Giant faded </> glyph in the bottom-right */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 -right-2 font-mono font-bold text-7xl lg:text-8xl text-white/[0.05] select-none leading-none z-0"
              >
                &lt;/&gt;
              </div>

              <motion.ul
                variants={tilesContainerVariants}
                className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto"
              >
                {categories.languages.skills.map((skill) => (
                  <SkillTile key={skill} name={skill} />
                ))}
              </motion.ul>
            </SpotlightCard>
          </motion.div>

          {/* 3. Frameworks Card (lg:col-span-5) */}
          <motion.div
            variants={cardVariants}
            custom={shouldReduceMotion}
            className="sm:col-span-1 lg:col-span-5 flex flex-col"
          >
            <SpotlightCard
              id={categories.frameworks.id}
              title={categories.frameworks.title}
              caption={categories.frameworks.caption}
              iconName={categories.frameworks.iconName}
              className="h-full"
            >
              <motion.ul
                variants={tilesContainerVariants}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto"
              >
                {categories.frameworks.skills.map((skill) => (
                  <SkillTile key={skill} name={skill} />
                ))}
              </motion.ul>
            </SpotlightCard>
          </motion.div>

          {/* 4. Tools & Deployment Card (sm:col-span-2 lg:col-span-8) */}
          <motion.div
            variants={cardVariants}
            custom={shouldReduceMotion}
            className="sm:col-span-2 lg:col-span-8 flex flex-col"
          >
            <SpotlightCard
              id={categories.tools.id}
              title={categories.tools.title}
              caption={categories.tools.caption}
              iconName={categories.tools.iconName}
              className="h-full"
            >
              <motion.ul
                variants={tilesContainerVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-auto"
              >
                {categories.tools.skills.map((skill) => (
                  <SkillTile key={skill} name={skill} />
                ))}
              </motion.ul>
            </SpotlightCard>
          </motion.div>

          {/* 5. Soft Skills Card (sm:col-span-2 lg:col-span-4) */}
          <motion.div
            variants={cardVariants}
            custom={shouldReduceMotion}
            className="sm:col-span-2 lg:col-span-4 flex flex-col"
          >
            <SpotlightCard
              id={categories.softSkills.id}
              title={categories.softSkills.title}
              caption={categories.softSkills.caption}
              iconName={categories.softSkills.iconName}
              cardBg="bg-gradient-to-br from-white/[0.07] to-transparent"
              className="h-full"
            >
              <motion.ul
                variants={tilesContainerVariants}
                className="flex flex-wrap gap-2 my-auto"
              >
                {categories.softSkills.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    tabIndex={0}
                    variants={tileVariants}
                    custom={shouldReduceMotion}
                    className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] hover:bg-[#3054ff]/10 hover:border-[#3054ff]/60 px-4 py-2 transition-all duration-200 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff] cursor-default select-none"
                  >
                    <div
                      aria-hidden="true"
                      className="text-white/60 group-hover:text-[#b4c0ff] transition-colors duration-200"
                    >
                      <SkillIcon name={skill} className="w-4 h-4" />
                    </div>
                    <span className="font-instrument-serif italic text-lg lg:text-xl font-normal leading-none">
                      {skill}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </SpotlightCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Full-bleed Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <SkillMarquee className="mt-16 lg:mt-24" />
      </motion.div>
    </section>
  );
};
