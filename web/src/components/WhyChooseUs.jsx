import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fetchWhyChooseUs } from '../redux/slices/whyChooseUsSlice'

gsap.registerPlugin(ScrollTrigger)

const renderReasonIcon = (iconType) => {
  switch (iconType) {
    case 'mentors':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        </svg>
      )
    case 'mock-interviews':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 15" />
        </svg>
      )
    case 'placement-support':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'projects':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" />
        </svg>
      )
    case 'doubt-support':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'knowledge-guarantee':
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
  }
}

// Fallback style cycle for cards
const cardStyles = [
  { iconBg: 'bg-blue-50 text-[#3498db] border-blue-200/80', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200/80', badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
]

const WhyChooseUs = () => {
  const dispatch = useDispatch()
  const { data: whyChooseUs } = useSelector((state) => state.whyChooseUs)
  const containerRef = useRef(null)

  useEffect(() => {
    dispatch(fetchWhyChooseUs())
  }, [dispatch])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-head-reveal',
        { y: 30, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%'
          }
        }
      )

      gsap.fromTo(
        '.why-card-item',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.why-grid-container',
            start: 'top 85%'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [whyChooseUs])

  if (whyChooseUs?.isActive === false) {
    return null
  }

  const items = Array.isArray(whyChooseUs?.items) && whyChooseUs.items.length > 0
    ? whyChooseUs.items
    : []

  const badgeText = whyChooseUs?.badgeText || 'The Data Knowledge Advantage'
  const title = whyChooseUs?.title || 'Why Choose Us?'
  const description = whyChooseUs?.description || 'Practical skills, industry-working mentors, and dedicated career placement support designed to get you hired.'
  const showCtaBanner = whyChooseUs?.showCtaBanner !== false
  const ctaTitle = whyChooseUs?.ctaTitle || 'Ready to start your data transformation?'
  const ctaSubtitle = whyChooseUs?.ctaSubtitle || 'Talk to our career advisors and get a personalized learning roadmap.'
  const ctaButtonText = whyChooseUs?.ctaButtonText || 'Get Free Career Guidance'
  const ctaButtonLink = whyChooseUs?.ctaButtonLink || '/contact'

  return (
    <section ref={containerRef} className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden border-t border-slate-200">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-50/60 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Section Header */}
        <div className="why-head-reveal text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3498db]/10 border border-[#3498db]/25 text-[#1f6696] text-xs font-bold uppercase tracking-wider font-jetbrains">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {badgeText}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-inter tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-slate-600 font-inter text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* 3x2 Responsive Cards Grid */}
        <div className="why-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((reason, idx) => {
            const fallbackStyle = cardStyles[idx % cardStyles.length]
            const iconBg = reason.iconBg || fallbackStyle.iconBg
            const badgeBg = reason.badgeBg || fallbackStyle.badgeBg

            return (
              <div
                key={reason._id || reason.id || `reason-${idx}`}
                className="why-card-item group bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-[#3498db]/50 rounded-3xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#3498db]/10 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle top indicator bar */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#3498db]/30 to-transparent group-hover:via-[#3498db] transition-all duration-500" />

                <div className="space-y-6">
                  
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
                      {renderReasonIcon(reason.iconType)}
                    </div>
                    {reason.highlight && (
                      <span className={`text-[10px] font-bold font-jetbrains tracking-wider uppercase px-3 py-1 rounded-full border ${badgeBg}`}>
                        {reason.highlight}
                      </span>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2.5">
                    <h3 className="font-inter text-xl font-bold text-slate-900 group-hover:text-[#3498db] transition-colors leading-snug">
                      {reason.title}
                    </h3>
                    <p className="font-inter text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {reason.desc}
                    </p>
                  </div>

                </div>

                {/* Bottom Subtle Assurance */}
                <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between text-xs font-inter text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-[#1f6696] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3498db]" />
                    Included in all programs
                  </span>
                  <span className="text-slate-400 font-jetbrains text-[10px]">Data Knowledge</span>
                </div>

              </div>
            )
          })}
        </div>

        {/* Bottom CTA Banner */}
        {showCtaBanner && (
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1f6696] to-[#3498db] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-[#3498db]/20">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold font-inter">{ctaTitle}</h3>
              <p className="text-white/80 text-xs sm:text-sm font-inter">{ctaSubtitle}</p>
            </div>
            <Link
              to={ctaButtonLink}
              className="px-8 py-3.5 rounded-full bg-white text-[#1f6696] font-inter text-xs font-bold uppercase tracking-wider hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-md shrink-0"
            >
              {ctaButtonText}
            </Link>
          </div>
        )}

      </div>
    </section>
  )
}

export default WhyChooseUs
