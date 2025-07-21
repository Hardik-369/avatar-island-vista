
import * as THREE from 'three';
import { SceneManager } from './scene/SceneManager';
import { IslandGenerator } from './island/IslandGenerator';
import { UserManager } from './users/UserManager';
import { CameraController } from './camera/CameraController';
import { AnimationLoop } from './animation/AnimationLoop';

export class IslandWorld {
  private container: HTMLElement;
  private sceneManager: SceneManager;
  private islandGenerator: IslandGenerator;
  private userManager: UserManager;
  private cameraController: CameraController;
  private animationLoop: AnimationLoop;
  private isInitialized = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.sceneManager = new SceneManager(container);
    this.islandGenerator = new IslandGenerator();
    this.userManager = new UserManager();
    this.cameraController = new CameraController(
      this.sceneManager.camera,
      this.sceneManager.renderer.domElement
    );
    this.animationLoop = new AnimationLoop();
  }

  async init() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing IslandWorld...');
      
      // Setup scene
      this.sceneManager.setupLighting();
      
      // Generate island
      const island = this.islandGenerator.generateIsland();
      this.sceneManager.scene.add(island);
      
      // Generate ocean
      const ocean = this.islandGenerator.generateOcean();
      this.sceneManager.scene.add(ocean);
      
      // Setup camera position
      this.cameraController.setInitialPosition();
      
      // Load initial users
      await this.userManager.loadMockUsers();
      
      // Add users to scene
      const userMeshes = this.userManager.getUserMeshes();
      userMeshes.forEach(mesh => this.sceneManager.scene.add(mesh));
      
      // Setup UI controls
      this.setupUIControls();
      
      // Start animation loop
      this.animationLoop.start(() => {
        this.cameraController.update();
        this.userManager.updateAnimations();
        this.sceneManager.render();
      });
      
      // Hide loading screen
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
      
      this.isInitialized = true;
      console.log('IslandWorld initialized successfully!');
      
    } catch (error) {
      console.error('Failed to initialize IslandWorld:', error);
    }
  }

  private setupUIControls() {
    const loginBtn = document.getElementById('login-btn');
    const toggleAvatarsBtn = document.getElementById('toggle-avatars');
    const topViewBtn = document.getElementById('top-view');

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.addRandomUser();
      });
    }

    if (toggleAvatarsBtn) {
      toggleAvatarsBtn.addEventListener('click', () => {
        this.userManager.toggleVisibility();
      });
    }

    if (topViewBtn) {
      topViewBtn.addEventListener('click', () => {
        this.cameraController.toggleTopView();
      });
    }
  }

  private async addRandomUser() {
    const newUser = this.userManager.generateRandomUser();
    await this.userManager.addUser(newUser);
    const userMeshes = this.userManager.getUserMeshes();
    const latestMesh = userMeshes[userMeshes.length - 1];
    if (latestMesh) {
      this.sceneManager.scene.add(latestMesh);
    }
  }

  dispose() {
    this.animationLoop.stop();
    this.cameraController.dispose();
    this.userManager.dispose();
    this.sceneManager.dispose();
  }
}
