import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "db.json");

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  profile_picture?: string | null;
  created_at: string;
  last_login: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  selected_world: string;
  current_lesson: string;
  completed_lessons: string[];
  test_scores: Record<string, number>;
  xp_points: number;
  badges: string[];
  streak: number;
  weak_topics: string[];
  strong_topics: string[];
  completed_daily_problems?: number[];
  updated_at: string;
}

export interface SandboxFile {
  id: string;
  user_id: string;
  filename: string;
  code: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  steps_completed: number;
  saved_code: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  concept_id: string;
  title: string;
  created_at: string;
}

export interface PeerPost {
  id: string;
  user_id: string;
  author_name: string;
  text: string;
  concept: string;
  votes: number;
  solved: boolean;
  created_at: string;
}

export interface PeerReply {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  text: string;
  created_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  url: string; // base64 or storage url
  created_at: string;
}

export interface VoiceMessage {
  id: string;
  user_id: string;
  audio_url: string; // base64 or path
  created_at: string;
}

export interface AITutorChat {
  id: string;
  user_id: string;
  role: "user" | "model";
  content: string;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  theme: string;
  font_size: string;
  sound_preference: boolean;
  language: string;
  updated_at: string;
}

export interface DatabaseSchema {
  users: User[];
  userProgress: UserProgress[];
  lessons: any[];
  tests: any[];
  testResults: any[];
  sandboxFiles: SandboxFile[];
  projects: Project[];
  bookmarks: Bookmark[];
  peerPosts: PeerPost[];
  peerReplies: PeerReply[];
  uploads: Upload[];
  voiceMessages: VoiceMessage[];
  aiTutorChats: AITutorChat[];
  settings: Settings[];
}

const DEFAULT_DB: DatabaseSchema = {
  users: [],
  userProgress: [],
  lessons: [],
  tests: [],
  testResults: [],
  sandboxFiles: [],
  projects: [],
  bookmarks: [],
  peerPosts: [],
  peerReplies: [],
  uploads: [],
  voiceMessages: [],
  aiTutorChats: [],
  settings: [],
};

// Helper to load db
export function loadDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      return DEFAULT_DB;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error("Failed to load db.json, returning default:", error);
    return DEFAULT_DB;
  }
}

// Helper to save db
export function saveDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save db.json:", error);
  }
}
