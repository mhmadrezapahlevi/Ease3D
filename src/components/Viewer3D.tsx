import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { ViewerMode } from '../types';

function ModelMesh({ mode, autoRotate }: { mode: ViewerMode; autoRotate: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const getMaterial = () => {
    switch (mode) {
      case 'wireframe':
        return <meshStandardMaterial color="#00ff88" wireframe />;
      case 'uv-map':
        return <meshBasicMaterial map={createUVTexture()} />;
      case 'solid':
        return <meshStandardMaterial color="#6366f1" flatShading />;
      default:
        return <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.1} />;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        {getMaterial()}
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.8} />
      </mesh>
      {/* Accent ring */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.05, 8, 32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function createUVTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // UV checker pattern
  const gridSize = 16;
  const cellSize = 512 / gridSize;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? '#4f46e5' : '#06b6d4';
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export default function Viewer3D({ className = '' }: { className?: string }) {
  const { viewerMode, autoRotate } = useAppStore();

  return (
    <div className={`relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-gray-900 ${className}`}>
      <Canvas shadows camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#06b6d4" />
        <ModelMesh mode={viewerMode} autoRotate={autoRotate} />
        <Grid args={[10, 10]} cellColor="#1e1b4b" sectionColor="#4f46e5" fadeDistance={15} position={[0, -0.8, 0]} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <Environment preset="city" />
      </Canvas>
      
      {/* Viewer controls overlay */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => useAppStore.getState().setViewerMode('textured')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewerMode === 'textured' ? 'bg-indigo-600 text-white' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'}`}
        >
          Textured
        </button>
        <button
          onClick={() => useAppStore.getState().setViewerMode('wireframe')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewerMode === 'wireframe' ? 'bg-indigo-600 text-white' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'}`}
        >
          Wireframe
        </button>
        <button
          onClick={() => useAppStore.getState().setViewerMode('uv-map')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewerMode === 'uv-map' ? 'bg-indigo-600 text-white' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'}`}
        >
          UV Map
        </button>
        <button
          onClick={() => useAppStore.getState().setViewerMode('solid')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewerMode === 'solid' ? 'bg-indigo-600 text-white' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'}`}
        >
          Solid
        </button>
      </div>
      
      <div className="absolute top-4 right-4">
        <button
          onClick={() => useAppStore.getState().setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${autoRotate ? 'bg-cyan-600 text-white' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'}`}
        >
          {autoRotate ? '⏸ Auto-Rotate' : '▶ Auto-Rotate'}
        </button>
      </div>
    </div>
  );
}