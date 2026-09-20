import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: { heading: string; text: string }[];
}

const guides: GuideSection[] = [
  {
    id: 'input-prep', title: 'Input Preparation Guide', icon: '📸',
    content: [
      { heading: 'Image Requirements', text: 'Use high-resolution images (minimum 512×512). JPG, PNG, and WebP formats are supported. Maximum file size is 20 MB per image.' },
      { heading: 'Best Practices for Single Image', text: 'Use images with clear subject isolation. Avoid heavy shadows. Center the subject with padding. Neutral backgrounds work best.' },
      { heading: 'Multi-View Photography Tips', text: 'Take 2-4 photos from different angles (front, side, back, top). Maintain consistent lighting. Keep subject in same position.' },
      { heading: 'Text Prompt Tips', text: 'Be specific about shape, material, and style. Include details like "wooden", "metallic". Specify the art style (realistic, cartoon, low-poly).' },
    ],
  },
  {
    id: 'engine-selection', title: 'Engine Selection Guide', icon: '🧠',
    content: [
      { heading: 'For Speed', text: 'Use Prism Turbo or InstantMesh for fast previews. Perfect for early concept exploration.' },
      { heading: 'For Quality', text: 'Use Rodin or Magic3D for highest quality. These take longer but produce detailed geometry up to 8K.' },
      { heading: 'For Game Assets', text: 'Meshy and Tripo offer good balance. Enable quad retopology for clean topology.' },
      { heading: 'For 3D Printing', text: 'Hunyuan3D and Stable 3D produce watertight meshes. Export to STL or 3MF for slicer compatibility.' },
    ],
  },
  {
    id: 'retopology', title: 'Retopology & Mesh Repair', icon: '🔧',
    content: [
      { heading: 'What is Retopology?', text: 'Retopology rebuilds the mesh with clean, even quad-based polygons. Essential for animation and game engines.' },
      { heading: 'Quad vs Triangle', text: 'Quad retopology creates four-sided polygons preferred for subdivision. Triangle meshes are lighter but harder to edit.' },
      { heading: 'Mesh Repair', text: 'AI-generated meshes may have holes or non-manifold edges. Our repair tool creates watertight meshes for 3D printing.' },
    ],
  },
  {
    id: 'export', title: 'Export & Integration Guide', icon: '📦',
    content: [
      { heading: 'GLB/glTF — Web & AR', text: 'Best for web 3D, AR Quick Look (iOS), and modern pipelines. Supports PBR materials.' },
      { heading: 'OBJ — Universal', text: 'Widely supported across all 3D software. Good for Blender, Maya, 3ds Max.' },
      { heading: 'FBX — Games & Film', text: 'Autodesk format with animation support. Best for Unity, Unreal Engine.' },
      { heading: 'STL — 3D Printing', text: 'Standard format for 3D printing. Compatible with all slicer software.' },
      { heading: 'USDZ — Apple AR', text: 'Apple AR format for Quick Look on iOS.' },
      { heading: 'BLEND — Blender', text: 'Direct Blender integration. Preserves materials and modifiers.' },
    ],
  },
  {
    id: 'style-conversion', title: '2D-to-3D-Style Conversion Guide', icon: '🎨',
    content: [
      { heading: 'Understanding the Output', text: 'This tool creates 2D images that look 3D. The output is an image file, NOT a 3D model.' },
      { heading: 'Choosing a Style', text: 'Ghibli and Pixar work great for characters. Clay and Lego for product mockups. Cyberpunk for artistic content.' },
      { heading: 'Model Selection', text: 'GPT-4o offers accurate detail. Midjourney excels at artistic looks. Flux Kontext is fastest.' },
      { heading: 'Architecture Conversion', text: 'Upload floor plans. Choose Isometric or Realistic 3D style. Add prompts like "aerial view".' },
    ],
  },
];

const faqs = [
  { q: 'Is it really free?', a: 'Yes! You get 30 free credits with no sign-up required. Each 3D generation costs 2-3 credits. 2D-to-3D-style costs 1 credit. The 3D file converter is completely free.' },
  { q: 'What happens when I run out of credits?', a: 'Create a free account for monthly free credits. Download EaseMate app for 30 bonus credits.' },
  { q: 'Can I use generated models commercially?', a: 'Yes, all generated models are yours to use commercially. No attribution required.' },
  { q: 'How long does generation take?', a: 'Fast engines: 10-30 seconds. Medium: 1-3 minutes. High-quality: 3-10 minutes.' },
  { q: 'What is the maximum file size?', a: '20 MB per image for 3D generation and style conversion. Supported: JPG, JPEG, PNG, WebP.' },
  { q: 'Do I need to install software?', a: 'No! Everything runs in your browser. The 3D viewer, file converter, and all tools work directly online.' },
  { q: 'Difference between 3D Studio and 2D-to-3D-Style?', a: '3D Studio creates actual 3D model files (GLB, OBJ, STL). 2D-to-3D-Style creates images that look 3D but are still flat image files.' },
];

export default function Guides() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>('input-prep');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Guides & FAQ</h1>
        <p className="text-gray-400 mt-1">Learn how to get the best results from Ease3D</p>
      </div>

      <div className="space-y-3">
        {guides.map(guide => (
          <div key={guide.id} className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <button onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-all">
              <div className="flex items-center gap-3"><span className="text-2xl">{guide.icon}</span><span className="font-semibold text-lg">{guide.title}</span></div>
              {expandedGuide === guide.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedGuide === guide.id && (
              <div className="px-5 pb-5 space-y-4">
                {guide.content.map((section, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/[0.02]">
                    <h4 className="font-medium text-indigo-300 mb-2">{section.heading}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{section.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-6 h-6 text-indigo-400" /> Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-all">
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>
              {expandedFaq === i && (<div className="px-4 pb-4"><p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p></div>)}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-600/5 to-cyan-600/5 border border-indigo-500/10">
        <h3 className="font-bold text-lg mb-4">🚀 Quick Workflow Reference</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { step: '1', title: 'Upload or Generate', desc: 'Start with an image or text prompt' },
            { step: '2', title: 'Choose Engine', desc: 'Select the best AI engine' },
            { step: '3', title: 'Generate 3D', desc: 'Click generate and wait' },
            { step: '4', title: 'Preview & Edit', desc: 'Use 3D viewer and tools' },
            { step: '5', title: 'Export', desc: 'Download in preferred format' },
            { step: '6', title: 'Use', desc: 'Import into game engine or slicer' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">{item.step}</div>
              <div><p className="font-medium text-sm">{item.title}</p><p className="text-xs text-gray-400">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}