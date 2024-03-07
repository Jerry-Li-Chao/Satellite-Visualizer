import React from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, EquirectangularReflectionMapping, BackSide } from 'three';
import galaxyImage from './galaxy.jpg';

const Skybox = () => {
    const texture = useLoader(TextureLoader, galaxyImage);
    texture.mapping = EquirectangularReflectionMapping;
  
    return (
      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial map={texture} side={BackSide} />
      </mesh>
    );
  };
  
  export default Skybox;