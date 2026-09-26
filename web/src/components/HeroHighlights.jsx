import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HeroHighlights = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.highlight-banner-reveal',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%'
          }
        }
      )

      gsap.fromTo(
        '.feature-pill-item',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.feature-pills-wrapper',
            start: 'top 92%'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const guarantees = [
    {
      id: 'placement',
      title: '100% Placement Support',
      desc: "We don't just complete the course — support continues until you get placed.",
      tag: 'Dedicated Placement Cell',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      )
    },
    {
      id: 'knowledge',
      title: '100% Knowledge Guarantee',
      desc: 'Learn with complete confidence — we guarantee practical conceptual clarity and real mastery.',
      tag: 'Outcome Focused',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    },
    {
      id: 'demo',
      title: '4 Free Demo Classes',
      desc: 'Experience our live mentorship, practical teaching style, and curriculum before paying a single rupee.',
      tag: 'Try Before You Pay',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <polygon points="10 13 15 15.5 10 18 10 13" fill="currentColor" stroke="none" />
        </svg>
      )
    }
  ]

  const pillars = [
    {
      title: '100%',
      subtitle: 'PRACTICAL TRAINING',
      desc: 'Zero passive theory. Learn via live coding, query design, and data modeling.'
    },
    {
      title: 'Real-Time',
      subtitle: 'INDUSTRY PROJECTS',
      desc: 'Work on actual business dashboards, enterprise pipelines, and real datasets.'
    },
    {
      title: 'Job-Ready',
      subtitle: 'MOCK INTERVIEWS & RESUME',
      desc: 'Personalized portfolio reviews, recruiter mock drives, and technical rounds.'
    },
    {
      title: 'Mentors',
      subtitle: 'INDUSTRY ANALYTICS EXPERTS',
      desc: 'Trained directly by seasoned practitioners with Ex-Cognizant & Ex-PwC experience.'
    }
  ]

  return (
    <section ref={containerRef} className="relative z-20 -mt-8 sm:-mt-12 mb-10 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Trust Banner - Deep Royal Blue & Cyan Glow */}
        <div className="highlight-banner-reveal relative rounded-3xl bg-gradient-to-r from-[#1a4b75] via-[#216599] to-[#2980b9] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-[#1a4b75]/25 border border-white/15 overflow-hidden text-white">
          
          {/* Subtle background ambient mesh */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Guarantee Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {guarantees.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-[#216599] transition-all duration-300 shadow-sm">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold font-jetbrains uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 text-cyan-200 border border-white/20">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-bold font-inter tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Subtle bottom check accent */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-[11px] font-inter text-cyan-100 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Guaranteed at Data Knowledge</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 4 Feature Pillars Ribbon */}
        <div className="feature-pills-wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="feature-pill-item group bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#3498db]/40 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-jetbrains text-slate-900 group-hover:text-[#3498db] transition-colors tracking-tight">
                    {pillar.title}
                  </span>
                </div>
                <p className="text-xs font-bold font-jetbrains tracking-wider uppercase text-[#1f6696]">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-slate-500 font-inter leading-relaxed pt-1">
                  {pillar.desc}
                </p>
              </div>

              <div className="w-8 h-1 rounded-full bg-slate-100 group-hover:bg-[#3498db] group-hover:w-16 transition-all duration-300 mt-4" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HeroHighlights
