
import { useEffect, useRef } from 'react';
import { IslandWorld } from '../components/IslandWorld';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new IslandWorld(containerRef.current);
    app.init();

    return () => {
      app.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div 
        ref={containerRef} 
        className="w-full h-screen relative overflow-hidden"
        id="island-world-container"
      />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button 
          id="login-btn"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Add User
        </button>
        <button 
          id="toggle-avatars"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          Toggle Avatars
        </button>
        <button 
          id="top-view"
          className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
        >
          Top View
        </button>
      </div>

      {/* Loading Screen */}
      <div 
        id="loading-screen"
        className="absolute inset-0 bg-background flex items-center justify-center z-20"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading IslandWorld...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
