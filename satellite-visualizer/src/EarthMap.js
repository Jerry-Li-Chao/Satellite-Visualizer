import React, { useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, useTexture, OrbitControls, Html } from '@react-three/drei';
import earthTexture from './earth.jpg';
import Satellite from './Satellite';
import Skybox from './Skybox';


// Helper function to generate positions
const generateSatellitePositions = (radius, count) => {
  let positions = [];
  for (let i = 0; i < count; i++) {
    radius = 1.2 + Math.random() * 0.3; // Orbital radius
    // Spherical coordinates to Cartesian coordinates conversion
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    // generate random names for satellites, among these options {STARLINK-XXXX, COSMOS-XXXX, ONEWEB-XXXX, GPS-1 to GPS-32}
    const names = ['STARLINK', 'COSMOS', 'ONEWEB', 'GPS'];
    // it should be STARLINK 70% of the time, COSMOS 20% of the time, ONEWEB 5% of the time, and GPS 5% of the time
    const random = Math.random();
    let name = '';
    if (random < 0.7) {
      name = 'STARLINK';
    } else if (random < 0.9) {
      name = 'COSMOS';
    } else if (random < 0.95) {
      name = 'ONEWEB';
    } else {
      name = 'GPS';
    }
    // if the satellite is GPS, add a number to the name
    if (name === 'GPS') {
      const number = Math.floor(Math.random() * 32) + 1;
      name = `${name}-${number}`;
    }
    // if the satellite is not GPS, add a number 1000-5999 to the name
    else {
      const number = Math.floor(Math.random() * 5000) + 1000;
      name = `${name}-${number}`;
    }
    // add the satellite name to the positions array
    positions.push([x, y, z, name]);
  }
  return positions;
};


const Earth = ({speed: externalSpeed}) => {
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [hoveredSatellite, setHoveredSatellite] = useState(null);
  const colorMap = useTexture(earthTexture);

  // Dependencies array is empty, so this runs once
  // Generate positions for 100 satellites
  const satellitePositions = useMemo(() => generateSatellitePositions(2.2, 1500), []); 
  

   // Adjust handleDeselect to work with the canvas onClick
   useEffect(() => {
    const handleCanvasClick = () => {
      if (!hoveredSatellite) {
        setSelectedSatellite(null);
      }
    };

    document.addEventListener('click', handleCanvasClick);
    return () => document.removeEventListener('click', handleCanvasClick);
  }, [hoveredSatellite]);

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
          // should be the name from the positions array
          id={pos[3]}
          onHover={setHoveredSatellite}
          onClick={() => setSelectedSatellite({id: idx, position: pos})}
          isSelected={selectedSatellite?.id === idx}
          useCustomModel={false}
          Exspeed={externalSpeed}
        />
      ))}

        <Satellite
          key={5000}
          position={[-0.7847662993282591, 0.22492340109848052, -0.8795176627430067]}
          id={`International Space Station`}
          onHover={setHoveredSatellite}
          useCustomModel={true}
          Exspeed={externalSpeed}
        />

      {/* Info Box for Hovered Satellite */}
      {hoveredSatellite && (
              <Html position={hoveredSatellite.position} center>
                <div style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', borderRadius: '4px'}}>
                  Satellite: {hoveredSatellite.id}
                </div>
        </Html>
      )}
    </>
  );
};

const EarthMap = () => {
  const [satelliteSpeed, setSatelliteSpeed] = useState(0.5);

  // Handler to update the satellite speed from the slider
  const handleSpeedChange = (event) => {
    setSatelliteSpeed(Number(event.target.value));
  };

  return (
    <div>
      <Canvas>
        <ambientLight intensity={0.5} />
        {/* <pointLight position={[10, 10, 10]} /> */}
        <directionalLight 
          intensity={10} // Adjust the intensity as needed
          position={[5, 3, 5]} // Position the light source to shine on one side of the Earth
          castShadow={true}
        />
        <Skybox />
        <Earth speed={satelliteSpeed}/>
        <OrbitControls 
          enableZoom={true}  
          autoRotate 
          autoRotateSpeed={0.01} 
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: '30px',
        margin: '10px',
        color: 'white',
        zIndex: 100 // Ensure it's above the canvas
      }}>
        <label htmlFor="speedRange" style={{ marginRight: '10px' }}>Simulation Speed: </label>
        <input
          id="speedRange"
          type="range"
          min="0" // Minimum speed
          max="10"   // Maximum speed
          step="0.1"
          value={satelliteSpeed}
          onChange={handleSpeedChange}
        />
        {satelliteSpeed}
    </div>   
   </div>
  );
};

export default EarthMap;
