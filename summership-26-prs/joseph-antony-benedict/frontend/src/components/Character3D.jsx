import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Cone, Cylinder } from '@react-three/drei';

const Goblin = () => {
  const group = useRef();

  // We can add subtle rotations inside the Float component automatically,
  // but let's also give him a slight breathing/looking animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) * 0.3;
    group.current.position.y = Math.sin(t * 2) * 0.1;
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Body / Robe */}
      <Cylinder args={[0.5, 1, 1.5, 32]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#8E44AD" roughness={0.3} metalness={0.1} />
      </Cylinder>

      {/* Head */}
      <Sphere args={[0.6, 32, 32]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#2ECC71" roughness={0.5} />
      </Sphere>

      {/* Left Eye */}
      <Sphere args={[0.1, 16, 16]} position={[-0.2, 2.1, 0.5]}>
        <meshStandardMaterial color="#F1C40F" emissive="#F1C40F" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* Right Eye */}
      <Sphere args={[0.1, 16, 16]} position={[0.2, 2.1, 0.5]}>
        <meshStandardMaterial color="#F1C40F" emissive="#F1C40F" emissiveIntensity={0.5} />
      </Sphere>

      {/* Left Ear */}
      <Cone args={[0.2, 0.8, 16]} position={[-0.6, 2, 0]} rotation={[0, 0, Math.PI / 3]}>
        <meshStandardMaterial color="#27AE60" />
      </Cone>

      {/* Right Ear */}
      <Cone args={[0.2, 0.8, 16]} position={[0.6, 2, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <meshStandardMaterial color="#27AE60" />
      </Cone>

      {/* Magic Glowing Treasure in Hands */}
      <Sphere args={[0.2, 16, 16]} position={[0, 1, 0.8]}>
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1.5} />
      </Sphere>
    </group>
  );
};

const Character3D = () => {
  return (
    <div style={{ width: '100%', height: '300px', cursor: 'grab', background: 'radial-gradient(circle, rgba(255,46,147,0.1) 0%, transparent 70%)', borderRadius: '16px' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FF2E93" />
        <directionalLight position={[-10, 10, -5]} intensity={1} color="#00F0FF" />
        <pointLight position={[0, 1, 1]} intensity={2} color="#00F0FF" distance={2} />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Goblin />
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 2 + 0.2} 
        />
      </Canvas>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>
        👆 Click and drag to rotate Sly!
      </div>
    </div>
  );
};

export default Character3D;
