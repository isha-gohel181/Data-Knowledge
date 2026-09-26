import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

const Terms = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.terms-hero > *',
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )
      gsap.fromTo(
        '.terms-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const sections = [
    {
      num: '1',
      title: 'Agreement to terms',
      content:
        'These Terms of Service (“Terms”) govern your access to and use of the website, courses, and related services offered by Data Knowledge. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use our services.'
    },
    {
      num: '2',
      title: 'Description of services',
      content:
        'Data Knowledge provides educational and training services, including online or blended courses, materials, mentorship, and related support as described on our website or in separate agreements. We may modify, suspend, or discontinue any part of our services with reasonable notice where practicable.'
    },
    {
      num: '3',
      title: 'Eligibility and accounts',
      content:
        'You must provide accurate information when enrolling or contacting us. You are responsible for maintaining the confidentiality of any account credentials and for all activity under your account. You must notify us promptly of any unauthorized use.'
    },
    {
      num: '4',
      title: 'Fees and payment',
      content:
        'This website does not sell courses or process payments. Course fees, payment schedules, and methods—if any—are agreed directly with Data Knowledge outside this website (for example by email, phone, or in person). Taxes may apply as required by law. We do not handle refunds or cancellations through this site; any such matters are agreed outside this website.'
    },
    {
      num: '5',
      title: 'Intellectual property',
      content:
        'All content provided through our services—including videos, documents, logos, software, and course materials—is owned by Data Knowledge or its licensors and is protected by intellectual property laws. You receive a limited, non-exclusive, non-transferable license to access materials for your personal learning during enrollment. You may not copy, redistribute, resell, or publicly share course materials without written permission.'
    },
    {
      num: '6',
      title: 'User conduct',
      content:
        'You agree not to misuse our services: no harassment of staff or learners; no interference with our systems; no unauthorized access; no use of our materials for commercial exploitation outside permitted personal learning; and compliance with all applicable laws. We may remove access for violations.'
    },
    {
      num: '7',
      title: 'Disclaimer of warranties',
      content:
        'Our services are provided on an “as is” and “as available” basis to the maximum extent permitted by law. We do not warrant uninterrupted or error-free operation. Educational outcomes depend on individual effort and external factors; see our Disclaimer page for additional limitations.'
    },
    {
      num: '8',
      title: 'Limitation of liability',
      content:
        'To the fullest extent permitted by applicable law, Data Knowledge and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits or data, arising from your use of our services. Our total liability for any claim relating to our services shall not exceed the fees you paid to us for the specific course or service giving rise to the claim in the twelve (12) months preceding the claim, except where liability cannot be limited by law.'
    },
    {
      num: '9',
      title: 'Termination',
      content:
        'We may suspend or terminate your access for breach of these Terms or for other legitimate reasons with notice where appropriate. Provisions that by their nature should survive (including intellectual property, limitation of liability, and governing law) will survive termination.'
    },
    {
      num: '10',
      title: 'Governing law and disputes',
      content:
        'These Terms are governed by the laws of India. Courts at Pune, Maharashtra, India shall have exclusive jurisdiction over disputes arising from these Terms or our services, subject to any mandatory consumer protections that cannot be waived.'
    }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pt-36 sm:pt-40 md:pt-48 pb-24 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="terms-hero flex flex-col gap-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3498db]/10 text-[#3498db] font-inter text-xs font-bold tracking-wider uppercase w-fit border border-[#3498db]/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Legal Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-inter tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base font-inter font-medium text-slate-500">
            Last updated: <span className="text-slate-800 font-semibold">April 12, 2026</span>
          </p>
        </div>

        {/* Main Content Card */}
        <div className="terms-card bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm space-y-10">
          
          {sections.map((section) => (
            <div key={section.num} className="space-y-3 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#3498db]/10 text-[#3498db] font-inter font-extrabold text-sm flex items-center justify-center shrink-0 border border-[#3498db]/20">
                  {section.num}
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-inter text-slate-900">
                  {section.title}
                </h2>
              </div>
              <p className="text-slate-600 font-inter text-sm sm:text-base leading-relaxed pl-11">
                {section.content}
              </p>
            </div>
          ))}

          {/* Contact Section Box */}
          <div className="mt-12 bg-gradient-to-br from-slate-50 to-[#3498db]/5 border border-[#3498db]/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#3498db] text-white flex items-center justify-center shadow-md shadow-[#3498db]/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-inter">Contact & Inquiries</h3>
                <p className="text-xs text-slate-500 font-inter">Questions or clarifications regarding these Terms of Service</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <a
                href="mailto:dataknowledge.class@gmail.com"
                className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#3498db] transition-colors group shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-inter">Email</p>
                  <p className="text-xs font-semibold text-slate-800 truncate font-inter">dataknowledge.class@gmail.com</p>
                </div>
              </a>

              <a
                href="tel:+917483741501"
                className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#3498db] transition-colors group shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-inter">Phone</p>
                  <p className="text-xs font-semibold text-slate-800 font-inter">+91 74837 41501</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3498db] flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-inter">Address</p>
                  <p className="text-xs font-semibold text-slate-800 font-inter">Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs font-inter text-slate-500">
            <p>© 2026 Data Knowledge. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-[#3498db] transition-colors font-medium">Privacy Policy</Link>
              <span>•</span>
              <Link to="/refund-policy" className="hover:text-[#3498db] transition-colors font-medium">Refund Policy</Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Terms
