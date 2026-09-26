import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import RollingText from '../components/RollingText'
import CourseCard from '../components/CourseCard'
import EventHero from '../components/EventHero'
import { fetchEvents } from '../redux/slices/eventSlice'
import { useLanguage } from '../context/LanguageContext'

const defaultCourses = [
  {
    id: 1,
    category: 'DATA ANALYTICS',
    title: 'Complete Data Analytics Masterclass',
    description: 'Master SQL, Excel, Power BI, and Python with hands-on projects and real datasets.',
    price: '₹14,999',
    image: '/courses/architecture.png',
    level: ['Beginner', 'Intermediate'],
    difficulty: 'Beginner',
    duration: '40 hours',
    isNew: true,
  },
  {
    id: 2,
    category: 'POWER BI & TABLEAU',
    title: 'Power BI & Tableau Dashboard Mastery',
    description: 'Build executive-ready interactive dashboards, DAX queries, and KPI storytelling.',
    price: '₹9,999',
    image: '/courses/typography.png',
    level: ['Beginner', 'Intermediate', 'Advanced'],
    difficulty: 'Intermediate',
    duration: '25 hours',
    isNew: true,
  },
  {
    id: 3,
    category: 'SQL & PYTHON',
    title: 'SQL & Python for Data Analysis',
    description: 'Learn database query optimization, Pandas, NumPy, and automated data pipelines.',
    price: '₹11,499',
    image: '/courses/curator.png',
    level: ['Beginner', 'Intermediate'],
    difficulty: 'Beginner',
    duration: '30 hours',
    isNew: true,
  },
  {
    id: 4,
    category: 'DATA SCIENCE & AI',
    title: 'Applied Data Science & Machine Learning',
    description: 'End-to-end ML model building, predictive modeling, Scikit-learn, and real business cases.',
    price: '₹19,999',
    image: '/courses/narrative.png',
    level: ['Intermediate', 'Advanced'],
    difficulty: 'Advanced',
    duration: '50 hours',
    isNew: true,
  },
  {
    id: 5,
    category: 'BUSINESS ANALYSIS',
    title: 'Business Analysis & Strategy Foundations',
    description: 'Translate complex data into actionable business requirements, wireframes, and strategic roadmaps.',
    price: '₹8,999',
    image: '/courses/motion.png',
    level: ['Beginner', 'Intermediate'],
    difficulty: 'Beginner',
    duration: '20 hours',
    isNew: false,
  },
  {
    id: 6,
    category: 'POWER BI & TABLEAU',
    title: 'Advanced DAX & Business Intelligence',
    description: 'Advanced data modeling, row-level security, and enterprise BI reporting architectures.',
    price: '₹12,499',
    image: '/courses/pricing.png',
    level: ['Advanced'],
    difficulty: 'Advanced',
    duration: '28 hours',
    isNew: false,
  }
]

