import { useAppStore } from '../store';
import {
  Box, Image, Type, GitCompare, FileBox, Palette, BookOpen, Home, Menu, X, Zap, User, Sparkles
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'studio3d', label: '3D Studio', icon: Box },
  { id: 'tripo-studio', label: 'Tripo AI', icon: Sparkles },
  { id: 'image-studio', label: 'Image Studio', icon: Image },
  { id: 'text-to-3d', label: 'Text to 3D', icon: Type },
  { id: 'compare', label: 'Compare Engines', icon: GitCompare },
  { id: 'converter', label: 'Free Converter', icon: FileBox },
  { id: 'style-convert', label: '2D→3D Style', icon: Palette },
  { id: 'guides', label: 'Guides', icon: BookOpen },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage, credits } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Ease3D
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentPage === item.id
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Credits & User */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">{credits.remaining} credits</span>
            </div>
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <User className="w-4 h-4 text-gray-400" />
            </button>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
            <nav className="p-4 grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                  className={`px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    currentPage === item.id
                      ? 'bg-indigo-600/20 text-indigo-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
