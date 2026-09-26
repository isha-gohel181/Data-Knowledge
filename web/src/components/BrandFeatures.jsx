import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BrandFeatures = () => {
  const containerRef = useRef(null)

  const features = [
    {
      tag: "Expert Mentorship",
      scheme: "Industry Veterans",
      title: "Learn from Real Industry Experts",
      desc: "Get trained by professionals with real experience in Data Analytics, Business Analysis, Machine Learning, Data Science, and Artificial Intelligence. Our training focuses on practical knowledge, real business scenarios, and industry-level projects that help students become job-ready and confident for real-world challenges.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      points: ["Trained by Experienced Practitioners", "Real Business Scenario Walkthroughs", "Industry-Level Projects & Feedback"]
    },
    {
      tag: "Career Ready",
      scheme: "Placement Support",
      title: "Designed to Make You Job Ready",
      desc: "Our structured program includes hands-on projects, step-by-step guidance, resume building, and mock interview preparation. We focus on real-world problem solving so that students are fully prepared to crack Data Analyst, Business Analyst, Data Science, and Machine Learning interviews and start their careers with confidence.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      points: ["Step-by-Step Practical Guidance", "Professional Resume Building", "Mock Interview Prep & Real Problem Solving"]
    },
    {
      tag: "Advanced Tech",
      scheme: "Next-Gen AI",
      title: "Data Science, ML & AI",
      desc: "We also provide training in Data Science, Machine Learning, and Artificial Intelligence. Our programs include hands-on projects, continuous project support, and mock interview preparation to help students gain confidence and succeed in real job interviews.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      points: ["Machine Learning & Predictive Algorithms", "Continuous Project Support & Code Reviews", "AI Frameworks & Real-Time Case Studies"]
    },
    {
      tag: "Core Toolkit",
      scheme: "Hands-on Practice",
      title: "SQL, Excel, Power BI, Tableau & Python",
      desc: "Master essential industry tools including SQL for complex querying, Advanced Excel for analysis, Power BI & Tableau for interactive business dashboards, and Python for data manipulation and business analysis workflows.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      points: ["SQL & Relational Databases", "Power BI & Tableau Dashboarding", "Python Analytics & Business Analysis"]
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(['.features-header', '.feature-card-main'], { autoAlpha: 0, y: 15 })

      gsap.to('.features-header', { 
        y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-header',
          start: 'top 92%'
        }
      })

      gsap.utils.toArray('.feature-card-main').forEach((card, i) => {
        gsap.to(card, {
          y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', delay: i * 0.05,
          scrollTrigger: {
            trigger: card,
            start: 'top 94%'
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-slate-50 overflow-hidden z-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Segment */}
        <div className="features-header text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3498db]/10 border border-[#3498db]/30 text-[#1a5276] text-[11px] font-bold uppercase tracking-widest font-jetbrains">
            Why Choose Data Knowledge
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Practical, Real-Time & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498db] via-blue-600 to-[#1a5276]">
              Industry-Driven Learning
            </span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Whether you are a beginner starting your data analytics journey or a working professional upgrading skills, our training is engineered to accelerate your career growth.
          </p>
        </div>

        {/* 2x2 Grid Architecture with Strict Overflow Safety */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card-main group relative bg-white border border-slate-200/90 p-7 md:p-9 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#3498db]/60 hover:shadow-xl hover:shadow-[#3498db]/10 rounded-2xl min-w-0"
            >
              <div className="space-y-5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-[#3498db]/15 border border-[#3498db]/30 text-[#2980b9] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3498db] group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col items-end text-right min-w-0">
                    <span className="font-jetbrains text-[9px] text-[#2980b9] font-bold uppercase tracking-wider truncate max-w-[150px]">
                      {feature.tag}
                    </span>
                    <span className="font-jetbrains text-[8px] text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                      {feature.scheme}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-[#3498db] transition-colors duration-300 break-words">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words font-normal">
                    {feature.desc}
                  </p>
                </div>

                {/* Key Points */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {feature.points.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3498db] flex-shrink-0" />
                      <span className="truncate">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link 
                  to="/courses"
                  className="font-jetbrains text-xs font-bold text-[#1a5276] group-hover:text-[#3498db] uppercase tracking-wider flex items-center gap-2"
                >
                  Explore Programs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
                <span className="text-[10px] text-slate-400 font-jetbrains">Data Knowledge</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BrandFeatures
