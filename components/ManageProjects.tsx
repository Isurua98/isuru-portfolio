"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, Edit2, X, ExternalLink, Upload } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  category: string;
  linkLabel?: string;
  liveUrl: string;
  githubUrl: string;
}

export default function ManageProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [] as string[],
    category: "Featured Projects",
    linkLabel: "View Project",
    liveUrl: "",
    githubUrl: ""
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const list: ProjectItem[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ProjectItem);
      });
      setProjects(list);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      images: [],
      category: "Featured Projects",
      linkLabel: "View Project",
      liveUrl: "",
      githubUrl: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (project: ProjectItem) => {
    const existingImages =
      project.images && project.images.length > 0
        ? project.images
        : project.image
        ? [project.image]
        : [];

    setFormData({
      title: project.title || "",
      description: project.description || "",
      images: existingImages,
      category: project.category || "Featured Projects",
      linkLabel: project.linkLabel || "View Project",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || ""
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter((p) => p.id !== id));
      setMessage("Project deleted successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting project:", error);
      setMessage("Failed to delete project.");
    }
  };

  // Compress up to 3 images to Base64 so they fit safely inside Firestore free tier
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 3 - formData.images.length;
    if (remainingSlots <= 0) {
      alert("You can upload a maximum of 3 images per project.");
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 650;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, compressedBase64].slice(0, 3)
          }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert("Please upload at least 1 project image.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      title: formData.title,
      description: formData.description,
      images: formData.images,
      image: formData.images[0] || "",
      category: formData.category,
      linkLabel: formData.linkLabel,
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), payload);
        setMessage("Project updated successfully!");
      } else {
        await addDoc(collection(db, "projects"), payload);
        setMessage("New project added successfully!");
      }
      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      setMessage("Failed to save project. Try using smaller images.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (loading) return <div className="text-slate-400">Loading projects...</div>;

  return (
    <div className="w-full space-y-6 text-left">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          Total Projects: <span className="text-cyan-400 font-bold">{projects.length}</span>
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Plus size={18} />
            Add New Project
          </button>
        )}
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.includes("successfully")
              ? "bg-green-950/50 text-green-400 border border-green-900"
              : "bg-red-950/50 text-red-400 border border-red-900"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add / Edit Project Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-100">
              {editingId ? "Edit Project" : "Add New Project"}
            </h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-200">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI Video Ad Campaign"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none"
              >
                <option value="Featured Projects">Featured Projects</option>
                <option value="Web Tools">Web Tools</option>
                <option value="Social Media">Social Media</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of what this project is about..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none"
              />
            </div>

            {/* Multi-Image Upload Section (Up to 3 images) */}
            <div className="sm:col-span-2 space-y-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-200">
                    Project Images ({formData.images.length}/3)
                  </label>
                  <p className="text-xs text-slate-500">Upload 1 to 3 screenshots or thumbnails from your PC</p>
                </div>

                {formData.images.length < 3 && (
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-medium rounded-lg cursor-pointer border border-slate-700 transition-colors self-start">
                    <Upload size={16} />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {formData.images.map((imgSrc, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                      <img src={imgSrc} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full shadow-md transition-opacity"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                      <span className="absolute bottom-1 left-1.5 text-[10px] px-1.5 py-0.5 bg-slate-950/80 text-slate-300 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Universal Link + Button Label */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Button Text</label>
              <select
                value={formData.linkLabel}
                onChange={(e) => setFormData({ ...formData, linkLabel: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none"
              >
                <option value="View Project">View Project</option>
                <option value="Live Demo">Live Demo</option>
                <option value="Watch Video">Watch Video (YouTube / Reel)</option>
                <option value="Visit Page">Visit Page (Facebook / Social)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Project Link (Website / YouTube / FB)
              </label>
              <input
                type="text"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                GitHub / Source Code URL (Optional)
              </label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Project" : "Save Project"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No projects found in database. Click "Add New Project" to create one.
          </div>
        ) : (
          projects.map((project) => {
            const thumb =
              (project.images && project.images[0]) ||
              project.image ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80";
            const imgCount = project.images ? project.images.length : project.image ? 1 : 0;

            return (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={thumb}
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-800"
                    />
                    {imgCount > 1 && (
                      <span className="absolute -bottom-1.5 -right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-600 text-white">
                        +{imgCount - 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                      {project.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-100 mt-1">{project.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-md">{project.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-900 rounded-lg border border-slate-800"
                      title={project.linkLabel || "View Project"}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-amber-400 hover:bg-amber-950/40 bg-slate-900 rounded-lg border border-slate-800 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-2 text-red-400 hover:bg-red-950/40 bg-slate-900 rounded-lg border border-slate-800 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}