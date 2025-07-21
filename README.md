
# IslandWorld - 3D Avatar Island Experience

A Three.js web application that displays users as floating profile pictures on a beautiful 3D island.

## Features

- 🏝️ Procedurally generated 3D island using native Three.js geometries
- 👤 Floating user avatars with profile pictures
- 🎮 Interactive camera controls (orbit, zoom, pan)
- 📱 Mobile-responsive design
- 🌊 Animated ocean environment
- ⚡ Built with Vite for fast development
- 🎨 Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/island-world.git
cd island-world
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Controls

- **Mouse/Touch**: Drag to rotate camera around the island
- **Scroll/Pinch**: Zoom in and out
- **Add User**: Click the "Add User" button to add random users to the island
- **Toggle Avatars**: Hide/show all user avatars
- **Top View**: Switch between orbital and top-down camera views

## Project Structure

```
src/
├── components/
│   ├── IslandWorld.ts          # Main application class
│   ├── scene/
│   │   └── SceneManager.ts     # Three.js scene setup
│   ├── island/
│   │   └── IslandGenerator.ts  # Island geometry generation
│   ├── users/
│   │   └── UserManager.ts      # User avatar management
│   ├── camera/
│   │   └── CameraController.ts # Camera controls
│   └── animation/
│       └── AnimationLoop.ts    # Animation loop management
└── pages/
    └── Index.tsx               # Main React component
```

## Customization

### Adding New Users

Users are loaded from mock data. To modify the initial users, edit the `mockUsers` array in `UserManager.ts`.

### Island Appearance

Modify the island generation in `IslandGenerator.ts`:
- Change colors in the `generateIsland()` method
- Adjust terrain distortion in `applyTerrainDistortion()`
- Modify ocean appearance in `generateOcean()`

### Camera Behavior

Customize camera controls in `CameraController.ts`:
- Adjust sensitivity by modifying the delta multipliers
- Change zoom limits in the wheel event handler
- Modify initial camera position in `setInitialPosition()`

## Performance Optimization

- Images are loaded asynchronously with fallback textures
- Geometry is optimized for mobile devices
- Textures use efficient filtering
- Animation loop runs at 60fps with requestAnimationFrame

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with WebGL support

## Technologies Used

- **Three.js** - 3D graphics and WebGL rendering
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Netlify Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## Troubleshooting

### Images Not Loading
- Check CORS settings for external image URLs
- Ensure image URLs are accessible
- Default avatars will be used for failed loads

### Performance Issues
- Reduce the number of avatars for mobile devices
- Lower texture resolution in UserManager.ts
- Disable shadows in SceneManager.ts for better performance

### Mobile Controls
- Ensure touch events are enabled
- Test zoom functionality with pinch gestures
- Adjust sensitivity for smaller screens

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
