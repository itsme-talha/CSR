"use client";

import { useTheme } from './ThemeProvider';

const themes = [
  { id: 'margalla-mist', name: 'Margalla Mist', color1: '#18143C', color2: '#C2185B' },
  { id: 'institutional-blue', name: 'Institutional Blue', color1: '#1E3A8A', color2: '#2563EB' },
  { id: 'ivory-press', name: 'Ivory Press', color1: '#3E2723', color2: '#D32F2F' },
  { id: 'sage-calm', name: 'Sage Calm', color1: '#1B261B', color2: '#4CAF50' },
  { id: 'indigo-night', name: 'Indigo Night', color1: '#050812', color2: '#818CF8' },
  { id: 'graphite', name: 'Graphite', color1: '#000000', color2: '#BDBDBD' },
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[100] hidden md:flex flex-col gap-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-200">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id as any)}
          className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 focus:outline-none ${
            theme === t.id ? 'ring-2 ring-offset-2 ring-brand-action scale-110' : 'hover:scale-110 hover:ring-2 hover:ring-offset-1 hover:ring-slate-300'
          }`}
          aria-label={`Switch to ${t.name} theme`}
        >
          {/* Color Circle */}
          <span 
            className="w-full h-full rounded-full shadow-sm border border-white"
            style={{ background: `linear-gradient(135deg, ${t.color1} 50%, ${t.color2} 50%)` }}
          ></span>
          
          {/* Modern Tooltip Name on Hover */}
          <span className="absolute right-12 bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-md">
            {t.name}
            {/* Tooltip arrow */}
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-slate-800"></span>
          </span>
        </button>
      ))}
    </div>
  );
}