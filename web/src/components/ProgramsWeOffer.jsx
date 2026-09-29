import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProgramOffers } from '../redux/slices/programOfferSlice'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const renderProgramIcon = (iconName) => {
  switch (iconName) {
    case 'analytics':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055z" />
          <path d="M20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" />
        </svg>
      )
    case 'cloud':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
          <line x1="8" y1="16" x2="8.01" y2="16" />
          <line x1="8" y1="20" x2="8.01" y2="20" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
          <line x1="12" y1="22" x2="12.01" y2="22" />
        </svg>
      )
    case 'sparkles':
    case 'ai':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2z" />
          <path d="M19 13l.9 2.7L23 17l-3.1 1.3L19 21l-.9-2.7L15 17l3.1-1.3L19 13z" />
        </svg>
      )
    case 'code':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    case 'database':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    case 'cpu':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    case 'star':
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
  }
}

const DEFAULT_PROGRAMS = [
  {
    id: 'combo-track',
    title: 'Master Data Analytics, Engineering & Science',
    shortTitle: 'Combo Track',
    badge: 'Flagship Combo',
    icon: 'star',
    highlights: [
      'Data Analytics, Data Engineering & Data Science (3-in-1 Track)',
      '25+ Industry Capstones with Real Enterprise Datasets',
      'Daily Live Online Interactive Classes & 1-on-1 Mentorship'
    ],
    tools: ['Python', 'SQL', 'Power BI', 'Tableau', 'PySpark', 'Databricks', 'Snowflake', 'AWS'],
  },
  {
    id: 'data-business-analyst',
    title: 'Master Data & Business Analyst',
    shortTitle: 'Data Analyst',
    badge: 'Most Popular',
    icon: 'analytics',
    highlights: [
      'Advanced Excel, SQL Querying & Relational Data Modeling',
      'Interactive KPI Dashboards with Power BI & Tableau',
      'Python Analytics & 10 Enterprise Business Case Studies'
    ],
    tools: ['Excel', 'SQL', 'Power BI', 'Tableau', 'Python', 'Jira'],
  },
  {
    id: 'data-engineering',
    title: 'Master Data Engineering',
    shortTitle: 'Data Engineering',
    badge: 'High Demand',
    icon: 'cloud',
    highlights: [
      'Big Data Processing with Apache PySpark & Python',
      'Databricks Lakehouse Architecture & Orchestration',
      'Snowflake Cloud Data Warehousing & AWS/Azure ETL'
    ],
    tools: ['PySpark', 'Databricks', 'Snowflake', 'SQL', 'Python', 'AWS'],
  },
  {
    id: 'data-science',
    title: 'Master Data Science & Machine Learning',
    shortTitle: 'Data Science & AI',
    badge: 'Next-Gen AI',
    icon: 'sparkles',
    highlights: [
      'Applied Statistics & Exploratory Data Analysis in Python',
      'Supervised & Unsupervised Scikit-Learn ML Algorithms',
      'Production ML Model Deployment & Real-time AI APIs'
    ],
    tools: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistics', 'Power BI'],
  }
]