const Courses = () => {
  const dispatch = useDispatch()
  const { courses, loading, error } = useSelector((state) => state.courses)
  const { eventList, loading: eventsLoading } = useSelector((state) => state.events)
  const containerRef = useRef(null)
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('ALL COURSES')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All hours')
  const advancedRef = useRef(null)
  const [hasFetchedEvents, setHasFetchedEvents] = useState(false)

  // Use API courses if available and non-empty, otherwise fallback to curated Data Knowledge course catalog
  const displayCourses = useMemo(() => {
    if (courses && courses.length > 0) return courses
    return defaultCourses
  }, [courses])

  const filteredCourses = useMemo(() => {
    return (displayCourses || []).filter(item => {
      // 1. Category Filter
      const matchesCategory = (() => {
        if (activeFilter === 'ALL COURSES') return true
        const courseCat = (item.category?.name || item.category || '').toUpperCase()
        const courseTitle = (item.title || '').toUpperCase()
        const courseTags = Array.isArray(item.tags) ? item.tags.join(' ').toUpperCase() : ''
        const combined = `${courseCat} ${courseTitle} ${courseTags}`
        const filterCat = activeFilter.toUpperCase()

        if (filterCat === 'DATA ANALYTICS') {
          return combined.includes('ANALYTICS') || combined.includes('DATA') || combined.includes('ANALYST')
        }
        if (filterCat === 'DATA SCIENCE & AI') {
          return combined.includes('SCIENCE') || combined.includes('AI') || combined.includes('ML') || combined.includes('MACHINE LEARNING')
        }
        if (filterCat === 'POWER BI & TABLEAU') {
          return combined.includes('POWER BI') || combined.includes('TABLEAU') || combined.includes('BI') || combined.includes('VISUALIZATION')
        }
        if (filterCat === 'SQL & PYTHON') {
          return combined.includes('SQL') || combined.includes('PYTHON') || combined.includes('DATABASE') || combined.includes('PROGRAMMING')
        }
        if (filterCat === 'BUSINESS ANALYSIS') {
          return combined.includes('BUSINESS') || combined.includes('ANALYSIS') || combined.includes('STRATEGY')
        }

        return courseCat === filterCat || courseCat.includes(filterCat) || filterCat.includes(courseCat) || combined.includes(filterCat)
      })()

      // 2. Difficulty Filter
      const matchesDifficulty = (() => {
        if (selectedDifficulty === 'All') return true
        const filterDiff = selectedDifficulty.toLowerCase()
        
        if (item.level && Array.isArray(item.level) && item.level.length > 0) {
          return item.level.some(l => l.toLowerCase() === filterDiff)
        }
        
        const courseDiff = (item.difficulty || '').toLowerCase()
        if (filterDiff === 'intermediate' && courseDiff === 'medium') return true
        return courseDiff === filterDiff
      })()

      // 3. Duration Filter
      const matchesDuration = (() => {
        if (selectedDuration === 'All hours') return true
        
        const getCourseDurationInHours = (c) => {
          if (!c.duration) return 0
          const val = parseFloat(c.duration)
          if (isNaN(val)) return 0
          if (typeof c.duration === 'string' && c.duration.toLowerCase().includes('min')) {
            return val / 60
          }
          if (val > 100) {
            return val / 60
          }
          return val
        }

        const duration = getCourseDurationInHours(item)
        if (selectedDuration === '0-2 hours') return duration >= 0 && duration <= 2
        if (selectedDuration === '2-5 hours') return duration > 2 && duration <= 5
        if (selectedDuration === '5-10 hours') return duration > 5 && duration <= 10
        if (selectedDuration === '10-20 hours') return duration > 10 && duration <= 20
        if (selectedDuration === '20+ hours') return duration > 20
        return true
      })()

      return matchesCategory && matchesDifficulty && matchesDuration
    })
  }, [displayCourses, activeFilter, selectedDifficulty, selectedDuration])

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchEvents({ status: 'active' })).finally(() => setHasFetchedEvents(true))
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      gsap.from('.courses-hero > *', {
        y: 40, opacity: 0, filter: 'blur(10px)', stagger: 0.1, duration: 1.2, ease: 'expo.out'
      })

      // 2. Filter Row Entrance
      gsap.fromTo('.course-filter-reveal',
        { y: 20, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', stagger: 0.05, delay: 0.15 }
      )

      // 3. Grid Entrance (ScrollTrigger)
      gsap.from('.course-grid > *', {
        scrollTrigger: { trigger: '.course-grid', start: 'top 85%' },
        y: 40, opacity: 0, filter: 'blur(10px)', stagger: 0.1, duration: 1.2, ease: 'power3.out'
      })

      // 4. Events Entrance (ScrollTrigger)
      gsap.from('.events-section > *', {
        scrollTrigger: { trigger: '.events-section', start: 'top 85%' },
        y: 40, opacity: 0, filter: 'blur(10px)', stagger: 0.2, duration: 1.2, ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const getImageUrl = (thumb) => {
    if (!thumb) return '/herocard.png'
    if (/^https?:\/\//i.test(thumb)) return thumb
    const baseUrl = 'https://api.edrilla.com'
    return thumb.startsWith('/') ? `${baseUrl}${thumb}` : `${baseUrl}/${thumb}`
  }

  const categoryOptions = [
    'ALL COURSES',
    'DATA ANALYTICS',
    'DATA SCIENCE & AI',
    'POWER BI & TABLEAU',
    'SQL & PYTHON',
    'BUSINESS ANALYSIS'
  ]

  const hasActiveEvents = eventList && eventList.length > 0

  return (
    <div ref={containerRef} className="min-h-screen bg-dark pb-24">

      {/* 1. Dynamic Hero Banner */}
      {hasActiveEvents && <EventHero events={eventList} />}

      {/* 2. Page Content Wrapper */}
      <div className={`px-4 md:px-12 ${hasActiveEvents ? 'pt-12' : 'pt-36 sm:pt-40 md:pt-48'}`}>
        <div className="courses-hero max-w-7xl mx-auto mb-10">
          <div className="flex flex-col gap-2.5">
            <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {t('ourCourses') || 'Our Courses'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-inter leading-relaxed">
              Master in-demand industry tools with hands-on projects, real datasets, and step-by-step guidance.
            </p>
          </div>
        </div>

        {/* 2. Filter Row Header */}
        <div className="max-w-7xl mx-auto mb-12">
          {/* Desktop Header Grid */}
          <div className="hidden md:grid grid-cols-12 items-center gap-8 w-full pb-8 border-b border-slate-200">
            {/* Section 1: Filters (Cols 1-8) */}
            <div className="col-span-8 flex flex-wrap items-center gap-2.5">
              {categoryOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`course-filter-reveal opacity-0 px-5 py-2.5 rounded-full font-inter text-xs font-bold tracking-wider transition-all duration-300 uppercase shadow-sm ${activeFilter === filter
                    ? 'bg-[#3498db] text-white border border-[#3498db] shadow-md shadow-[#3498db]/25'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3498db]/50 hover:text-[#3498db]'
                    }`}
                >
                  <RollingText text={filter} />
                </button>
              ))}
            </div>

            {/* Section 2: Info & More (Cols 9-12) */}
            <div className="col-span-4 flex flex-col items-end gap-4 course-filter-reveal opacity-0">
               <span className="font-inter text-xs text-slate-500 uppercase tracking-wider font-bold">
                 {filteredCourses.length} COURSE{filteredCourses.length === 1 ? '' : 'S'} AVAILABLE
               </span>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2.5 font-inter text-xs font-bold tracking-wider transition-colors group/filters ${showAdvanced ? 'text-[#3498db]' : 'text-slate-600 hover:text-[#3498db]'}`}
              >
                <svg width="18" height="12" viewBox="0 0 24 16" fill="none" className={`transition-transform duration-500 ${showAdvanced ? 'rotate-180 scale-110' : 'group-hover/filters:scale-110'}`}>
                  <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <RollingText text={showAdvanced ? "HIDE FILTERS" : "MORE FILTERS"} />
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters Drawer */}
          <div
            ref={advancedRef}
            className={`overflow-hidden transition-all duration-700 ease-memo ${showAdvanced ? 'max-h-[600px] opacity-100 mt-8 mb-8' : 'max-h-0 opacity-0'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 border-t border-slate-200 bg-white/60 rounded-2xl p-6 border">
              {/* 1. Difficulty Section */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#3498db]">
                    <path d="M13 18L13 6M13 6L11 9M13 6L15 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 18L5 12M5 12L3 15M5 12L7 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 18L21 2M21 2L19 5M21 2L23 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="font-inter text-base font-bold text-slate-900">Difficulty</h3>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-5 py-2 rounded-full font-inter text-xs font-bold tracking-wider border transition-all duration-300 uppercase ${selectedDifficulty === level
                        ? 'bg-[#3498db] text-white border-[#3498db] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#3498db]/40 hover:text-[#3498db]'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Duration Section */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#3498db]">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="font-inter text-base font-bold text-slate-900">Duration</h3>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {['All hours', '0-2 hours', '2-5 hours', '5-10 hours', '10-20 hours', '20+ hours'].map((range) => (
                    <div
                      key={range}
                      onClick={() => setSelectedDuration(range)}
                      className="flex items-center gap-3 cursor-pointer group/dur"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selectedDuration === range ? 'border-[#3498db] bg-[#3498db]/10' : 'border-slate-300 group-hover/dur:border-[#3498db]'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-[#3498db] transition-transform duration-300 ${selectedDuration === range ? 'scale-100' : 'scale-0'
                          }`} />
                      </div>
                      <span className={`font-inter text-xs tracking-wider transition-colors ${selectedDuration === range ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover/dur:text-slate-900'
                        }`}>
                        {range}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-inter text-xs text-slate-500 uppercase tracking-wider font-bold">
                {filteredCourses.length} COURSE{filteredCourses.length === 1 ? '' : 'S'} AVAILABLE
              </span>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 font-inter text-xs font-bold tracking-wider transition-colors ${showAdvanced ? 'text-[#3498db]' : 'text-slate-600 hover:text-[#3498db]'}`}
              >
                <svg width="14" height="10" viewBox="0 0 24 16" fill="none" className={`transition-transform duration-500 ${showAdvanced ? 'rotate-180 scale-110' : ''}`}>
                  <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                {showAdvanced ? "CLOSE" : "FILTERS"}
              </button>
            </div>

            <div className="relative group">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-slate-200 rounded-full font-inter text-xs font-bold tracking-wider shadow-sm text-slate-900"
              >
                <span>CATEGORY: {activeFilter}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className={isFilterOpen ? 'rotate-180' : ''} stroke="currentColor">
                  <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isFilterOpen && (
                <div className="absolute top-full left-0 w-full z-50 bg-white border border-slate-200 rounded-2xl shadow-xl mt-2 overflow-hidden">
                  {categoryOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => { setActiveFilter(filter); setIsFilterOpen(false); }}
                      className={`w-full px-6 py-3.5 text-left font-inter text-xs font-bold border-b border-slate-100 last:border-0 transition-colors ${activeFilter === filter ? 'text-[#3498db] bg-[#3498db]/5' : 'text-slate-700 hover:text-[#3498db] hover:bg-slate-50'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Asymmetrical Masonry Grid */}
        <div className="course-grid max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mb-12">
          {loading && !displayCourses.length ? (
            <div className="col-span-full text-center py-20 text-[#3498db] font-inter font-bold">LOADING COURSES...</div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((item) => (
              <CourseCard
                key={item._id || item.id}
                item={{
                  id: item._id || item.id,
                  title: item.title,
                  category: item.category?.name || item.category || 'COURSE',
                  description: item.shortDescription || item.description,
                  price: item.salePrice ? `₹${item.salePrice}` : item.price ? (typeof item.price === 'number' ? `₹${item.price}` : item.price) : 'FREE',
                  image: getImageUrl(item.thumbnail || item.image),
                  isNew: item.isNew ?? true,
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 font-inter font-bold">{t('noCoursesAvailable') || 'No courses match your filter criteria.'}</div>
          )}
        </div>

        {/* 4. Upcoming Events Section */}
        <div className="events-section max-w-7xl mx-auto pt-20 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-inter text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Upcoming Events & Workshops</h2>
              <p className="font-inter text-xs text-slate-600 uppercase tracking-wider font-semibold">Hands-on live sessions and intensive masterclasses.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-inter font-bold text-slate-600">
              <span className="text-[#3498db] font-black">•</span> <span>Live Interactive</span>
              <span className="text-[#3498db] font-black">•</span> <span>{t('remotelyAvailable') || 'Online Available'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {eventsLoading ? (
              <div className="col-span-full text-center py-20 text-accent font-montserrat">LOADING EVENTS...</div>
            ) : eventList && eventList.length > 0 ? (
              eventList.map((event) => (
                <CourseCard
                  key={event._id || event.id}
                  item={{
                    id: event._id || event.id,
                    title: event.title,
                    category: event.category || 'EVENT',
                    description: event.description,
                    image: getImageUrl(event.thumbnail || event.image),
                    buttonText: event.buttonText || 'Register Now',
                    isNew: event.isNew
                  }}
                  variant="event"
                />
              ))
            ) : hasFetchedEvents ? (
              <div className="col-span-full text-center py-20 text-description font-montserrat uppercase tracking-widest">No upcoming events at the moment.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
