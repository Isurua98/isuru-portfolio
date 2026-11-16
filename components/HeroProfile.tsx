"use client";

import { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HeroProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "portfolio", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 pb-10 text-center flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading Profile...</p>
      </div>
    );
  }

  // If no data is found in the database yet
  if (!profile) return null;

  return (
    <section className="pt-16 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      
      {/* Profile Picture Section */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-slate-800 shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:border-cyan-500/50 transition-all duration-500 hover:scale-105">
          <img 
            src={profile.imageUrl} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Glowing Gradient Name */}
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          {profile.name}
        </span>
      </h1>
      
      {/* Description Panel */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl hover:border-slate-700 transition-colors duration-300">
        <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {profile.description}
        </p>
      </div>
      
      {/* Contact Details Tags */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default">
          <Phone size={16} className="text-cyan-500" />
          <span>{profile.phone}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default">
          <Mail size={16} className="text-cyan-500" />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default">
          <MapPin size={16} className="text-cyan-500" />
          <span>{profile.location}</span>
        </div>
      </div>
      
      {/* Social Links */}
      <div className="flex justify-center gap-4">
        {profile.linkedin && profile.linkedin !== "#" && (
          <a 
            href={profile.linkedin} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span className="font-semibold text-sm tracking-wide">LINKEDIN</span>
          </a>
        )}
        
        {profile.github && profile.github !== "#" && (
          <a 
            href={profile.github} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300 hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-7a5.2 5.2 0 0 0-1.5-3.8 4.3 4.3 0 0 0 0-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a4.3 4.3 0 0 0 0 3.8 5.2 5.2 0 0 0-1.5 3.8c0 5.4 3 6.7 6 7a4.8 4.8 0 0 0-1 3.2v4"></path>
              <path d="M9 18c-4.5 1-5-2.5-5-2.5"></path>
            </svg>
            <span className="font-semibold text-sm tracking-wide">GITHUB</span>
          </a>
        )}
      </div>
    </section>
  );
}