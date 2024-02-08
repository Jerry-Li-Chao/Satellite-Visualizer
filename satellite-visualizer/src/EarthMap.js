import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, useTexture, OrbitControls, Html } from '@react-three/drei';
import earthTexture from './earth.jpg';
import Satellite from './Satellite';


// Helper function to generate positions
const generateSatellitePositions = (radius, count) => {
  let positions = [];
  for (let i = 0; i < count; i++) {
    // Spherical coordinates to Cartesian coordinates conversion
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    positions.push([x, y, z]);
    console.log([x, y, z])
  }
  return positions;
};

const Earth = () => {
  const [hoveredSatellite, setHoveredSatellite] = useState(null);
  const colorMap = useTexture(earthTexture);

  // Dependencies array is empty, so this runs once
  // Generate positions for 100 satellites
  const satellitePositions = useMemo(() => generateSatellitePositions(1.2, 100), []); 

  return (
    <>
      {/* Earth Sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial map={colorMap} />
      </Sphere>

      {/* Satellites */}
      {satellitePositions.map((pos, idx) => (
        <Satellite
          key={idx}
          position={pos}
          id={idx}
          onHover={setHoveredSatellite}
          useCustomModel={false}
        />
      ))}

        <Satellite
          key={999}
          position={[-0.7847662993282591, 0.22492340109848052, -0.8795176627430067]}
          id={999}
          onHover={setHoveredSatellite}
          useCustomModel={true}
        />

      {/* Info Box for Hovered Satellite */}
      {hoveredSatellite && (
        <Html position={hoveredSatellite.position} center>
          <div style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}>
            Satellite ID: {hoveredSatellite.id}
          </div>
        </Html>
      )}
    </>
  );
};

const EarthMap = () => {
  return (
    <Canvas>
      <ambientLight intensity={10.5} />
      <pointLight position={[10, 10, 10]} />
      <Earth />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.1} />
    </Canvas>
  );
};

export default EarthMap;
