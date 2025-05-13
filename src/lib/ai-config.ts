// Default model to use
export const DEFAULT_MODEL = import.meta.env.VITE_GROQ_DEFAULT_MODEL;

export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Function to get available models
export const getAvailableModels = () => {
  return import.meta.env.VITE_GROQ_MODELS;
};
