"use client";

import { useEffect, useState } from "react";
import HeroProfile from "@/components/HeroProfile";
import ProjectCard from "@/components/ProjectCard";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Project } from "@/data/projects";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, "projects");
        const querySnapshot = await getDocs(projectsRef);

        const fetchedProjects: Project[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
        });

        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = [
    { id: "All", label: "All Projects", activeStyle: "bg-slate-100 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.2)]" },
    { id: "Featured Projects", label: "🚀 Featured", activeStyle: "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)]" },
    { id: "Web Tools", label: "🔧 Web Tools", activeStyle: "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]" },
    { id: "Social Media", label: "📱 Social Media", activeStyle: "bg-gradient-to-r from-purple-400 to-pink-500 text-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.35)]" },
  ];

  const featuredProjects = projects.filter((p) => p.category === "Featured Projects");
  const webTools = projects.filter((p) => p.category === "Web Tools");
  const socialMedia = projects.filter((p) => p.category === "Social Media");

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* Mind-Relaxing Soft Dot Pattern + Ambient Aurora Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-24 w-[26rem] h-[26rem] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[24rem] h-[24rem] bg-emerald-500/10 rounded-full blur-[130px]" />
      </div>

      {/* Glassmorphism Top Navbar (Public View Only) */}
      <nav className="sticky top-0 z-40 w-full bg-slate-950/75 backdrop-blur-lg border-b border-slate-800/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              IA
            </div>
            <span className="font-bold text-slate-100 tracking-wide text-sm sm:text-base group-hover:text-cyan-400 transition-colors">
              Isuru<span className="text-cyan-400">.portfolio</span>
            </span>
          </a>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="#projects-section"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Projects
            </a>
            <a
              href="mailto:isuruakalanka96@gmail.com"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950 transition-all"
            >
              <Sparkles size={13} />
              Hire / Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-grow pb-20">
        <HeroProfile />

        <div id="projects-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          
          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? cat.activeStyle
                      : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">
              Loading projects...
            </div>
          ) : selectedCategory === "All" ? (
            <div className="space-y-16">
              {featuredProjects.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      🚀 Featured Projects
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                    {featuredProjects.map((p) => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                  </div>
                </section>
              )}

              {webTools.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      🔧 Web Tools
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                    {webTools.map((p) => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                  </div>
                </section>
              )}

              {socialMedia.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      📱 Social Media
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/40 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                    {socialMedia.map((p) => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {projects
                .filter((p) => p.category === selectedCategory)
                .map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Clean Glassmorphism Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
          <p>
            © 2026 <span className="text-slate-200 font-semibold">Isuru Akalanka Perera</span>. All rights reserved.
          </p>
          <p className="text-slate-500">
            IT Support • AI Automation • Digital Solutions
          </p>
        </div>
      </footer>
    </main>
  );
}