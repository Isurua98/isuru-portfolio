"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { projects } from "@/data/projects";

export default function SeedPage() {
  const [status, setStatus] = useState("Ready to upload data");

  const handleUpload = async () => {
    setStatus("Uploading data...");
    try {
      const projectsRef = collection(db, "projects");
      
      for (const project of projects) {
        await setDoc(doc(projectsRef, project.id), project);
      }
      
      setStatus("Success! All projects uploaded to Firebase.");
    } catch (error) {
      console.error(error);
      setStatus("Error uploading data. Check console.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-6">
      <h1 className="text-3xl font-bold">Firebase Data Seeder</h1>
      <button 
        onClick={handleUpload}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
      >
        Upload Dummy Data
      </button>
      <p className="text-slate-400">{status}</p>
    </div>
  );
}