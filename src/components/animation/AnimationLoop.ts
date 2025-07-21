
export class AnimationLoop {
  private animationId: number | null = null;
  private isRunning = false;

  start(callback: () => void) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    const animate = () => {
      if (!this.isRunning) return;
      
      callback();
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
