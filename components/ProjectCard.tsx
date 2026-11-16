"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Project } from "@/data/projects";

type ExtendedProject = Project & {
  images?: string[];
  linkLabel?: string;
};

export default function ProjectCard({ project }: { project: ExtendedProject }) {
  const imageList =
    project.images && project.images.length > 0
      ? project.images
      : [
          project.image ||
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  // Category-specific color themes
  const getTheme = (category: string) => {
    switch (category) {
      case "Web Tools":
        return {
          topBar: "from-emerald-400 via-teal-400 to-cyan-500",
          badge: "bg-emerald-950/85 text-emerald-300 border-emerald-700/50",
          cardHover: "hover:border-emerald-500/60 hover:shadow-[0_12px_35px_-10px_rgba(16,185,129,0.28)]",
          titleHover: "group-hover:text-emerald-300",
          button: "from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]",
          dotActive: "bg-emerald-400",
          arrowHover: "hover:bg-emerald-500",
        };
      case "Social Media":
        return {
          topBar: "from-purple-400 via-fuchsia-500 to-pink-500",
          badge: "bg-purple-950/85 text-purple-300 border-purple-700/50",
          cardHover: "hover:border-purple-500/60 hover:shadow-[0_12px_35px_-10px_rgba(168,85,247,0.28)]",
          titleHover: "group-hover:text-purple-300",
          button: "from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]",
          dotActive: "bg-purple-400",
          arrowHover: "hover:bg-purple-500",
        };
      default:
        return {
          topBar: "from-cyan-400 via-blue-500 to-indigo-500",
          badge: "bg-cyan-950/85 text-cyan-300 border-cyan-700/50",
          cardHover: "hover:border-cyan-500/60 hover:shadow-[0_12px_35px_-10px_rgba(6,182,212,0.28)]",
          titleHover: "group-hover:text-cyan-300",
          button: "from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]",
          dotActive: "bg-cyan-400",
          arrowHover: "hover:bg-cyan-500",
        };
    }
  };

  const theme = getTheme(project.category);

  return (
    <div
      className={`group relative flex flex-col bg-slate-900/85 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800/90 ${theme.cardHover} transition-all duration-500 hover:-translate-y-2 shadow-lg`}
    >
      {/* Top Category Gradient Line */}
      <div className={`h-1 w-full bg-gradient-to-r ${theme.topBar} opacity-80 group-hover:opacity-100 transition-opacity`} />

      {/* Image Slider Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={imageList[currentIndex]}
          alt={`${project.title} - ${currentIndex + 1}`}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent pointer-events-none" />

        {/* Category Badge */}
        {project.category && (
          <span
            className={`absolute top-3 left-3 z-20 text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${theme.badge}`}
          >
            {project.category}
          </span>
        )}

        {/* Slider Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous image"
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-slate-950/75 ${theme.arrowHover} text-white hover:text-slate-950 border border-slate-700/80 transition-all shadow-md`}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next image"
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-slate-950/75 ${theme.arrowHover} text-white hover:text-slate-950 border border-slate-700/80 transition-all shadow-md`}
            >
              <ChevronRight size={16} />
            </button>

            {/* Slide Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-950/60 backdrop-blur-sm">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx
                      ? `w-4 ${theme.dotActive}`
                      : "w-1.5 bg-slate-400/60 hover:bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-5 z-20">
        <h3 className={`text-lg font-bold text-white ${theme.titleHover} transition-colors duration-300 leading-snug`}>
          {project.title}
        </h3>
        <p className="mt-2.5 text-sm text-slate-300 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto pt-5 flex items-center gap-2.5 z-30">
          {project.liveUrl && project.liveUrl !== "#" && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r ${theme.button} rounded-lg transition-all duration-300`}
            >
              <span>{project.linkLabel || "View Project"}</span>
              <ExternalLink size={14} />
            </a>
          )}
          {project.githubUrl && project.githubUrl !== "#" && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all duration-300"
              title="Source Code"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-7a5.2 5.2 0 0 0-1.5-3.8 4.3 4.3 0 0 0 0-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a4.3 4.3 0 0 0 0 3.8 5.2 5.2 0 0 0-1.5 3.8c0 5.4 3 6.7 6 7a4.8 4.8 0 0 0-1 3.2v4"></path>
                <path d="M9 18c-4.5 1-5-2.5-5-2.5"></path>
              </svg>
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}