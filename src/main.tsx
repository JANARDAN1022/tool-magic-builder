
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload theme to prevent flash of incorrect theme
const savedTheme = localStorage.getItem('magic-tools-theme') || 'system';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = savedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : savedTheme;

// Apply theme immediately before render to prevent flash
document.documentElement.classList.add(theme);

createRoot(document.getElementById("root")!).render(<App />);
