import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';

// Assuming issDraco is the path to your GLTF model
import issDraco from './issDraco.gltf';

const Satellite = ({ position, id, onHover, useCustomModel = false, scale = [0.01, 0.01, 0.01]}) => {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);
  
  // Always call useGLTF, but decide later how to use the result based on props
  const { scene } = useGLTF(issDraco);
  
  // Example of conditional usage based on props
  const model = useCustomModel ? scene : null;

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
      onPointerOut={(e) => {
        setIsHovered(false);
        onHover(null);
      }}
    >
      {useCustomModel ? (
        <primitive object={model} />
      ) : (
        // Default geometry if not using the custom model
        <sphereGeometry args={[0.01, 6, 6]} />
      )}
      <meshStandardMaterial color={isHovered ? 'hotpink' : 'white'} />
    </mesh>
  );
};

export default Satellite;

// Preload the model to avoid delays on first use
useGLTF.preload(issDraco);
