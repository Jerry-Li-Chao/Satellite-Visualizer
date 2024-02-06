import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere, useTexture, OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';

// Import the Earth texture from the local directory
import earthTexture from './earth.jpg';

// Extend OrbitControls (necessary for drei v7+ if using TypeScript, optional in JS)
extend({ OrbitControls });

const Earth = () => {
  const earthRef = useRef();
  // Load the Earth texture
  const colorMap = useTexture(earthTexture);

  return (
    <Sphere ref={earthRef} args={[3, 32, 32]}>
      <meshStandardMaterial map={colorMap} />
    </Sphere>
  );
};

const EarthMap = () => {
  return (
    <Canvas>
      <ambientLight intensity={10.5} />
      <pointLight position={[10, 10, 10]} />
      <Earth />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default EarthMap;
