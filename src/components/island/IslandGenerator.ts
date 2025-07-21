
import * as THREE from 'three';

export class IslandGenerator {
  generateIsland(): THREE.Group {
    const islandGroup = new THREE.Group();
    
    // Create the main island terrain
    const island = this.createIslandTerrain();
    islandGroup.add(island);
    
    // Add trees
    const trees = this.generateTrees();
    trees.forEach(tree => islandGroup.add(tree));
    
    // Add houses
    const houses = this.generateHouses();
    houses.forEach(house => islandGroup.add(house));
    
    // Add some rocks for detail
    const rocks = this.generateRocks();
    rocks.forEach(rock => islandGroup.add(rock));
    
    return islandGroup;
  }

  private createIslandTerrain(): THREE.Mesh {
    // Create a flatter, more island-like shape using cylinder geometry
    const geometry = new THREE.CylinderGeometry(18, 20, 8, 32, 1);
    
    // Apply terrain distortion to make it more natural
    this.applyIslandDistortion(geometry);
    
    // Create material with natural colors
    const material = new THREE.MeshLambertMaterial({
      vertexColors: true
    });
    
    // Add vertex colors for different terrain types
    this.addTerrainColors(geometry);
    
    const island = new THREE.Mesh(geometry, material);
    island.position.y = -4;
    island.receiveShadow = true;
    island.castShadow = true;
    
    return island;
  }

  private applyIslandDistortion(geometry: THREE.CylinderGeometry) {
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Create rolling hills effect
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const heightNoise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
      const edgeEffect = Math.max(0, 1 - distanceFromCenter / 20);
      
      // Apply height variation
      const newY = y + heightNoise * edgeEffect;
      positions.setXYZ(i, x, newY, z);
    }
    
    geometry.computeVertexNormals();
  }

  private addTerrainColors(geometry: THREE.CylinderGeometry) {
    const colors = [];
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      
      if (distanceFromCenter > 18) {
        // Beach/sand area
        colors.push(0.94, 0.87, 0.69);
      } else if (y > 2) {
        // Higher areas - darker green
        colors.push(0.15 + Math.random() * 0.1, 0.5 + Math.random() * 0.1, 0.1);
      } else {
        // Lower areas - lighter green
        colors.push(0.3 + Math.random() * 0.2, 0.7 + Math.random() * 0.1, 0.2);
      }
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }

  private generateTrees(): THREE.Mesh[] {
    const trees = [];
    const treeCount = 5; // Reduced from 15 to 5
    
    // Predefined positions to avoid overcrowding
    const treePositions = [
      { angle: 0, radius: 8 },
      { angle: Math.PI * 0.4, radius: 6 },
      { angle: Math.PI * 0.8, radius: 10 },
      { angle: Math.PI * 1.2, radius: 7 },
      { angle: Math.PI * 1.6, radius: 9 }
    ];
    
    for (let i = 0; i < treeCount; i++) {
      const tree = this.createTree();
      const pos = treePositions[i];
      
      tree.position.x = Math.cos(pos.angle) * pos.radius;
      tree.position.z = Math.sin(pos.angle) * pos.radius;
      tree.position.y = 0;
      
      trees.push(tree);
    }
    
    return trees;
  }

  private createTree(): THREE.Group {
    const tree = new THREE.Group();
    
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Tree foliage
    const foliageGeometry = new THREE.SphereGeometry(2, 8, 6);
    const foliageMaterial = new THREE.MeshLambertMaterial({ 
      color: new THREE.Color().setHSL(0.3, 0.7, 0.3 + Math.random() * 0.2)
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 4;
    foliage.scale.y = 0.8;
    foliage.castShadow = true;
    tree.add(foliage);
    
    // Random scale variation
    const scale = 0.8 + Math.random() * 0.4;
    tree.scale.set(scale, scale, scale);
    
    return tree;
  }

  private generateHouses(): THREE.Mesh[] {
    const houses = [];
    const houseCount = 5;
    
    for (let i = 0; i < houseCount; i++) {
      const house = this.createHouse();
      
      // Position houses in a more organized way
      const angle = (i / houseCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 8 + Math.random() * 6;
      house.position.x = Math.cos(angle) * radius;
      house.position.z = Math.sin(angle) * radius;
      house.position.y = 0.5;
      
      houses.push(house);
    }
    
    return houses;
  }

  private createHouse(): THREE.Group {
    const house = new THREE.Group();
    
    // House base
    const baseGeometry = new THREE.BoxGeometry(2, 2, 2);
    const baseMaterial = new THREE.MeshLambertMaterial({ 
      color: new THREE.Color().setHSL(0.1, 0.3, 0.7)
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1;
    base.castShadow = true;
    house.add(base);
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(1.7, 1.5, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.75;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.1);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.4, 1.05);
    house.add(door);
    
    // Random rotation
    house.rotation.y = Math.random() * Math.PI * 2;
    
    return house;
  }

  private generateRocks(): THREE.Mesh[] {
    const rocks = [];
    const rockCount = 8;
    
    for (let i = 0; i < rockCount; i++) {
      const rock = this.createRock();
      
      // Random position around the island
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 4;
      rock.position.x = Math.cos(angle) * radius;
      rock.position.z = Math.sin(angle) * radius;
      rock.position.y = -1;
      
      rocks.push(rock);
    }
    
    return rocks;
  }

  private createRock(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.5 + Math.random(), 6, 4);
    const material = new THREE.MeshLambertMaterial({ color: 0x696969 });
    
    // Distort the sphere to make it more rock-like
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const noise = (Math.random() - 0.5) * 0.3;
      positions.setXYZ(i, x + noise, y + noise, z + noise);
    }
    
    geometry.computeVertexNormals();
    
    const rock = new THREE.Mesh(geometry, material);
    rock.castShadow = true;
    rock.receiveShadow = true;
    
    // Random scale and rotation
    const scale = 0.5 + Math.random() * 0.8;
    rock.scale.set(scale, scale, scale);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    
    return rock;
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
}
