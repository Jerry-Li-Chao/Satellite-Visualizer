import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const Satellite = ({ position, id, onHover }) => {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // Update the satellite's position each frame, if needed
  useFrame(() => {
    // Example: rotate or move each satellite here if desired
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onHover({ id, position: ref.current.position.toArray() });
      }}
      onPointerOut={(e) => {
        setIsHovered(false);
        onHover(null);
      }}
    >
      <sphereGeometry args={[0.01, 6, 6]} />
      <meshStandardMaterial color={isHovered ? 'hotpink' : 'white'} />
    </mesh>
  );
};

export default Satellite;