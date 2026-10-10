import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import axios from 'axios'

gsap.registerPlugin(ScrollTrigger)

const MentorsSection = () => {
  const containerRef = useRef(null)

  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(`${API_URL}/mentors?status=active`)
        if (response.data.success) {
          setMentors(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMentors()
  }, [API_URL])

  // Re-run animations when mentors are loaded
  useEffect(() => {
    if (!loading && mentors.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.mentor-header-reveal',
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
          '.mentor-card-item',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.mentors-grid-wrapper',
              start: 'top 85%'
            }
          }
        )
      }, containerRef)

      return () => ctx.revert()
    }
  }, [loading, mentors])

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_URL}/${normalizedPath}`;
  };

  if (loading) return null;

  return (
    <section ref={containerRef} className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#3498db]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Section Header */}
        <div className="mentor-header-reveal text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3498db]/10 border border-[#3498db]/25 text-[#1f6696] text-xs font-bold uppercase tracking-wider font-jetbrains">
            <span className="w-2 h-2 rounded-full bg-[#3498db] animate-pulse" />
            Learn From The Experts
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-inter tracking-tight leading-tight">
            Meet Your Mentors
          </h2>

          <p className="text-slate-600 font-inter text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Get trained by professionals with proven track records in top tech & consulting companies who bring real enterprise experience to every session.
          </p>
        </div>

        {/* Mentors Grid: 2 Distinctive Modern Cards */}
        <div className="mentors-grid-wrapper grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`mentor-card-item group relative bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-sm hover:shadow-2xl ${mentor.glowColor} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden ${mentor.borderColor}`}
            >
              {/* Top ambient color glow */}
              <div className={`absolute top-0 left-0 right-0 h-36 bg-gradient-to-b ${mentor.accentGradient} opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="relative z-10 space-y-6">
                
                {/* Header: Avatar, Name & Ex-Company Badges */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
                  
                  {/* Portrait with Verified Indicator */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-md border border-slate-200/80 bg-slate-100">
                      <img
                        src={getMediaUrl(mentor.image)}
                        alt={mentor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/herocard.png'
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#3498db] text-white flex items-center justify-center border-2 border-white shadow-sm" title="Verified Industry Mentor">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>

                  {/* Name & Titles */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-inter text-2xl font-bold text-slate-900 group-hover:text-[#3498db] transition-colors">
                        {mentor.name}
                      </h3>
                      <span className="text-[10px] font-bold font-jetbrains tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#3498db]/10 text-[#1f6696] border border-[#3498db]/20">
                        {mentor.experienceBadge}
                      </span>
                    </div>

                    <p className="font-inter text-xs sm:text-sm font-semibold text-[#3498db]">
                      {mentor.role}
                    </p>

                    {/* Ex-Company Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mentor.exCompanies && mentor.exCompanies.map((comp, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[10px] font-jetbrains font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Stat Counters Ribbon */}
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50/80 border border-slate-200/70 rounded-2xl">
                  {mentor.stats && mentor.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="text-center space-y-0.5">
                      <p className="font-jetbrains text-base sm:text-lg font-black text-slate-900">{stat.value}</p>
                      <p className="font-inter text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Bio Description */}
                <div className="space-y-3 font-inter text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {mentor.bio && mentor.bio.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Skills & Domains */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[10px] font-jetbrains font-bold uppercase tracking-wider text-slate-400">Core Expertise & Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.skills && mentor.skills.map((skill, skIdx) => (
                      <span
                        key={skIdx}
                        className="text-xs font-semibold font-inter px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-slate-800 group-hover:border-[#3498db]/30 group-hover:bg-[#3498db]/5 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Action Row */}
              <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-inter font-medium text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Active Live Sessions & Mentorship</span>
                </div>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#3498db] text-white font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#2980b9] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#3498db]/20 flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Connect With Mentor</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default MentorsSection
