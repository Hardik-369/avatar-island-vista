
import * as THREE from 'three';

interface User {
  id: string;
  name: string;
  photoURL: string;
}

export class UserManager {
  private users: User[] = [];
  private userMeshes: THREE.Mesh[] = [];
  private textureLoader: THREE.TextureLoader;
  private defaultTexture: THREE.Texture | null = null;
  private animationTime = 0;
  private visible = true;

  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.loadDefaultTexture();
  }

  private loadDefaultTexture() {
    // Create a simple colored canvas as default
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 128, 128);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(1, '#357ABD');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    // Add user icon
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 64, 80);
    
    this.defaultTexture = new THREE.CanvasTexture(canvas);
  }

  async loadMockUsers() {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Alice Explorer',
        photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b566?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '2', 
        name: 'Bob Adventure',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '3',
        name: 'Carol Journey',
        photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ];

    for (const user of mockUsers) {
      await this.addUser(user);
    }
  }

  async addUser(user: User): Promise<void> {
    this.users.push(user);
    
    try {
      const texture = await this.loadTexture(user.photoURL);
      const mesh = this.createUserMesh(texture, user);
      this.userMeshes.push(mesh);
    } catch (error) {
      console.warn(`Failed to load texture for user ${user.name}, using default`, error);
      const mesh = this.createUserMesh(this.defaultTexture!, user);
      this.userMeshes.push(mesh);
    }
  }

  private loadTexture(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  private createUserMesh(texture: THREE.Texture, user: User): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position on island
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 8;
    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.z = Math.sin(angle) * radius;
    mesh.position.y = 2 + Math.random() * 2;
    
    // Store user data
    mesh.userData = { user, baseY: mesh.position.y };
    
    return mesh;
  }

  updateAnimations() {
    this.animationTime += 0.016; // ~60fps
    
    this.userMeshes.forEach((mesh, index) => {
      // Floating animation
      const baseY = mesh.userData.baseY;
      mesh.position.y = baseY + Math.sin(this.animationTime + index) * 0.3;
      
      // Billboard effect - always face camera (will be set by camera controller)
      // This is handled in the animation loop
    });
  }

  generateRandomUser(): User {
    const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Quinn', 'Sage'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // Use a placeholder service for random profile pictures
    const photoURL = `https://picsum.photos/150/150?random=${randomId}`;
    
    return {
      id: randomId,
      name: randomName,
      photoURL
    };
  }

  toggleVisibility() {
    this.visible = !this.visible;
    this.userMeshes.forEach(mesh => {
      mesh.visible = this.visible;
    });
  }

  getUserMeshes(): THREE.Mesh[] {
    return this.userMeshes;
  }

  dispose() {
    this.userMeshes.forEach(mesh => {
      mesh.geometry.dispose();
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose();
      }
    });
    this.userMeshes = [];
    this.users = [];
  }
}
