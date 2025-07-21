
import * as THREE from 'three';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private canvas: HTMLCanvasElement;
  private isMouseDown = false;
  private mousePosition = { x: 0, y: 0 };
  private cameraPosition = { theta: 0, phi: Math.PI / 4, radius: 25 };
  private target = new THREE.Vector3(0, 0, 0);
  private isTopView = false;
  private originalPosition = { theta: 0, phi: Math.PI / 4, radius: 25 };

  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    this.setupControls();
  }

  private setupControls() {
    // Mouse controls
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown || this.isTopView) return;

      const deltaX = e.clientX - this.mousePosition.x;
      const deltaY = e.clientY - this.mousePosition.y;

      this.cameraPosition.theta += deltaX * 0.01;
      this.cameraPosition.phi += deltaY * 0.01;

      // Clamp phi to prevent camera flipping
      this.cameraPosition.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraPosition.phi));

      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    // Zoom controls
    this.canvas.addEventListener('wheel', (e) => {
      this.cameraPosition.radius += e.deltaY * 0.01;
      this.cameraPosition.radius = Math.max(5, Math.min(50, this.cameraPosition.radius));
    });

    // Touch controls for mobile
    let touchStart = { x: 0, y: 0 };
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStart.x = e.touches[0].clientX;
        touchStart.y = e.touches[0].clientY;
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && !this.isTopView) {
        const deltaX = e.touches[0].clientX - touchStart.x;
        const deltaY = e.touches[0].clientY - touchStart.y;

        this.cameraPosition.theta += deltaX * 0.01;
        this.cameraPosition.phi += deltaY * 0.01;

        this.cameraPosition.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraPosition.phi));

        touchStart.x = e.touches[0].clientX;
        touchStart.y = e.touches[0].clientY;
      }
    });
  }

  setInitialPosition() {
    this.cameraPosition = { theta: 0, phi: Math.PI / 4, radius: 25 };
    this.originalPosition = { ...this.cameraPosition };
    this.updateCameraPosition();
  }

  update() {
    this.updateCameraPosition();
  }

  private updateCameraPosition() {
    if (this.isTopView) return;

    const x = this.cameraPosition.radius * Math.sin(this.cameraPosition.phi) * Math.cos(this.cameraPosition.theta);
    const y = this.cameraPosition.radius * Math.cos(this.cameraPosition.phi);
    const z = this.cameraPosition.radius * Math.sin(this.cameraPosition.phi) * Math.sin(this.cameraPosition.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  toggleTopView() {
    this.isTopView = !this.isTopView;
    
    if (this.isTopView) {
      // Switch to top-down view
      this.camera.position.set(0, 40, 0);
      this.camera.lookAt(this.target);
    } else {
      // Return to orbit view
      this.cameraPosition = { ...this.originalPosition };
      this.updateCameraPosition();
    }
  }

  dispose() {
    // Remove event listeners if needed
  }
}
