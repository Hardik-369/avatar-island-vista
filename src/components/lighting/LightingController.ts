
import * as THREE from 'three';

export class LightingController {
  private scene: THREE.Scene;
  private ambientLight: THREE.AmbientLight;
  private sunLight: THREE.DirectionalLight;
  private moonLight: THREE.DirectionalLight;
  private timeOfDay = 0; // 0 to 1 (0 = midnight, 0.5 = noon)
  private dayDuration = 30000; // 30 seconds for full day/night cycle
  private startTime = Date.now();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.setupLighting();
  }

  private setupLighting() {
    // Ambient light that changes with time of day
    this.ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(this.ambientLight);

    // Sun light (directional)
    this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 50;
    this.sunLight.shadow.camera.left = -20;
    this.sunLight.shadow.camera.right = 20;
    this.sunLight.shadow.camera.top = 20;
    this.sunLight.shadow.camera.bottom = -20;
    this.scene.add(this.sunLight);

    // Moon light (softer, blue-ish)
    this.moonLight = new THREE.DirectionalLight(0x4444ff, 0.3);
    this.moonLight.castShadow = false;
    this.scene.add(this.moonLight);
  }

  update() {
    const currentTime = Date.now();
    const elapsed = (currentTime - this.startTime) % this.dayDuration;
    this.timeOfDay = elapsed / this.dayDuration;

    const sunAngle = this.timeOfDay * Math.PI * 2;
    const sunHeight = Math.sin(sunAngle);
    const isDay = sunHeight > 0;

    // Sun position (moves in an arc)
    const sunDistance = 30;
    this.sunLight.position.set(
      Math.cos(sunAngle) * sunDistance,
      Math.max(0, sunHeight * sunDistance),
      Math.sin(sunAngle) * sunDistance
    );

    // Moon position (opposite to sun)
    const moonAngle = sunAngle + Math.PI;
    this.moonLight.position.set(
      Math.cos(moonAngle) * sunDistance,
      Math.max(0, Math.sin(moonAngle) * sunDistance),
      Math.sin(moonAngle) * sunDistance
    );

    // Adjust light intensities based on time of day
    if (isDay) {
      const dayIntensity = Math.max(0.1, sunHeight);
      this.sunLight.intensity = dayIntensity * 1.2;
      this.moonLight.intensity = 0;
      this.ambientLight.intensity = 0.3 + dayIntensity * 0.2;
      
      // Day colors
      this.sunLight.color.setHSL(0.1, 0.1, 1); // Warm white
      this.ambientLight.color.setHSL(0.1, 0.2, 1);
    } else {
      // Night time
      const nightIntensity = Math.max(0, -sunHeight);
      this.sunLight.intensity = 0;
      this.moonLight.intensity = nightIntensity * 0.5;
      this.ambientLight.intensity = 0.1 + nightIntensity * 0.1;
      
      // Night colors
      this.moonLight.color.setHSL(0.6, 0.3, 0.8); // Cool blue
      this.ambientLight.color.setHSL(0.6, 0.5, 0.3);
    }

    // Update sky color based on time of day
    this.updateSkyColor();
  }

  private updateSkyColor() {
    const sunAngle = this.timeOfDay * Math.PI * 2;
    const sunHeight = Math.sin(sunAngle);
    
    let skyColor: THREE.Color;
    
    if (sunHeight > 0.5) {
      // Bright day
      skyColor = new THREE.Color(0x87CEEB);
    } else if (sunHeight > 0) {
      // Dawn/dusk
      const t = sunHeight * 2;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0xff6b35), // Orange sunset
        new THREE.Color(0x87CEEB), // Day blue
        t
      );
    } else if (sunHeight > -0.3) {
      // Twilight
      const t = (sunHeight + 0.3) / 0.3;
      skyColor = new THREE.Color().lerpColors(
        new THREE.Color(0x191970), // Night blue
        new THREE.Color(0xff6b35), // Orange sunset
        t
      );
    } else {
      // Deep night
      skyColor = new THREE.Color(0x0c0c2b);
    }
    
    this.scene.background = skyColor;
    if (this.scene.fog) {
      (this.scene.fog as THREE.Fog).color = skyColor;
    }
  }

  dispose() {
    this.scene.remove(this.ambientLight);
    this.scene.remove(this.sunLight);
    this.scene.remove(this.moonLight);
  }
}
