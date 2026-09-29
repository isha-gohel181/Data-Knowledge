import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_PROGRAMS = [
  {
    id: 'combo-track',
    title: 'Master Data Analytics, Engineering & Science',
    shortTitle: 'Combo Master Track',
    tagline: 'Data Analyst + Data Engineering + Data Science in one comprehensive program.',
    badge: 'Flagship Combo Program',
    accentColor: 'from-amber-500 via-orange-500 to-[#3498db]',
    overview:
      'Master Data Analyst, Data Engineering & Data Science — from beginner to advanced. One program. Three career paths. Live online classes, 25+ industry projects, and dedicated placement guidance to launch your high-growth data career.',
    curriculum: [
      {
        title: 'Data Analyst Track',
        desc: 'Excel & Advanced Excel, SQL database querying, Power BI & Tableau visual dashboards.'
      },
      {
        title: 'Data Engineering Track',
        desc: 'Apache PySpark, Databricks orchestration, Snowflake Data Warehouse, and AWS/Azure cloud pipelines.'
      },
      {
        title: 'Data Science & Machine Learning Track',
        desc: 'Python, Pandas, statistical inference, Scikit-learn predictive algorithms, and AI deployment.'
      },
      {
        title: 'ChatGPT & AI-Integrated Analytics',
        desc: 'Leverage modern AI tools and automated prompts for business intelligence and data pipelines.'
      },
      {
        title: '25+ End-to-End Industry Capstones',
        desc: 'Healthcare, Finance, E-Commerce, Churn Prediction, and Cloud Data Warehouses.'
      }
    ],
    tools: ['Python', 'SQL', 'Power BI', 'Tableau', 'PySpark', 'Databricks', 'Snowflake', 'AWS', 'Excel'],
    careerRoles: [
      'Data Analyst',
      'Data Engineer',
      'Data Scientist',
      'BI Developer',
      'Cloud Analytics Consultant'
    ],
    stats: [
      { label: 'Live Classes', value: '100+ Live' },
      { label: 'Real Projects', value: '25+ Projects' },
      { label: 'Placement', value: '100% Support' }
    ],
    investment: {
      price: '₹70,000',
      salePrice: '₹50,000',
      save: 'Save ₹20,000'
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    id: 'data-business-analyst',
    title: 'Master Data & Business Analyst',
    shortTitle: 'Data Analyst',
    tagline: 'Excel, SQL, Power BI, Tableau, Python, and Jira with 10 industry dashboard projects.',
    badge: 'Most Popular Track',
    accentColor: 'from-blue-600 via-[#3498db] to-cyan-500',
    overview:
      'Designed for aspiring analysts and business professionals looking to turn raw enterprise data into strategic decisions. Master advanced database querying, business modeling, automated reporting, and interactive KPI dashboards with real-world enterprise datasets.',
    curriculum: [
      {
        title: 'Excel & Advanced Excel (Basic to Advance)',
        desc: 'Dynamic arrays, Pivot tables, financial modeling, and automated KPI reporting.'
      },
      {
        title: 'SQL Database Querying & Data Modeling',
        desc: 'Complex multi-table joins, subqueries, CTEs, and window functions for analytics.'
      },
      {
        title: 'Power BI & Tableau Dashboard Mastery',
        desc: 'End-to-end interactive dashboard design, DAX calculations, and visual storytelling.'
      },
      {
        title: 'Python & Applied Statistics',
        desc: 'Data wrangling with Pandas & NumPy, visual exploratory data analysis, and distributions.'
      },
      {
        title: 'Business Knowledge & Jira Management',
        desc: 'Agile project workflows, stakeholder presentations, and business reporting.'
      }
    ],
    tools: ['Excel', 'SQL', 'Power BI', 'Tableau', 'Python', 'Jira', 'ChatGPT AI'],
    careerRoles: [
      'Data Analyst',
      'Business Analyst',
      'BI Developer',
      'SQL Developer',
      'Power BI Developer'
    ],
    stats: [
      { label: 'Industry Projects', value: '10 Projects' },
      { label: 'Format', value: 'Daily Live' },
      { label: 'Salary Range', value: '₹4-15 LPA' }
    ],
    investment: {
      price: '₹35,000',
      salePrice: '₹25,000',
      save: 'Save ₹10,000'
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055z" />
        <path d="M20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" />
      </svg>
    )
  },
  {
    id: 'data-engineering',
    title: 'Master Data Engineering',
    shortTitle: 'Data Engineering',
    tagline: 'PySpark, Databricks, Snowflake, SSIS, and cloud ETL pipelines.',
    badge: 'High In-Demand',
    accentColor: 'from-emerald-600 via-teal-500 to-[#3498db]',
    overview:
      'Transform raw big data into high-performance analytical pipelines. Master Linux, Git, Advanced SQL, ETL concepts, Apache PySpark, Databricks orchestration, Snowflake Cloud Data Warehousing, and AWS/Azure cloud fundamentals.',
    curriculum: [
      {
        title: 'Python Scripting & Advanced SQL',
        desc: 'Automated data extraction, database indexing, and complex data querying.'
      },
      {
        title: 'ETL Concepts & SSIS Fundamentals',
        desc: 'Extract, Transform, Load design patterns and enterprise data integration.'
      },
      {
        title: 'Apache PySpark Big Data Processing',
        desc: 'Distributed data manipulation, RDDs, DataFrames, and streaming pipelines.'
      },
      {
        title: 'Databricks Workflow Orchestration',
        desc: 'Lakehouse architecture, automated job scheduling, and cluster management.'
      },
      {
        title: 'Snowflake & Cloud Data Warehousing',
        desc: 'Snowpipe automated ingestion, zero-copy cloning, and AWS/Azure cloud storage.'
      }
    ],
    tools: ['PySpark', 'Databricks', 'Snowflake', 'SQL', 'Python', 'AWS', 'Azure', 'Airflow'],
    careerRoles: [
      'Data Engineer',
      'ETL Developer',
      'Cloud Data Engineer',
      'Big Data Developer',
      'Database Specialist'
    ],
    stats: [
      { label: 'Pipelines Built', value: '8+ Cloud' },
      { label: 'Format', value: 'Live Hands-On' },
      { label: 'Salary Range', value: '₹6-25 LPA' }
    ],
    investment: {
      price: '₹45,000',
      salePrice: '₹30,000',
      save: 'Save ₹15,000'
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
        <line x1="8" y1="16" x2="8.01" y2="16" />
        <line x1="8" y1="20" x2="8.01" y2="20" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
        <line x1="12" y1="22" x2="12.01" y2="22" />
        <line x1="16" y1="16" x2="16.01" y2="16" />
        <line x1="16" y1="20" x2="16.01" y2="20" />
      </svg>
    )
  },
  {
    id: 'data-science',
    title: 'Master Data Science & Machine Learning',
    shortTitle: 'Data Science & AI',
    tagline: 'Python, statistics, ML algorithms, Scikit-learn, and model deployment.',
    badge: 'Next-Gen AI Track',
    accentColor: 'from-purple-600 via-indigo-600 to-[#3498db]',
    overview:
      'Go from raw data to predictive intelligence. Master Python, NumPy, Pandas, applied statistical inference, supervised/unsupervised ML algorithms, Scikit-learn, feature engineering, and real-world business case studies.',
    curriculum: [
      {
        title: 'Python, NumPy & Pandas Data Wrangling',
        desc: 'Advanced data manipulation, cleaning, exploratory data analysis, and visualizations.'
      },
      {
        title: 'Applied Statistics & Probability Inference',
        desc: 'Hypothesis testing, probability distributions, A/B testing, and business metrics.'
      },
      {
        title: 'Machine Learning & Scikit-Learn Algorithms',
        desc: 'Regression, Decision Trees, Random Forests, XGBoost, and KNN clustering.'
      },
      {
        title: 'Feature Engineering & Model Optimization',
        desc: 'Hyperparameter tuning, cross-validation, and model accuracy optimization.'
      },
      {
        title: 'AI, Cloud Services & Production Deployment',
        desc: 'Model packaging, REST API creation, and deploying live predictive endpoints.'
      }
    ],
    tools: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistics', 'Power BI', 'AI & Cloud'],
    careerRoles: [
      'Data Scientist',
      'ML Engineer',
      'Analytics Consultant',
      'Predictive Modeler',
      'AI Specialist'
    ],
    stats: [
      { label: 'ML Models', value: '10+ Models' },
      { label: 'Format', value: 'Live Mentorship' },
      { label: 'Salary Range', value: '₹6-30 LPA' }
    ],
    investment: {
      price: '₹50,000',
      salePrice: '₹35,000',
      save: 'Save ₹15,000'
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2z" />
        <path d="M19 13l.9 2.7L23 17l-3.1 1.3L19 21l-.9-2.7L15 17l3.1-1.3L19 13z" />
      </svg>
    )
  }
]

const ProgramsWeOffer = () => {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector((state) => state.courses)
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  // Dynamically map backend courses (if any exist and are valid) into programs, or fallback to default programs
  const programs = useMemo(() => {
    if (!courses || courses.length === 0) {
      return DEFAULT_PROGRAMS
    }

    // Filter valid, published courses
    const validCourses = courses.filter((c) => c && c.isPublished !== false && !c.isDeleted)

    if (validCourses.length === 0) {
      return DEFAULT_PROGRAMS
    }

    return validCourses.map((c, index) => {
      const defaultMatch = DEFAULT_PROGRAMS[index % DEFAULT_PROGRAMS.length]
      
      const curriculum = (c.modules && c.modules.length > 0)
        ? c.modules.slice(0, 5).map((m) => ({
            title: m.title || 'Course Module',
            desc: m.description || 'Hands-on live curriculum and practical projects.'
          }))
        : defaultMatch.curriculum

      const tools = (c.tags && c.tags.length > 0)
        ? c.tags
        : defaultMatch.tools

      const careerRoles = (c.targetAudience && c.targetAudience.length > 0)
        ? c.targetAudience
        : defaultMatch.careerRoles

      const stats = [
        { label: 'Classes', value: c.duration ? `${c.duration} Hours` : defaultMatch.stats[0].value },
        { label: 'Projects', value: defaultMatch.stats[1].value },
        { label: 'Support', value: '100% Placement' }
      ]

      const salePrice = c.salePrice ? `₹${Number(c.salePrice).toLocaleString()}` : defaultMatch.investment.salePrice
      const price = c.price ? `₹${Number(c.price).toLocaleString()}` : defaultMatch.investment.price

      return {
        id: c._id || c.slug || `prog-${index}`,
        courseId: c._id || c.slug,
        title: c.title || defaultMatch.title,
        shortTitle: c.title?.split(' ')[1] ? c.title.replace('Master ', '').slice(0, 20) : (c.title || defaultMatch.shortTitle),
        tagline: c.shortDescription || defaultMatch.tagline,
        badge: c.popular ? 'Most Popular Track' : (c.isFeatured ? 'Featured Track' : defaultMatch.badge),
        accentColor: defaultMatch.accentColor,
        overview: c.description || defaultMatch.overview,
        curriculum,
        tools,
        careerRoles,
        stats,
        investment: {
          price,
          salePrice,
          save: c.price && c.salePrice && Number(c.price) > Number(c.salePrice) ? `Save ₹${(Number(c.price) - Number(c.salePrice)).toLocaleString()}` : 'Special Offer'
        },
        icon: defaultMatch.icon
      }
    })
  }, [courses])

  useEffect(() => {
    if (programs.length > 0 && (!activeTab || !programs.some(p => p.id === activeTab))) {
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
    }, 250)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.program-head-reveal',
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
        '.program-tabs-container',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.program-tabs-container',
            start: 'top 88%'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="programs" ref={containerRef} className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-r from-blue-100/50 via-sky-100/35 to-indigo-100/45 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="program-head-reveal text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3498db]/10 border border-[#3498db]/25 text-[#1f6696] text-xs font-bold uppercase tracking-wider font-jetbrains">
            <span className="w-2 h-2 rounded-full bg-[#3498db] animate-pulse" />
            Curated Career Tracks
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-inter tracking-tight leading-tight">
            Programs We Offer
          </h2>

          <p className="text-slate-600 font-inter text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Select a program track below to explore curriculum modules, tool stacks, and career paths.
          </p>
        </div>

        {/* Interactive Menu / Tab Navigation Bar */}
        <div className="program-tabs-container max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl md:rounded-full border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-2">
            {programs.map((prog) => {
              const isActive = prog.id === activeTab
              return (
                <button
                  key={prog.id}
                  onClick={() => handleTabChange(prog.id)}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 md:py-3.5 rounded-xl md:rounded-full font-inter text-xs md:text-sm font-bold transition-all duration-300 relative select-none ${
                    isActive
                      ? 'bg-[#3498db] text-white shadow-lg shadow-[#3498db]/30 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#3498db]'}`}>
                    {prog.icon}
                  </span>
                  <span className="truncate">{prog.shortTitle}</span>
                  {isActive && (
                    <span className="hidden xl:inline-block text-[10px] uppercase font-jetbrains font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                      Active
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Single Detail Display Container */}
        {activeProgram && (
          <div className="max-w-6xl mx-auto">
            <div
              className={`bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden transition-all duration-300 ${
                isAnimating ? 'opacity-40 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Top Accent Gradient Ribbon */}
              <div className={`absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r ${activeProgram.accentColor}`} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column: Program Info, Overview & Curriculum (7 Cols) */}
                <div className="lg:col-span-7 space-y-7">
                  
                  {/* Header Row */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[11px] font-bold font-jetbrains tracking-wider uppercase px-3 py-1 rounded-full bg-[#3498db]/10 text-[#1f6696] border border-[#3498db]/25">
                        {activeProgram.badge}
                      </span>
                      <span className="text-xs font-medium text-slate-400">• 100% Placement Support</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-inter leading-tight">
                      {activeProgram.title}
                    </h3>

                    <p className="text-sm sm:text-base font-inter text-slate-600 leading-relaxed font-normal">
                      {activeProgram.overview}
                    </p>
                  </div>

                  {/* Core Curriculum Modules */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold font-jetbrains uppercase tracking-wider text-slate-800">
                        What You Will Learn & Build
                      </h4>
                      <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="space-y-2.5">
                      {activeProgram.curriculum.map((module, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-[#3498db]/30 transition-colors flex items-start gap-3.5"
                        >
                          <div className="w-6 h-6 rounded-lg bg-[#3498db]/10 text-[#3498db] flex items-center justify-center shrink-0 mt-0.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold font-inter text-slate-900">
                              {module.title}
                            </p>
                            <p className="text-xs font-inter text-slate-600 leading-relaxed">
                              {module.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Career Roles */}
                  <div className="space-y-2.5 pt-2">
                    <p className="text-[11px] font-jetbrains font-bold uppercase tracking-wider text-slate-400">
                      Target Career Opportunities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeProgram.careerRoles.map((role, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-xs font-semibold font-inter px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: High-Impact Program Snapshot Card (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
                    
                    {/* Card Title & Pricing */}
                    <div className="space-y-2 pb-4 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-jetbrains font-bold uppercase tracking-wider text-[#3498db]">
                          Program Investment
                        </p>
                        {activeProgram.investment?.save && (
                          <span className="text-[10px] font-extrabold font-jetbrains uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            {activeProgram.investment.save}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-inter">
                          {activeProgram.investment?.salePrice || '₹25,000'}
                        </span>
                        {activeProgram.investment?.price && (
                          <span className="text-sm font-medium text-slate-400 line-through">
                            {activeProgram.investment.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3-Point Metrics */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      {activeProgram.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-0.5">
                          <p className="font-jetbrains text-xs sm:text-sm font-black text-slate-900">{stat.value}</p>
                          <p className="font-inter text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tools Stack */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-jetbrains font-bold uppercase tracking-wider text-slate-500">
                        Tools & Frameworks Covered
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeProgram.tools.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs font-bold font-inter px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[#1f6696] shadow-2xs"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Value Props */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200/80 text-xs font-inter text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Live 1-on-1 Mentor Guidance & Daily Mocks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#3498db]" />
                        <span>Verified Industry Capstone Certificate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>Lifetime Learning Support & Community Access</span>
                      </div>
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      <Link
                        to={activeProgram.courseId ? `/course-detail/${activeProgram.courseId}` : '/courses'}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#3498db] text-white font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#2980b9] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-[#3498db]/20 flex items-center justify-center gap-2"
                      >
                        <span>Explore Program Details</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>

                      <Link
                        to="/contact"
                        className="w-full py-3 px-6 rounded-xl bg-white border border-slate-200 text-slate-700 font-inter text-xs font-bold uppercase tracking-wider hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Book Free Consultation / Mock</span>
                      </Link>
                    </div>

                  </div>
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
