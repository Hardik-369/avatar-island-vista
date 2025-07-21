
import * as THREE from 'three';

export class IslandGenerator {
  generateIsland(): THREE.Group {
    const islandGroup = new THREE.Group();
    
    // Create the main floating island terrain with natural shape
    const island = this.createRealisticFloatingIsland();
    islandGroup.add(island);
    
    // Add exactly 4-5 trees with variety
    const trees = this.generateMinimalTrees();
    trees.forEach(tree => islandGroup.add(tree));
    
    // Add 2-3 small houses for charm
    const houses = this.generateMinimalHouses();
    houses.forEach(house => islandGroup.add(house));
    
    // Add floating rocks around the island for magical effect
    const floatingRocks = this.generateFloatingRocks();
    floatingRocks.forEach(rock => islandGroup.add(rock));
    
    // Add grass patches for realism
    const grassPatches = this.generateGrassPatches();
    grassPatches.forEach(patch => islandGroup.add(patch));
    
    return islandGroup;
  }

  private createRealisticFloatingIsland(): THREE.Mesh {
    // Create a more natural, less spherical floating island
    const geometry = new THREE.CylinderGeometry(12, 8, 6, 32, 8);
    
    // Apply realistic terrain distortion
    this.applyRealisticTerrainDistortion(geometry);
    
    // Create material with vertex colors for natural look
    const material = new THREE.MeshLambertMaterial({
      vertexColors: true
    });
    
    // Add realistic terrain colors
    this.addRealisticTerrainColors(geometry);
    
    const island = new THREE.Mesh(geometry, material);
    island.position.y = 5; // Floating effect
    island.receiveShadow = true;
    island.castShadow = true;
    
    return island;
  }

  private applyRealisticTerrainDistortion(geometry: THREE.CylinderGeometry) {
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      
      // Create natural hill-like variations on top surface
      if (y > 1) {
        const hillNoise = 
          Math.sin(x * 0.2) * Math.cos(z * 0.2) * 1.5 +
          Math.sin(x * 0.4) * Math.cos(z * 0.4) * 0.8 +
          (Math.random() - 0.5) * 0.6;
        
        const edgeEffect = Math.max(0, 1 - distanceFromCenter / 14);
        const newY = y + (hillNoise * edgeEffect);
        positions.setXYZ(i, x, newY, z);
      } 
      // Create rocky, eroded bottom for floating effect
      else if (y < -1) {
        const erosionNoise = 
          Math.sin(x * 0.3) * Math.cos(z * 0.3) * 1.2 +
          (Math.random() - 0.5) * 1.8;
        
        const bottomCurve = Math.max(0, 1 - distanceFromCenter / 10);
        const newY = y + (erosionNoise * bottomCurve);
        positions.setXYZ(i, x, newY, z);
      }
    }
    
