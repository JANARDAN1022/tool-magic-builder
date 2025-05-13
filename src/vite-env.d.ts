
/// <reference types="vite/client" />

// Define a global ambient declaration for AI models
declare global {
  interface Window {
    ENV: {
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
      GROQ_API_KEY?: string;
      GEMINI_API_KEY?: string;
    }
  }
}

export {};
