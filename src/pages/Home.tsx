import { useAppStore } from '../store';
import { Image, Type, Palette, Zap, ArrowRight, Shield, Globe, Cpu, Layers } from 'lucide-react';

export default function HomePage() {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent rounded-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">30 Free Credits — No Sign-up Required</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              AI-Powered 3D
            </span>
            <br />
            <span className="text-white/90">Generation Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Convert images to 3D models, generate from text, compare 15+ AI engines, 
            and transform 2D images into stunning 3D-style visuals — all in one platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setCurrentPage('studio3d')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              Start Creating <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage('style-convert')}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Palette className="w-5 h-5" /> 2D → 3D Style
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Image, title: 'Image to 3D', desc: 'Convert any photo into a textured 3D model', page: 'studio3d', color: 'from-purple-500 to-pink-500' },
            { icon: Layers, title: 'Multi-View to 3D', desc: 'Combine 2-4 photos for accurate geometry', page: 'studio3d', color: 'from-blue-500 to-cyan-500' },
            { icon: Type, title: 'Text to 3D', desc: 'Generate 3D models from text descriptions', page: 'text-to-3d', color: 'from-green-500 to-emerald-500' },
            { icon: Cpu, title: '15+ AI Engines', desc: 'Meshy, Tripo, Hunyuan, Rodin, Prism & more', page: 'compare', color: 'from-orange-500 to-red-500' },
            { icon: Palette, title: '2D → 3D Style', desc: 'Transform images into 3D-looking visuals', page: 'style-convert', color: 'from-pink-500 to-rose-500' },
            { icon: Globe, title: 'Free 3D Converter', desc: 'Convert STL, OBJ, GLB, FBX & more in-browser', page: 'converter', color: 'from-cyan-500 to-blue-500' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(item.page)}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-4">Built For Every Use Case</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">From game development to 3D printing, e-commerce to animation</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { emoji: '🎮', title: 'Game Development', desc: 'Turn concept art into game-ready assets for Unity, Unreal, Godot' },
            { emoji: '🖨️', title: '3D Printing', desc: 'Convert photos into print-ready STL or 3MF files' },
            { emoji: '🛍️', title: 'Products & E-Commerce', desc: 'Interactive 3D views and AR experiences from product photos' },
            { emoji: '🎨', title: 'Art & Hobby', desc: 'Turn sketches into models or collectible figurines' },
            { emoji: '🎬', title: 'Animation & Video', desc: 'Rig and animate characters for film and content' },
            { emoji: '📐', title: 'Architecture', desc: 'Convert floor plans into 3D architecture visuals' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all">
              <span className="text-3xl mb-3 block">{item.emoji}</span>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '15+', label: 'AI Engines' },
            { value: '8', label: 'Export Formats' },
            { value: '8K', label: 'PBR Textures' },
            { value: '30', label: 'Free Credits' },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {item.value}
              </div>
              <div className="text-gray-400 text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-cyan-600/10 border border-indigo-500/20">
          <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">No Sign-up Required</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Start converting immediately with 30 free credits. Create an account for saved history and monthly credits.
          </p>
          <button
            onClick={() => setCurrentPage('studio3d')}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
}