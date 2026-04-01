"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { ZorvynLogo } from "./zorvyn-logo"

export default function LandingView() {
  const { user } = useAuth()

  return (
    <div className="font-sans text-[#e5e2e1] overflow-x-hidden selection:bg-[#86efac]/30 selection:text-[#86efac] bg-[#0a0a0a]">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center w-full px-6 md:px-12 py-6 max-w-[1440px] mx-auto fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <ZorvynLogo className="h-8 w-8 text-[#86efac]" />
          <span className="text-lg font-medium tracking-wide text-[#e5e2e1]">ZORVYN</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <a className="uppercase tracking-[0.2em] text-[0.7rem] text-[#86efac] hover:text-[#86efac] transition-all duration-500" href="#project">Project</a>
          <a className="uppercase tracking-[0.2em] text-[0.7rem] text-[#e5e2e1]/60 hover:text-[#86efac] transition-all duration-500" href="#technical">Technical</a>
          <a className="uppercase tracking-[0.2em] text-[0.7rem] text-[#e5e2e1]/60 hover:text-[#86efac] transition-all duration-500" href="https://zorvyn-backend.hitanshu.xyz/api-docs" target="_blank">API Docs</a>
          <a className="uppercase tracking-[0.2em] text-[0.7rem] text-[#e5e2e1]/60 hover:text-[#86efac] transition-all duration-500" href="#developer">Developer</a>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href={user ? "/dashboard" : "/login"}
            className="px-5 py-2 text-[0.7rem] uppercase tracking-[0.15em] text-[#86efac] border border-[#86efac]/30 hover:bg-[#86efac]/10 transition-all duration-500"
          >
            {user ? "Console" : "Log In"}
          </Link>
        </div>
      </nav>

      <main className="relative pt-32">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#86efac]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#86efac]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
          
          <div className="relative z-10 max-w-5xl">
            <div className="flex flex-col items-center gap-6 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#86efac]/5 border border-[#86efac]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] animate-pulse" />
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#86efac]">Backend Internship Assessment Project</p>
              </div>
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-sm border-2 border-[#86efac] bg-[#86efac]/10 shadow-[0_0_30px_rgba(134,239,172,0.2)]">
                <p className="text-[0.85rem] md:text-[1rem] font-black uppercase tracking-[0.5em] text-[#86efac]">PROUDLY DEPLOYED ON HOLONET</p>
              </div>
            </div>
            
            <h1 className="text-[3.5rem] md:text-[6rem] leading-[0.95] font-bold tracking-[-0.04em] bg-gradient-to-b from-white via-[#e5e2e1] to-[#666] bg-clip-text text-transparent mb-10">
              INTELLIGENT FINANCE<br/>ARCHITECTURE
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-[#919191] font-light leading-relaxed mb-16 px-4">
              A robust financial data management system built with <span className="text-[#e5e2e1]">Bun, Express, and PostgreSQL</span>. Designed to demonstrate architectural clarity, secure access control, and high-performance data processing.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                href={user ? "/dashboard" : "/login"} 
                className="group relative px-14 py-6 bg-[#86efac]/10 border border-[#86efac] hover:bg-[#86efac]/20 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 text-[0.85rem] uppercase tracking-[0.25em] text-[#86efac] font-bold">
                  {user ? "Enter Console" : "Launch System"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#86efac]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
              
              <a 
                href="https://zorvyn-backend.hitanshu.xyz/api-docs" 
                target="_blank"
                className="flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.2em] text-[#919191] hover:text-[#86efac] transition-colors duration-500 group"
              >
                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Explore API Docs
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#86efac] to-transparent" />
          </div>
        </section>

        {/* Project Requirements Section */}
        <section id="project" className="max-w-[1440px] mx-auto px-6 md:px-12 py-32 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            <div className="lg:col-span-4">
              <h2 className="text-[0.7rem] uppercase tracking-[0.3em] text-[#86efac] mb-6">The Challenge</h2>
              <h3 className="text-4xl font-light tracking-tight text-[#e5e2e1] mb-8 leading-tight">Engineering for Financial Scale</h3>
              <p className="text-[#919191] text-sm leading-relaxed font-light mb-10">
                This project handles complex transactional logic and multi-tier access control, ensuring data integrity while serving high-performance analytics to the frontend.
              </p>
              <div className="space-y-4">
                {[
                  "User & Role Management",
                  "Financial Records CRUD",
                  "Dashboard Summary APIs",
                  "Access Control Logic",
                  "Validation & Error Handling",
                  "Data Persistence"
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-5 h-[1px] bg-[#86efac]/30 group-hover:w-8 transition-all" />
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#e5e2e1]/70 group-hover:text-[#86efac] transition-colors">{task}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-[#111111] border border-white/5 hover:border-[#86efac]/30 transition-all group">
                <div className="text-[#86efac] mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-xl mb-4 text-[#e5e2e1]">RBAC Enforcement</h4>
                <p className="text-[#919191] text-sm font-light leading-relaxed">
                  Granular permission system protecting endpoints for Viewers, Analysts, and Admins via specialized middleware.
                </p>
              </div>

              <div className="p-8 bg-[#111111] border border-white/5 hover:border-[#86efac]/30 transition-all group">
                <div className="text-[#86efac] mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 02 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl mb-4 text-[#e5e2e1]">Aggregated Analytics</h4>
                <p className="text-[#919191] text-sm font-light leading-relaxed">
                  High-performance queries for Net Balance, Category-wise Totals, and Monthly Trends powered by PostgreSQL.
                </p>
              </div>

              <div className="p-8 bg-[#111111] border border-white/5 hover:border-[#86efac]/30 transition-all group">
                <div className="text-[#86efac] mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h4 className="text-xl mb-4 text-[#e5e2e1]">Type-Safe Backend</h4>
                <p className="text-[#919191] text-sm font-light leading-relaxed">
                  Built with Bun and TypeScript, featuring schema validation (Zod) and standardized error responses.
                </p>
              </div>

              <div className="p-8 bg-[#111111] border border-white/5 hover:border-[#86efac]/30 transition-all group">
                <div className="text-[#86efac] mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                  </svg>
                </div>
                <h4 className="text-xl mb-4 text-[#e5e2e1]">Scalable Persistence</h4>
                <p className="text-[#919191] text-sm font-light leading-relaxed">
                  Relational data modeling with PostgreSQL, ensuring ACID compliance for all financial transactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Portfolio Section */}
        <section id="developer" className="relative py-32 bg-[#080808] overflow-hidden border-t border-white/5">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#86efac]/5 to-transparent pointer-events-none" />
          
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-start gap-16">
              <div className="md:w-1/3">
                <h2 className="text-[0.7rem] uppercase tracking-[0.3em] text-[#86efac] mb-6">The Engineer</h2>
                <h3 className="text-5xl font-bold tracking-tighter text-[#e5e2e1] mb-6">Hitanshu Gala</h3>
                <p className="text-[#919191] text-lg font-light leading-relaxed mb-6">
                  B.Tech IT Student at SVKM&apos;s Dwarkadas J Sanghvi College of Engineering. I build tools that bridge the gap between complex infrastructure and elegant user experiences.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <a href="https://github.com/indra55" target="_blank" className="text-[#919191] hover:text-[#86efac] transition-colors"><span className="text-[0.6rem] uppercase tracking-widest">GitHub</span></a>
                  <a href="https://www.linkedin.com/in/hitanshugala/" target="_blank" className="text-[#919191] hover:text-[#86efac] transition-colors"><span className="text-[0.6rem] uppercase tracking-widest">LinkedIn</span></a>
                  <a href="https://hitanshu.xyz/" target="_blank" className="text-[#919191] hover:text-[#86efac] transition-colors"><span className="text-[0.6rem] uppercase tracking-widest">Portfolio</span></a>
                  <a href="https://codeforces.com/profile/theHnter101" target="_blank" className="text-[#919191] hover:text-[#86efac] transition-colors"><span className="text-[0.6rem] uppercase tracking-widest">Codeforces</span></a>
                </div>
              </div>
              
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[0.65rem] uppercase tracking-[0.3em] text-[#e5e2e1] mb-6 opacity-50">Technical Arsenal</h4>
                  <div className="flex flex-wrap gap-2">
                    {["C++", "Python", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "AWS", "Redis", "NGINX"].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 text-[0.6rem] uppercase tracking-widest text-[#e5e2e1]/80 rounded-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-[#86efac]/5 border border-[#86efac]/20 rounded-sm">
                    <p className="text-[0.6rem] uppercase tracking-widest text-[#86efac] mb-2">Meta Achievement</p>
                    <p className="text-xs text-[#919191] font-light leading-relaxed">
                      Zorvyn is proudly deployed using <span className="text-[#e5e2e1]">Holonet</span>, my self-hosted PaaS platform built on AWS EC2.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[0.65rem] uppercase tracking-[0.3em] text-[#e5e2e1] mb-6 opacity-50">Core Projects</h4>
                  <ul className="space-y-6">
                    <li className="group">
                      <a href="https://holonet.hitanshu.xyz" target="_blank">
                        <p className="text-sm text-[#e5e2e1] group-hover:text-[#86efac] transition-colors">Holonet - PaaS Platform</p>
                        <p className="text-[0.6rem] uppercase tracking-widest text-[#919191] mt-1 italic">Event-driven CI/CD with Redis & Nginx</p>
                      </a>
                    </li>
                    <li className="group">
                      <a href="https://hertz.hitanshu.xyz" target="_blank">
                        <p className="text-sm text-[#e5e2e1] group-hover:text-[#86efac] transition-colors">Hertz. - WebRTC Video</p>
                        <p className="text-[0.6rem] uppercase tracking-widest text-[#919191] mt-1 italic">P2P conferencing with Socket.IO signaling</p>
                      </a>
                    </li>
                    <li className="group">
                      <a href="https://chromewebstore.google.com/detail/elden-leetcode/fhnekaknnbjknfhmohamnobdkegnapec" target="_blank">
                        <p className="text-sm text-[#e5e2e1] group-hover:text-[#86efac] transition-colors">Elden Ring LeetCode Extension</p>
                        <p className="text-[0.6rem] uppercase tracking-widest text-[#919191] mt-1 italic">500+ users & 65+ GitHub stars</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical section */}
        <section id="technical" className="py-32 md:py-48 text-center bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-[0.75rem] uppercase tracking-[0.4em] text-[#86efac] mb-12">Technical Integrity</h2>
            <h3 className="text-[2.5rem] md:text-[4.5rem] font-bold tracking-tighter mb-12 text-[#e5e2e1]">DOCUMENTED &<br/>DEPLOYED</h3>
            
            <p className="text-[#919191] text-lg font-light leading-relaxed mb-16">
              The full API specification is available via Swagger, detailing every endpoint, security scheme, and data model used in this assessment.
            </p>
            
            <div className="flex flex-col items-center gap-12">
              <a 
                href="https://zorvyn-backend.hitanshu.xyz/api-docs" 
                target="_blank"
                className="relative px-12 md:px-16 py-6 bg-[#86efac] group overflow-hidden"
              >
                <span className="relative z-10 text-[0.8rem] uppercase tracking-[0.3em] text-black font-bold">
                  View API Documentation
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </a>
              <div className="flex items-center gap-4 text-[#919191]/40 text-[0.6rem] uppercase tracking-[0.25em]">
                <span>Status: Online</span>
                <span className="w-1 h-1 rounded-full bg-[#86efac]" />
                <span>Instance: AWS EC2</span>
                <span className="w-1 h-1 rounded-full bg-[#86efac]" />
                <span>Managed by: Holonet PaaS</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <ZorvynLogo className="h-5 w-5 text-[#86efac]" />
          <span className="text-sm font-bold tracking-[0.2em] text-[#86efac] uppercase">ZORVYN</span>
        </div>
        
        <p className="text-[#919191] text-[0.6rem] uppercase tracking-[0.2em]">
          &copy; 2026 Hitanshu Gala &bull; Designed & Developed by Hitanshu
        </p>
        
        <div className="flex gap-8">
          <a href="#project" className="text-[0.6rem] uppercase tracking-[0.2em] text-[#919191] hover:text-[#86efac] transition-colors">Project</a>
          <a href="#technical" className="text-[0.6rem] uppercase tracking-[0.2em] text-[#919191] hover:text-[#86efac] transition-colors">API Docs</a>
          <a href="#developer" className="text-[0.6rem] uppercase tracking-[0.2em] text-[#919191] hover:text-[#86efac] transition-colors">Developer</a>
        </div>
      </footer>
    </div>
  )
}
