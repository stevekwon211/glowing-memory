# Creative Archive

A dedicated showcase page for interactive Three.js and shader works at `/ca` route.

## Features

### 4x4 Grid Layout

- Responsive grid that adapts to different screen sizes
- 16 total slots with 5 current projects and 11 "Coming Soon" placeholders
- Smooth animations with staggered load effects

### Interactive Thumbnails

- Live iframe previews of each project
- Hover effects that activate the iframe interaction
- Fallback preview images for better performance
- Overlay with project information and "Launch Project" button

### Project Information

- Project title, type (Three.js, Shader, WebGL), and year
- Expandable descriptions with additional metadata
- Direct links to live projects opening in new tabs

### Responsive Design

- Desktop: 4x4 grid
- Tablet: 2x2 grid
- Mobile: Single column layout
- Optimized for various screen sizes (down to 320px)

## Current Projects

1. **Grass Field** (Three.js, 2024)

   - Interactive grass field simulation with realistic wind physics
   - URL: https://grass-doeon.vercel.app/

2. **Daisy** (Shader, 2024)

   - Organic forms and natural movements with procedural animations
   - URL: https://daisy-teal.vercel.app/

3. **Zen Friend** (WebGL, 2024)

   - Meditative interactive experience with ambient soundscapes
   - URL: https://zen-friend.vercel.app/

4. **Undistracted** (Three.js, 2024)

   - Focus-enhancing visual environment for productivity
   - URL: https://undistracted.vercel.app/

5. **Verae** (Shader, 2024)
   - Truth in digital form through geometric abstractions
   - URL: https://verae.vercel.app/

## Navigation

- Accessible via the "⚡ Creative Archive" link on the main page (top-left)
- Back button returns to the main portfolio page
- All projects open in new tabs to preserve the archive experience

## Technical Implementation

- **Framework**: Next.js 14 with App Router
- **Styling**: CSS Modules with modern gradients and blur effects
- **Previews**: iframe integration with sandbox security
- **Performance**: Lazy loading and optimized animations
- **TypeScript**: Full type safety with defined project interfaces

## File Structure

```
app/ca/
├── page.tsx          # Main Creative Archive component
└── page.module.css   # Styling and responsive design
```

## Future Enhancements

- Preview image generation for faster loading
- Project filtering by type/year
- Search functionality
- Additional project metadata
- Performance analytics integration
