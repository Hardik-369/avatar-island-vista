
import * as THREE from 'three';

export class IslandGenerator {
  generateIsland(): THREE.Mesh {
    // Create base island using sphere geometry
    const geometry = new THREE.SphereGeometry(15, 32, 16);
    
    // Apply noise-like distortion to create terrain
    this.applyTerrainDistortion(geometry);
    
    // Create material with natural colors
    const material = new THREE.MeshLambertMaterial({
      color: 0x228B22, // Forest green
      vertexColors: true
    });
    
    // Add vertex colors for variation
    this.addVertexColors(geometry);
    
    const island = new THREE.Mesh(geometry, material);
    island.position.y = -5; // Partially submerge the sphere
    island.receiveShadow = true;
    island.castShadow = true;
    
    return island;
  }

  generateOcean(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0x006994,
      transparent: true,
      opacity: 0.7
    });
    
    const ocean = new THREE.Mesh(geometry, material);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -8;
    ocean.receiveShadow = true;
    
    return ocean;
  }

  private applyTerrainDistortion(geometry: THREE.SphereGeometry) {
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Simple noise simulation using sine waves
      const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
      
      // Normalize and apply noise
      const length = Math.sqrt(x * x + y * y + z * z);
      const factor = (15 + noise) / length;
      
      positions.setXYZ(i, x * factor, y * factor, z * factor);
    }
    
    geometry.computeVertexNormals();
  }

  private addVertexColors(geometry: THREE.SphereGeometry) {
    const colors = [];
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      
      // Color based on height
      if (y > 5) {
        // Snow/rock - gray
        colors.push(0.8, 0.8, 0.8);
      } else if (y > 0) {
        // Grass - green
        colors.push(0.2 + Math.random() * 0.3, 0.6 + Math.random() * 0.2, 0.1);
      } else {
        // Beach/sand - yellow
        colors.push(0.9, 0.8, 0.4);
      }
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }
}
