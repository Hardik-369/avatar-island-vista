
import * as THREE from 'three';

export class IslandGenerator {
  generateIsland(): THREE.Group {
    const islandGroup = new THREE.Group();
    
    // Create the main floating island terrain
    const island = this.createFloatingIsland();
    islandGroup.add(island);
    
    // Add minimal trees (4-5 trees)
    const trees = this.generateMinimalTrees();
    trees.forEach(tree => islandGroup.add(tree));
    
    // Add just 2-3 houses for minimal look
    const houses = this.generateMinimalHouses();
    houses.forEach(house => islandGroup.add(house));
    
    // Add floating rocks around the island
    const floatingRocks = this.generateFloatingRocks();
    floatingRocks.forEach(rock => islandGroup.add(rock));
    
    return islandGroup;
  }

  private createFloatingIsland(): THREE.Mesh {
    // Create a more organic floating island shape
    const geometry = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.7);
    
    // Apply natural distortion to make it look more organic
    this.applyFloatingIslandDistortion(geometry);
    
    // Create material with natural colors
    const material = new THREE.MeshLambertMaterial({
      vertexColors: true
    });
    
    // Add terrain colors
    this.addFloatingTerrainColors(geometry);
    
    const island = new THREE.Mesh(geometry, material);
    island.position.y = 5; // Floating effect
    island.receiveShadow = true;
    island.castShadow = true;
    
    return island;
  }

  private applyFloatingIslandDistortion(geometry: THREE.SphereGeometry) {
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Create more natural, less uniform terrain
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const heightNoise = 
        Math.sin(x * 0.15) * Math.cos(z * 0.15) * 2 +
        Math.sin(x * 0.3) * Math.cos(z * 0.3) * 1 +
        (Math.random() - 0.5) * 1.5;
      
      // Make edges more dramatic for floating island effect
      const edgeEffect = Math.max(0, 1 - distanceFromCenter / 18);
      const bottomCurve = Math.max(0, y / 15); // Curve the bottom more
      
      const newY = y + (heightNoise * edgeEffect * bottomCurve);
      positions.setXYZ(i, x, newY, z);
    }
    
    geometry.computeVertexNormals();
  }

  private addFloatingTerrainColors(geometry: THREE.SphereGeometry) {
    const colors = [];
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const height = y;
      
      if (height < -8) {
        // Bottom/roots of floating island - dark earth
        colors.push(0.3, 0.2, 0.1);
      } else if (height < -2) {
        // Lower sides - rocky/earthy
        colors.push(0.4 + Math.random() * 0.1, 0.3 + Math.random() * 0.1, 0.2);
      } else if (distanceFromCenter > 12) {
        // Edges - grass/beach transition
        colors.push(0.6 + Math.random() * 0.2, 0.8 + Math.random() * 0.1, 0.3);
      } else {
        // Top surface - vibrant grass
        colors.push(0.2 + Math.random() * 0.2, 0.7 + Math.random() * 0.2, 0.15 + Math.random() * 0.1);
      }
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }

  private generateMinimalTrees(): THREE.Group[] {
    const trees = [];
    const treeCount = 4; // Minimal number of trees
    
    for (let i = 0; i < treeCount; i++) {
      const tree = this.createEnhancedTree();
      
      // Strategic placement for minimal but appealing look
      const angle = (i / treeCount) * Math.PI * 2 + Math.random() * 0.8;
      const radius = 4 + Math.random() * 6;
      tree.position.x = Math.cos(angle) * radius;
      tree.position.z = Math.sin(angle) * radius;
      tree.position.y = 5; // On the floating island surface
      
      trees.push(tree);
    }
    
    return trees;
  }

  private createEnhancedTree(): THREE.Group {
    const tree = new THREE.Group();
    
    // More detailed trunk with slight curve
    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.7, 4, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Layered foliage for more realistic look
    const foliageColors = [0x228B22, 0x32CD32, 0x006400];
    for (let i = 0; i < 2; i++) {
      const foliageGeometry = new THREE.SphereGeometry(1.8 - i * 0.3, 8, 6);
      const foliageMaterial = new THREE.MeshLambertMaterial({ 
        color: foliageColors[i % foliageColors.length]
      });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = 5 + i * 0.8;
      foliage.scale.y = 0.9;
      foliage.castShadow = true;
      tree.add(foliage);
    }
    
    // Slight random rotation and scale
    const scale = 0.9 + Math.random() * 0.3;
    tree.scale.set(scale, scale, scale);
    tree.rotation.y = Math.random() * Math.PI * 2;
    
    return tree;
  }

  private generateMinimalHouses(): THREE.Group[] {
    const houses = [];
    const houseCount = 2; // Very minimal
    
    for (let i = 0; i < houseCount; i++) {
      const house = this.createEnhancedHouse();
      
      // Place houses strategically
      const angle = (i / houseCount) * Math.PI * 2 + Math.PI;
      const radius = 7 + Math.random() * 3;
      house.position.x = Math.cos(angle) * radius;
      house.position.z = Math.sin(angle) * radius;
      house.position.y = 6; // On the island surface
      
      houses.push(house);
    }
    
    return houses;
  }

  private createEnhancedHouse(): THREE.Group {
    const house = new THREE.Group();
    
    // House base with more interesting shape
    const baseGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const houseColors = [0xD2B48C, 0xF5DEB3, 0xDEB887];
    const baseMaterial = new THREE.MeshLambertMaterial({ 
      color: houseColors[Math.floor(Math.random() * houseColors.length)]
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1.25;
    base.castShadow = true;
    house.add(base);
    
    // Enhanced roof
    const roofGeometry = new THREE.ConeGeometry(2.2, 2, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3.25;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);
    
    // Window
    const windowGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(0.8, 1.5, 1.3);
    house.add(window);
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(-0.5, 0.5, 1.3);
    house.add(door);
    
    house.rotation.y = Math.random() * Math.PI * 2;
    
    return house;
  }

  private generateFloatingRocks(): THREE.Mesh[] {
    const rocks = [];
    const rockCount = 6;
    
    for (let i = 0; i < rockCount; i++) {
      const rock = this.createFloatingRock();
      
      // Position rocks around the main island
      const angle = (i / rockCount) * Math.PI * 2;
      const radius = 18 + Math.random() * 8;
      const height = 2 + Math.random() * 6;
      
      rock.position.x = Math.cos(angle) * radius;
      rock.position.z = Math.sin(angle) * radius;
      rock.position.y = height;
      
      rocks.push(rock);
    }
    
    return rocks;
  }

  private createFloatingRock(): THREE.Mesh {
    const size = 0.5 + Math.random() * 1.5;
    const geometry = new THREE.SphereGeometry(size, 6, 4);
    const material = new THREE.MeshLambertMaterial({ color: 0x696969 });
    
    // Distort to make rock-like
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const noise = (Math.random() - 0.5) * 0.4;
      positions.setXYZ(i, x + noise, y + noise, z + noise);
    }
    
    geometry.computeVertexNormals();
    
    const rock = new THREE.Mesh(geometry, material);
    rock.castShadow = true;
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    
    return rock;
  }

  generateOcean(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(300, 300, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0x006994,
      transparent: true,
      opacity: 0.8
    });
    
    const ocean = new THREE.Mesh(geometry, material);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -20; // Far below the floating island
    ocean.receiveShadow = true;
    
    return ocean;
  }
}
