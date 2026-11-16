export type Category = "Featured Projects" | "Web Tools" | "Social Media";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: Category;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "English Sentence Practice Web Application",
    description: "A web-based language learning application designed for practice and fluency.",
    image: "/projects/1.jpg",
    category: "Web Tools",
    liveUrl: "https://english-practice.vercel.app",
    githubUrl: "https://github.com/isuru998/english-practice"
  },
  {
    id: "2",
    title: "AI Resume & Cover Letter Builder",
    description: "An AI-powered web application built to optimize resumes and generate cover letters.",
    image: "/projects/2.jpg",
    category: "Featured Projects",
    liveUrl: "https://isuru998-ai-resume.vercel.app",
    githubUrl: "https://github.com/isuru998/ai-resume-builder"
  },
  {
    id: "3",
    title: "Viral Mystery Storytelling (Case 404)",
    description: "Short-form vertical video content exploring the Great Titanic Swap Theory (79K+ Views).",
    image: "/projects/3.jpg",
    category: "Social Media",
    liveUrl: "#",
    githubUrl: "#"
  }
];