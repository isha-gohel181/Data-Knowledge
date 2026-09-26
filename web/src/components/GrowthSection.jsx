import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GrowthSection = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.grants-card', {
        scrollTrigger: {
          trigger: '.grants-card',
          start: 'top 92%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const highlights = [
    {
      title: "Real-Time Business Projects",
      desc: "Work on authentic business datasets in SQL, Power BI, Python & Excel to build an impressive portfolio."
    },
    {
      title: "Resume & Mock Interviews",
      desc: "One-on-one resume reviews, technical mock interviews, and scenario-based questions to crack top hiring rounds."
    },
    {
      title: "Live Interactive Classes",
      desc: "Engage with experienced industry mentors in live sessions with active Q&A, continuous support & doubt clearing."
    }
  ]

  return (
    <section ref={containerRef} className="w-full bg-slate-50 py-16 md:py-24 px-4 md:px-12 lg:px-20 overflow-x-hidden border-t border-slate-200">
      
      <div className="grants-card max-w-7xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 md:p-14 shadow-md flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Side: Ecosystem Info */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3498db]/10 border border-[#3498db]/30 text-[#1a5276] text-[11px] font-bold uppercase tracking-widest font-jetbrains">
            Accelerate Your Data Career
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Complete Career Support & <br className="hidden sm:block" />
            <span className="text-[#3498db]">Hands-on Mentorship</span>
          </h2>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            At Data Knowledge, we provide comprehensive end-to-end guidance from foundation to job-readiness with real-world problem solving, step-by-step guidance, and continuous project assistance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {highlights.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Career Guidance Card */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-4 flex-shrink-0">
          <div className="p-6 rounded-2xl bg-[#154360] border border-[#3498db]/30 text-white text-center lg:text-left space-y-4 max-w-sm shadow-xl">
            <h3 className="font-bold text-lg text-white font-inter">Career Guidance & Mentorship</h3>
            <p className="text-xs text-sky-100 leading-relaxed">
              Connect directly with our seasoned industry mentors to evaluate your career profile and choose the right learning path.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/contact"
                className="px-5 py-3 rounded-full bg-[#3498db] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2980b9] transition-all text-center shadow-md shadow-[#3498db]/30 flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <span>Talk to Mentors</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/courses"
                className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all text-center"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>

      </div>

    </section>
  )
}

export default GrowthSection