const ProgramsWeOffer = () => {
  const dispatch = useDispatch()
  const { programs: dynamicPrograms } = useSelector((state) => state.programOffers || { programs: [] })
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    dispatch(fetchProgramOffers())
  }, [dispatch])

  // Dynamically map backend programs from database or fallback to default programs
  const programs = useMemo(() => {
    if (dynamicPrograms && dynamicPrograms.length > 0) {
      return dynamicPrograms.map((p, index) => {
        const defaultMatch = DEFAULT_PROGRAMS[index % DEFAULT_PROGRAMS.length] || DEFAULT_PROGRAMS[0]
        return {
          id: p._id || `prog-${index}`,
          courseId: p.courseId || '',
          title: p.title || defaultMatch.title,
          shortTitle: p.shortTitle || defaultMatch.shortTitle || p.title,
          badge: p.badge || defaultMatch.badge,
          icon: p.icon || defaultMatch.icon || 'star',
          highlights: p.highlights && p.highlights.length > 0 ? p.highlights : defaultMatch.highlights,
          tools: p.tools && p.tools.length > 0 ? p.tools : defaultMatch.tools,
        }
      })
    }

    return DEFAULT_PROGRAMS
  }, [dynamicPrograms])

  useEffect(() => {
    if (programs.length > 0 && (!activeTab || !programs.some((p) => p.id === activeTab))) {
      setActiveTab(programs[0].id)
    }
  }, [programs, activeTab])

  const activeProgram = programs.find((p) => p.id === activeTab) || programs[0] || DEFAULT_PROGRAMS[0]

  const handleTabChange = (tabId) => {
    if (tabId === activeTab || isAnimating) return
    setIsAnimating(true)
    setActiveTab(tabId)
    setTimeout(() => {
      setIsAnimating(false)
    }, 180)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.program-head-reveal',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="programs"
      ref={containerRef}
      className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-slate-50 relative overflow-hidden border-t border-slate-200/80"
    >
      {/* Decorative ambient background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-100/40 via-sky-100/30 to-indigo-100/35 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="program-head-reveal text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3498db]/10 border border-[#3498db]/20 text-[#1f6696] text-[11px] font-bold uppercase tracking-wider font-jetbrains">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3498db] animate-pulse" />
            Curated Career Tracks
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-inter tracking-tight">
            Programs We Offer
          </h2>

          <p className="text-slate-600 font-inter text-sm sm:text-base font-normal leading-relaxed">
            Select a program below to explore curriculum highlights and tools covered.
          </p>
        </div>

        {/* Pixel-Perfect Segmented Capsule Tab Navigation */}
        <div className="max-w-4xl mx-auto flex justify-center px-2">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 bg-white rounded-full border border-slate-200 shadow-sm max-w-full overflow-x-auto no-scrollbar scrollbar-none">
            {programs.map((prog) => {
              const isActive = prog.id === activeTab
              return (
                <button
                  key={prog.id}
                  onClick={(e) => {
                    handleTabChange(prog.id)
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                  }}
                  className={`shrink-0 flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-inter text-xs sm:text-sm font-semibold transition-all duration-200 select-none whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#3498db] text-white shadow-md shadow-[#3498db]/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#3498db]'}`}>
                    {renderProgramIcon(prog.icon)}
                  </span>
                  <span>{prog.shortTitle || prog.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Clean, Focused Program Detail Card */}
        {activeProgram && (
          <div className="max-w-4xl mx-auto">
            <div
              className={`bg-white border-2 border-[#3498db] rounded-2xl p-6 sm:p-8 shadow-lg shadow-[#3498db]/10 relative overflow-hidden transition-all duration-200 ${
                isAnimating ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Card Header: Title */}
              <div className="pb-5 border-b border-slate-100">
                <div className="space-y-1.5">
                  <span className="inline-block text-[11px] font-bold font-jetbrains tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-[#3498db]/10 text-[#1f6696] border border-[#3498db]/20 break-words">
                    {activeProgram.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-inter leading-snug break-words">
                    {activeProgram.title}
                  </h3>
                </div>
              </div>

              {/* Highlights & Tools in a clean, uncluttered layout */}
              <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left: Key Highlights */}
                <div className="md:col-span-7 space-y-2.5">
                  <p className="text-[11px] font-bold font-jetbrains uppercase tracking-wider text-slate-500">
                    Key Highlights
                  </p>
                  <ul className="space-y-2">
                    {activeProgram.highlights?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700 font-inter">
                        <span className="w-4 h-4 rounded-full bg-[#3498db]/15 text-[#3498db] flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="break-words flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Tools & Technologies */}
                <div className="md:col-span-5 space-y-2.5">
                  <p className="text-[11px] font-bold font-jetbrains uppercase tracking-wider text-slate-500">
                    Tools Covered
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProgram.tools?.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-semibold font-inter px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 break-words"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: Format & Actions */}
              <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3498db]" />
                    100% Placement Support
                  </span>
                  <span>•</span>
                  <span>Daily Live Classes</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    to="/contact"
                    className="flex-1 sm:flex-none text-center py-2 px-4 rounded-xl text-xs font-bold font-inter text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Book Free Demo
                  </Link>

                  <Link
                    to={activeProgram.courseId ? `/course-detail/${activeProgram.courseId}` : '/courses'}
                    className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-[#3498db] text-white font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#2980b9] transition-all shadow-sm shadow-[#3498db]/30 flex items-center justify-center gap-1.5"
                  >
                    <span>View Curriculum</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProgramsWeOffer
