import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ProgramsWeOffer = () => {
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState('data-business-analyst')
  const [isAnimating, setIsAnimating] = useState(false)

  const programs = [
    {
      id: 'data-business-analyst',
      title: 'Master Data & Business Analyst',
      shortTitle: 'Data & Business Analyst',
      tagline: 'Excel, SQL, Power BI, Tableau, and Snowflake with hands-on analyst projects.',
      badge: 'Most Popular Track',
      accentColor: 'from-blue-600 via-[#3498db] to-cyan-500',
      overview:
        'Designed for aspiring analysts and business professionals looking to turn raw enterprise data into strategic decisions. Master advanced database querying, business modeling, automated reporting, and interactive KPI dashboards with real-world enterprise datasets.',
      curriculum: [
        {
          title: 'Advanced Excel & Business Analytics',
          desc: 'Dynamic arrays, Pivot tables, financial modeling, and automated KPI reporting.'
        },
        {
          title: 'SQL Database Querying & Data Modeling',
          desc: 'Complex multi-table joins, subqueries, CTEs, and window functions for analytics.'
        },
        {
          title: 'Power BI & DAX Calculations',
          desc: 'End-to-end dashboard design, custom measures, and interactive storytelling.'
        },
        {
          title: 'Tableau Visual Storytelling',
          desc: 'Executive scorecards, calculated fields, and business intelligence dashboards.'
        },
        {
          title: 'Snowflake Cloud Data Warehouse',
          desc: 'Cloud data querying, schema architecture, and modern ETL data pipelines.'
        }
      ],
      tools: ['Excel', 'SQL', 'Power BI', 'Tableau', 'Snowflake', 'PostgreSQL'],
      careerRoles: [
        'Data Analyst',
        'Business Analyst',
        'BI Developer',
        'Operations Analyst',
        'Reporting Specialist'
      ],
      stats: [
        { label: 'Real Projects', value: '12+ Dashboards' },
        { label: 'Format', value: 'Live Interactive' },
        { label: 'Career Support', value: 'Resume & Mocks' }
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055z" />
          <path d="M20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" />
        </svg>
      )
    },
    {
      id: 'data-science',
      title: 'Master Data Science',
      shortTitle: 'Data Science',
      tagline: 'Python, statistics, ML, and visualization with projects and daily practice.',
      badge: 'High In-Demand',
      accentColor: 'from-sky-600 via-cyan-500 to-teal-400',
      overview:
        'A comprehensive, hands-on path into modern Data Science. Master Python programming from fundamentals to advanced data wrangling, rigorous statistical hypothesis testing, and machine learning pipelines that solve complex business challenges.',
      curriculum: [
        {
          title: 'Python for Data Science & OOP',
          desc: 'Data structures, algorithm optimization, and clean modular Python programming.'
        },
        {
          title: 'Pandas & NumPy Data Wrangling',
          desc: 'Data cleansing, merging, reshaping, and handling large tabular datasets.'
        },
        {
          title: 'Applied Statistics & Probability',
          desc: 'Hypothesis testing, distributions, A/B test analysis, and statistical inference.'
        },
        {
          title: 'Exploratory Data Analysis (EDA)',
          desc: 'Visual data exploration with Matplotlib & Seaborn to uncover hidden patterns.'
        },
        {
          title: 'End-to-End Capstone Project',
          desc: 'Complete portfolio project built on real industry datasets from start to finish.'
        }
      ],
      tools: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter', 'Git'],
      careerRoles: [
        'Data Scientist',
        'Associate Data Scientist',
        'Data Analytics Engineer',
        'Quantitative Analyst'
      ],
      stats: [
        { label: 'Case Studies', value: '8+ In-depth' },
        { label: 'Coding Tasks', value: '100+ Exercises' },
        { label: 'Guidance', value: '1-on-1 Reviews' }
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
          <path d="M9 7h6v2H9V7z" />
        </svg>
      )
    },
    {
      id: 'machine-learning',
      title: 'Master Machine Learning',
      shortTitle: 'Machine Learning',
      tagline: 'Python ML: regression, trees, ensemble models, and KNN on real datasets.',
      badge: 'Advanced Track',
      accentColor: 'from-indigo-600 via-blue-600 to-[#3498db]',
      overview:
        'Level up your analytical capabilities with machine learning algorithms. Master both the mathematics and practical implementation of supervised and unsupervised models, cross-validation techniques, hyperparameter optimization, and deployment pipelines.',
      curriculum: [
        {
          title: 'Supervised Learning Algorithms',
          desc: 'Linear & Logistic Regression, Decision Trees, KNN, and Naive Bayes.'
        },
        {
          title: 'Ensemble Learning & Gradient Boosting',
          desc: 'Random Forests, XGBoost, LightGBM, and boosting architectures.'
        },
        {
          title: 'Unsupervised Learning & Clustering',
          desc: 'K-Means, Hierarchical Clustering, PCA, and dimensionality reduction.'
        },
        {
          title: 'Hyperparameter Tuning & Evaluation',
          desc: 'Cross-validation, ROC-AUC, confusion matrices, and Grid/Random Search.'
        },
        {
          title: 'Model Packaging & API Deployment',
          desc: 'Serving ML models via FastAPI/Flask endpoints for live prediction.'
        }
      ],
      tools: ['Scikit-Learn', 'Python', 'XGBoost', 'SciPy', 'FastAPI', 'MLflow'],
      careerRoles: [
        'Machine Learning Engineer',
        'ML Practitioner',
        'Predictive Modeler',
        'AI/ML Consultant'
      ],
      stats: [
        { label: 'ML Models', value: '6+ Deployed' },
        { label: 'Data Sources', value: 'Kaggle & Industry' },
        { label: 'Interview Prep', value: 'ML Architecture' }
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2" />
          <path d="M7 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
          <path d="M9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      id: 'generative-ai',
      title: 'Master Generative AI',
      shortTitle: 'Generative AI',
      tagline: 'Prompt engineering, ChatGPT, and practical AI apps for real workflows.',
      badge: 'Next-Gen Future',
      accentColor: 'from-purple-600 via-indigo-600 to-[#3498db]',
      overview:
        'Step into the frontier of artificial intelligence. Master prompt engineering methodologies, Large Language Model (LLM) APIs, Retrieval-Augmented Generation (RAG) with vector databases, and building autonomous AI workflow agents.',
      curriculum: [
        {
          title: 'Advanced Prompt Engineering',
          desc: 'Zero-shot, Few-shot, Chain-of-Thought prompting, and context optimization.'
        },
        {
          title: 'OpenAI API & LLM Tool Calling',
          desc: 'Building custom assistants with GPT models, system prompts, and function calling.'
        },
        {
          title: 'RAG & Vector Databases',
          desc: 'Document embeddings, vector search with Pinecone/Chroma, and knowledge retrieval.'
        },
        {
          title: 'LangChain & Agentic Workflows',
          desc: 'Chaining tools, memory management, and multi-step autonomous AI agents.'
        },
        {
          title: 'Practical AI App Deployment',
          desc: 'Full-stack AI application deployment for workflow automation and analytics.'
        }
      ],
      tools: ['GPT-4 API', 'LangChain', 'Pinecone', 'ChromaDB', 'Python', 'Streamlit'],
      careerRoles: [
        'Generative AI Specialist',
        'AI Solutions Consultant',
        'Prompt Engineer',
        'AI Product Integrator'
      ],
      stats: [
        { label: 'AI Apps', value: '5+ Full Projects' },
        { label: 'Tech Stack', value: 'Modern LLM Tools' },
        { label: 'Outcome', value: 'AI Workflow Ready' }
      ],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2z" />
          <path d="M19 13l.9 2.7L23 17l-3.1 1.3L19 21l-.9-2.7L15 17l3.1-1.3L19 13z" />
        </svg>
      )
    }
  ]

  const activeProgram = programs.find((p) => p.id === activeTab) || programs[0]

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
    <section ref={containerRef} className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      
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
                    <span className="text-xs font-medium text-slate-400">• Comprehensive Track</span>
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
                  
                  {/* Card Title */}
                  <div className="space-y-1 pb-4 border-b border-slate-200">
                    <p className="text-[10px] font-jetbrains font-bold uppercase tracking-wider text-[#3498db]">
                      Program Highlights
                    </p>
                    <h4 className="text-lg font-bold font-inter text-slate-900">
                      Track Snapshot & Tools
                    </h4>
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
                      <span>Live 1-on-1 Mentor Guidance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3498db]" />
                      <span>Verified Industry Capstone Certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Lifetime Access to Class Materials & Recordings</span>
                    </div>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <Link
                      to="/courses"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#3498db] text-white font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#2980b9] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-[#3498db]/20 flex items-center justify-center gap-2"
                    >
                      <span>Explore Full Course</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>

                    <Link
                      to="/contact"
                      className="w-full py-3 px-6 rounded-xl bg-white border border-slate-200 text-slate-700 font-inter text-xs font-bold uppercase tracking-wider hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Book Free Trial / Consultation</span>
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ProgramsWeOffer
