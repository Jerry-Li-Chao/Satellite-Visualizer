import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Assuming issDraco is the path to your GLTF model
import issDraco from './issDraco.gltf';

const Satellite = ({ position, id, onHover, onClick, isSelected, useCustomModel = false, scale = [0.01, 0.01, 0.01], orbitData, Exspeed: externalSpeed}) => {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [Exspeed, setExspeed] = useState(orbitData?.initialspeed || externalSpeed);

  useEffect(() => {
    if (externalSpeed !== undefined) { // Checks if externalSpeed is explicitly passed
        setExspeed(externalSpeed);
    }
  }, [externalSpeed]); // Update internal speed when externalSpeed changes
  
  // Always call useGLTF, but decide later how to use the result based on props
  const { scene } = useGLTF(issDraco);
  
  // Example of conditional usage based on props
  const model = useCustomModel ? scene : null;

   // Orbit data destructuring for clarity, fallback values are for example purposes
   //  phi = Math.acos(2 * Math.random() - 1) is a random value between 0 and PI
   // what does Math.random() generate? A random number between 0 and 1

   // I want initialspeed to be either neg or pos
   const { initialRadius = 1.7 + Math.random(), 
    initialspeed = Math.random() < 0.5 ? -0.03 : 0.03, 
    initialTheta = Math.random() * 2 * Math.PI, 
    initialphi = Math.acos(2 * Math.random() - 1)} = orbitData || {};
   
    const [radius, setRadius] = useState(initialRadius);
   const [theta, setTheta] = useState(initialTheta);
   const [phi, setPhi] = useState(initialphi);
   const [speed, setSpeed] = useState(initialspeed);

   // Update position on each frame to simulate orbit
   useFrame((state, delta) => {
        // Update theta based on speed. Ensure theta wraps around at 2*PI for continuity
        // console.log('phi', phi);
        // console.log('delta', delta);
        // console.log('speed', speed);
        // console.log('theta', theta);

        // 50% of the time, the satellite will change its orbit radius
            setTheta(theta => (theta + speed * Exspeed * delta) % (2 * Math.PI));
            
        

        // Assuming phi is constant for each satellite to keep them in a fixed orbit plane
        // For a circular orbit in the equatorial plane, you might set phi = Math.PI / 2
        // const phi = Math.PI / 2; 

        // Convert spherical coordinates to Cartesian for the orbit
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        // For an orbit in the equatorial plane, z would be 0 if phi is Math.PI / 2
        // Adjust the formula below if using a different value for phi for inclined orbits
        const z = radius * Math.cos(phi);

        ref.current.position.set(x, y, z);
    });


  return (
    <mesh
      ref={ref}
      position={position}
      // Apply scale based on useCustomModel
      scale={useCustomModel ? scale : [1, 1, 1]} 
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onHover({ id, position: ref.current.position.toArray() });
      }}
    //   onPointerOut={(e) => {
    //     setIsHovered(false);
    //     onHover(null);
    //   }}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      {useCustomModel ? (
        <primitive object={model} />
      ) : (
        // Default geometry if not using the custom model
        <>
        <meshStandardMaterial color={'#aaa'} metalness={0.5} roughness={0.5} />
        <sphereGeometry args={[0.005, 32, 32]} />
        </>
        
      )}
      <meshStandardMaterial color={isSelected ? 'yellow' : (isHovered ? 'white' : 'white')} />

    </mesh>
  );
};

export default Satellite;

// Preload the model to avoid delays on first use
useGLTF.preload(issDraco);
