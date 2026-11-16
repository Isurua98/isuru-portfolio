"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogOut, LayoutDashboard, User, FolderKanban } from "lucide-react";
import ProfileSettings from "@/components/ProfileSettings";
import ManageProjects from "@/components/ManageProjects";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 font-medium flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 text-cyan-400">
          <LayoutDashboard size={24} />
          <h2 className="text-xl font-bold text-slate-100">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === "projects" ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            <FolderKanban size={18} />
            Manage Projects
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === "profile" ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            <User size={18} />
            Profile Settings
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors w-full border border-transparent hover:border-red-900/50"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            {activeTab === "projects" ? "Manage Projects" : "Profile Settings"}
          </h1>
          <p className="text-slate-400 mt-2">
            {activeTab === "projects" 
              ? "Add new projects, or edit and delete existing ones from your portfolio." 
              : "Update your personal details, social links, and profile picture."}
          </p>
        </header>

        {/* Dynamic Content Container */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-start justify-center min-h-[400px]">
          {activeTab === "projects" ? <ManageProjects /> : <ProfileSettings />}
        </div>
      </main>

    </div>
  );
}