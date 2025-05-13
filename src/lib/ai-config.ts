
// Available models from Groq
export const GROQ_MODELS = [
  "llama-3.1-8b-instant", // Fastest model first for quicker responses
  "gemma-7b-it", // Add Gemma 7B for speed
  "llama3-8b-8192", // Original model as backup
  "llama-3.3-70b-versatile", // Last resort, most powerful but slower
];

// Default model to use
export const DEFAULT_MODEL = "llama-3.1-8b-instant";

// API keys (these would be set in environment variables in production)
export const GROQ_API_KEY = "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";
export const GEMINI_API_KEY = "AIzaSyAr6OvHmCoXCaD1pRkFA8hgIZJujWONl30";

// Function to get available models
export const getAvailableModels = () => {
  return GROQ_MODELS;
};
