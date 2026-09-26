import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const footerRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        y: 24,
        opacity: 0,
        filter: 'blur(6px)',
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out'
      })
    }, footerRef)

    requestAnimationFrame(() => {
      try { ScrollTrigger.refresh() } catch (e) { }
    })

    return () => ctx.revert()
  }, [])

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: 'M20.52 3.48A11.85 11.85 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.26-1.64a11.9 11.9 0 0 0 5.79 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.41zm-8.47 18.36h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.62-.23-.37a9.89 9.89 0 0 1-1.52-5.28c0-5.46 4.45-9.91 9.92-9.91 2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.89-9.94 9.89zm5.44-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z',
      url: 'https://wa.me/917483741501'
    },
    {
      name: 'Facebook',
      icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
      url: 'https://facebook.com'
    },
    {
      name: 'X',
      icon: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154H7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298L17.61 20.644z',
      url: 'https://x.com'
    },
    {
      name: 'Instagram',
      icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01',
      url: 'https://instagram.com',
      isInsta: true
    },
    {
      name: 'YouTube',
      icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M10 15V9l6 3z',
      url: 'https://youtube.com'
    }
  ]

  const exploreLinks = [
    { name: t('home') || 'Home', path: '/' },
    { name: t('ourCourses') || 'Courses', path: '/courses' },
    { name: 'Live Classes Portal', path: 'https://classes.dataknowledge.in/', isExternal: true },
    { name: 'Counseling & Mentorship', path: '/contact' },
    { name: t('forum') || 'Forum', path: '/forum' },
    { name: t('gig') || 'Gigs', path: '/gig' },
  ]

  const trainingDomains = [
    { name: 'SQL & Database Mastery', path: '/courses' },
    { name: 'Power BI & Tableau Visuals', path: '/courses' },
    { name: 'Python for Data Science', path: '/courses' },
    { name: 'Business Analysis Frameworks', path: '/courses' },
    { name: 'Machine Learning & AI', path: '/courses' },
    { name: 'Mock Interviews & Resume Prep', path: '/contact' },
  ]

  const supportLinks = [
    { name: t('about Us') || 'About Us', path: '/about-us' },
    { name: t('contact') || 'Contact Us', path: '/contact' },
    { name: 'Terms of Service', path: '/terms-conditions' },
    { name: t('privacyPolicy') || 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Refund Policy', path: '/refund-policy' },
  ]

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#050814] text-white pt-16 md:pt-20 pb-10 px-6 md:px-12 lg:px-20 overflow-hidden flex flex-col justify-between border-t border-slate-800/80"
    >
      {/* Top Subtle Blue Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3498db] to-transparent opacity-80" />

      {/* Main Footer Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10 pb-14">

        {/* Column 1: Brand & Socials (4 cols) */}
        <div className="footer-reveal lg:col-span-4 flex flex-col items-start text-left">
          <Link to="/" className="flex items-center gap-3.5 group mb-4">
            <img
              src="/data_knowlege/logo/logo.png"
              alt="Data Knowledge Logo"
              className="h-11 md:h-12 w-auto object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 bg-white/5 p-1 border border-white/10"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-inter">Data Knowledge</span>
              <span className="text-[10px] font-bold text-[#3498db] tracking-[0.18em] uppercase">Practical & Industry-Focused</span>
            </div>
          </Link>

          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6 font-normal">
            Practical and industry-focused training in SQL, Excel, Power BI, Tableau, Python, Data Science, ML & AI to help you build real-world job skills.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#3498db]/60 hover:bg-[#3498db]/15 hover:shadow-[0_0_12px_rgba(52,152,219,0.3)] transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label={social.name}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={social.name === 'WhatsApp' ? 'currentColor' : 'none'}
                  stroke={social.name === 'WhatsApp' ? 'none' : 'currentColor'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {social.isInsta ? (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </>
                  ) : social.name === 'WhatsApp' ? (
                    <path d={social.icon} />
                  ) : (
                    <path d={social.icon} fill={social.name === 'X' ? 'currentColor' : 'none'} stroke={social.name === 'X' ? 'none' : 'currentColor'} />
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links (2 cols) */}
        <div className="footer-reveal lg:col-span-2 flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-200 mb-4 font-jetbrains">
            EXPLORE
          </h3>
          <ul className="space-y-2.5">
            {exploreLinks.map((link, idx) => (
              <li key={idx}>
                {link.isExternal ? (
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <span>{link.name}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Programs (3 cols) */}
        <div className="footer-reveal lg:col-span-3 flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-200 mb-4 font-jetbrains">
            PROGRAMS & TOOLS
          </h3>
          <ul className="space-y-2.5">
            {trainingDomains.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Us (3 cols) */}
        <div className="footer-reveal lg:col-span-3 flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-200 mb-4 font-jetbrains">
            CONTACT US
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <div className="flex items-start gap-2.5 text-slate-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#3498db] flex-shrink-0 mt-0.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Pune, Maharashtra, India</span>
              </div>
            </li>
            <li>
              <a
                href="tel:+917483741501"
                className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400 flex-shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+91 74837 41501</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+918237700626"
                className="flex items-center gap-2.5 hover:text-blue-400 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400 flex-shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+91 82377 00626</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:dataknowledge.class@gmail.com"
                className="flex items-center gap-2.5 hover:text-amber-400 transition-colors truncate max-w-full"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400 flex-shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="truncate">dataknowledge.class@gmail.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://classes.dataknowledge.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400 flex-shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>classes.dataknowledge.in</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Legal Links Bar */}
      <div className="footer-reveal max-w-7xl mx-auto w-full pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-400">

        {/* Copyright & Slogan */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <p className="font-jetbrains font-medium text-slate-400">
            © 2026 Data Knowledge. All rights reserved.
          </p>
          <span className="hidden md:inline text-slate-600">•</span>
          <p className="font-jetbrains text-slate-500">
            Practical & Industry-Focused Training
          </p>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-4 font-jetbrains text-xs">
          <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/terms-conditions" className="hover:text-blue-400 transition-colors">
            Terms of Service
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/refund-policy" className="hover:text-blue-400 transition-colors">
            Refund Policy
          </Link>
        </div>

      </div>

      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>
    </footer>
  )
}

export default Footer
