"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Upload } from "lucide-react";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    location: "",
    linkedin: "",
    github: "",
    imageUrl: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "portfolio", "profile");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          setFormData(data);
          setPreviewUrl(data.imageUrl || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Compress and convert image to Base64 string so it saves directly in Firestore for free
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 350;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        setPreviewUrl(compressedBase64);
        setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await setDoc(doc(db, "portfolio", "profile"), formData);
      setMessage("Profile and image updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (loading) return <div className="text-slate-400">Loading profile data...</div>;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6 text-left">
      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.includes("successfully") ? "bg-green-950/50 text-green-400 border border-green-900" : "bg-red-950/50 text-red-400 border border-red-900"}`}>
          {message}
        </div>
      )}

      {/* Profile Image Upload & Preview Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-950/60 border border-slate-800 rounded-xl">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/50 shrink-0">
          <img 
            src={previewUrl || "https://ui-avatars.com/api/?name=Isuru+Akalanka&background=0f172a&color=22d3ee&size=256"} 
            alt="Profile Preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <label className="block text-sm font-medium text-slate-200 mb-2">Profile Picture</label>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-medium rounded-lg cursor-pointer border border-slate-700 transition-colors">
            <Upload size={16} />
            <span>Choose Image from PC</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </label>
          <p className="text-xs text-slate-500 mt-2">Select any JPG or PNG photo from your computer</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
        </div>
        
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Professional Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">LinkedIn URL</label>
          <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">GitHub URL</label>
          <input type="text" name="github" value={formData.github} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
        </div>
      </div>

      <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 mt-6 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]">
        <Save size={20} />
        {saving ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}