    geometry.computeVertexNormals();
  }

  private addRealisticTerrainColors(geometry: THREE.CylinderGeometry) {
    const colors = [];
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      
      if (y < -1) {
        // Bottom/roots - dark rocky earth
        colors.push(0.25, 0.15, 0.1);
      } else if (y < 1) {
        // Sides - rocky cliff face
        colors.push(0.4 + Math.random() * 0.1, 0.35 + Math.random() * 0.1, 0.25);
      } else if (distanceFromCenter > 10) {
        // Edges - sandy/rocky edge
        colors.push(0.7 + Math.random() * 0.1, 0.6 + Math.random() * 0.1, 0.4);
      } else {
        // Top surface - lush grass with variation
        const grassVariation = Math.random() * 0.3;
        colors.push(
          0.1 + grassVariation, 
          0.6 + grassVariation, 
          0.1 + grassVariation * 0.5
        );
      }
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }

  private generateMinimalTrees(): THREE.Group[] {
    const trees = [];
    const treeCount = 5; // Exactly 4-5 trees
    
    const treeTypes = ['oak', 'pine', 'birch'];
    
    for (let i = 0; i < treeCount; i++) {
      const treeType = treeTypes[i % treeTypes.length];
      const tree = this.createVariedTree(treeType);
      
      // Strategic natural placement
      const angle = (i / treeCount) * Math.PI * 2 + Math.random() * 1.2;
      const radius = 3 + Math.random() * 5;
      tree.position.x = Math.cos(angle) * radius;
      tree.position.z = Math.sin(angle) * radius;
      tree.position.y = 6; // On island surface
      
      trees.push(tree);
    }
    
    return trees;
  }

  private createVariedTree(type: string): THREE.Group {
    const tree = new THREE.Group();
    
    if (type === 'oak') {
      return this.createOakTree();
    } else if (type === 'pine') {
      return this.createPineTree();
    } else {
      return this.createBirchTree();
    }
  }

  private createOakTree(): THREE.Group {
    const tree = new THREE.Group();
    
    // Thick curved trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.6, 0.8, 4.5, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2.25;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Large rounded canopy
    const canopyGeometry = new THREE.SphereGeometry(2.2, 12, 8);
    const canopyMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
    canopy.position.y = 6;
    canopy.scale.y = 0.8;
    canopy.castShadow = true;
    tree.add(canopy);
    
    const scale = 0.9 + Math.random() * 0.4;
    tree.scale.set(scale, scale, scale);
    tree.rotation.y = Math.random() * Math.PI * 2;
    
    return tree;
  }

  private createPineTree(): THREE.Group {
    const tree = new THREE.Group();
    
    // Tall thin trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 5, 6);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2.5;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Layered pine needles
    for (let i = 0; i < 3; i++) {
      const needleGeometry = new THREE.ConeGeometry(1.5 - i * 0.3, 2, 8);
      const needleMaterial = new THREE.MeshLambertMaterial({ color: 0x0F4F0F });
      const needles = new THREE.Mesh(needleGeometry, needleMaterial);
      needles.position.y = 4.5 + i * 1.2;
      needles.castShadow = true;
      tree.add(needles);
    }
    
    const scale = 0.8 + Math.random() * 0.3;
    tree.scale.set(scale, scale, scale);
    tree.rotation.y = Math.random() * Math.PI * 2;
    
    return tree;
  }

  private createBirchTree(): THREE.Group {
    const tree = new THREE.Group();
    
    // White/silver trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.5, 4, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0xF5F5DC });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Light green delicate foliage
    const foliageGeometry = new THREE.SphereGeometry(1.5, 10, 6);
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 5;
    foliage.scale.set(1, 0.8, 1);
    foliage.castShadow = true;
    tree.add(foliage);
    
    const scale = 0.8 + Math.random() * 0.3;
    tree.scale.set(scale, scale, scale);
    tree.rotation.y = Math.random() * Math.PI * 2;
    
    return tree;
  }

  private generateMinimalHouses(): THREE.Group[] {
    const houses = [];
    const houseCount = 2;
    
    for (let i = 0; i < houseCount; i++) {
      const house = this.createCharmingHouse();
      
      const angle = (i / houseCount) * Math.PI * 2 + Math.PI;
      const radius = 6 + Math.random() * 2;
      house.position.x = Math.cos(angle) * radius;
      house.position.z = Math.sin(angle) * radius;
      house.position.y = 6.2;
      
      houses.push(house);
    }
    
    return houses;
  }

  private createCharmingHouse(): THREE.Group {
    const house = new THREE.Group();
    
    // Cozy house base
    const baseGeometry = new THREE.BoxGeometry(2.2, 2, 2.2);
    const houseColors = [0xD2B48C, 0xF5DEB3, 0xDEB887];
    const baseMaterial = new THREE.MeshLambertMaterial({ 
      color: houseColors[Math.floor(Math.random() * houseColors.length)]
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1;
    base.castShadow = true;
    house.add(base);
    
    // Charming roof
    const roofGeometry = new THREE.ConeGeometry(1.8, 1.8, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.9;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);
    
    // Window details
    const windowGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.05);
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(0.7, 1.3, 1.13);
    house.add(window);
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.05);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(-0.4, 0.4, 1.13);
    house.add(door);
    
    house.rotation.y = Math.random() * Math.PI * 2;
    
    return house;
  }

  private generateGrassPatches(): THREE.Mesh[] {
    const patches = [];
    const patchCount = 8;
    
    for (let i = 0; i < patchCount; i++) {
      const patch = this.createGrassPatch();
      
      const angle = (i / patchCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 2 + Math.random() * 6;
      patch.position.x = Math.cos(angle) * radius;
      patch.position.z = Math.sin(angle) * radius;
      patch.position.y = 6.1;
      
      patches.push(patch);
    }
    
    return patches;
  }

  private createGrassPatch(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(1, 1, 4, 4);
    const material = new THREE.MeshLambertMaterial({ 
      color: 0x32CD32,
      transparent: true,
      opacity: 0.7
    });
    
    // Add some height variation to grass
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      positions.setY(i, y + Math.random() * 0.1);
    }
    
    const patch = new THREE.Mesh(geometry, material);
    patch.rotation.x = -Math.PI / 2;
    patch.rotation.z = Math.random() * Math.PI * 2;
    
    return patch;
  }

  private generateFloatingRocks(): THREE.Mesh[] {
    const rocks = [];
    const rockCount = 5;
    
    for (let i = 0; i < rockCount; i++) {
      const rock = this.createFloatingRock();
      
      const angle = (i / rockCount) * Math.PI * 2;
      const radius = 16 + Math.random() * 6;
      const height = 3 + Math.random() * 5;
      
      rock.position.x = Math.cos(angle) * radius;
      rock.position.z = Math.sin(angle) * radius;
      rock.position.y = height;
      
      rocks.push(rock);
    }
    
    return rocks;
  }

  private createFloatingRock(): THREE.Mesh {
    const size = 0.6 + Math.random() * 1.2;
    const geometry = new THREE.SphereGeometry(size, 8, 6);
    const material = new THREE.MeshLambertMaterial({ color: 0x696969 });
    
    // Make rocks more irregular
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const noise = (Math.random() - 0.5) * 0.5;
      positions.setXYZ(i, x + noise, y + noise, z + noise);
    }
    
    geometry.computeVertexNormals();
    
    const rock = new THREE.Mesh(geometry, material);
    rock.castShadow = true;
    rock.rotation.set(
      Math.random() * Math.PI, 
      Math.random() * Math.PI, 
      Math.random() * Math.PI
    );
    
    return rock;
  }

  generateOcean(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(300, 300, 32, 32);
    const material = new THREE.MeshLambertMaterial({
      color: 0x006994,
      transparent: true,
      opacity: 0.8
    });
    
    // Add gentle wave motion to ocean
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const wave = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 0.3;
      positions.setY(i, wave);
    }
    
    const ocean = new THREE.Mesh(geometry, material);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -20;
    ocean.receiveShadow = true;
    
    return ocean;
  }
}
