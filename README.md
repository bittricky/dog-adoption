# Dog Adoption

A modern, responsive web application built with React and TypeScript that helps users find and adopt dogs. Users can search for dogs by breed and location, favorite potential matches, and receive personalized dog recommendations based on their preferences.

## Features

- **User Authentication**: Secure login system to manage user sessions
- **Dog Search**: Filter dogs by breed and location (ZIP code)
- **Favorites**: Save dogs you're interested in for later viewing
- **Matching Algorithm**: Get personalized dog matches based on your favorites
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Elegant loading indicators and skeleton screens

## Tech Stack

### Frontend
- **React 18**: UI library for building component-based interfaces
- **TypeScript**: For type-safe code and improved developer experience
- **Vite**: Fast, modern build tool and development server
- **React Router**: For client-side routing and navigation
- **React Query**: Data fetching, caching, and state management
- **TailwindCSS**: Utility-first CSS framework for styling
- **Lucide React**: Lightweight icon library
- **React Hot Toast**: For elegant toast notifications

### State Management
- React Query for server state
- React hooks for local state management

### Styling
- TailwindCSS with custom configuration
- Inter font from Google Fonts for clean typography
- Custom color palette with primary (purple) and secondary (yellow) themes

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components for routing
├── utils/          # Utility functions and API calls
├── global.d.ts     # TypeScript type definitions
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/dog-adoption.git
   cd dog-adoption
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The application integrates with a RESTful API for dog data. The API endpoints include:

- Authentication
- Dog search with filtering
- Dog details
- Location validation
- Match generation

All API calls are handled in the `src/utils/api.ts` file with proper error handling and type safety.

## UI Components

The application includes several reusable components:

- **Button**: Customizable button with different variants and sizes
- **Card**: Container for displaying content with consistent styling
- **Dog**: Card component for displaying dog information
- **ErrorMessage**: Component for displaying error states with retry options
- **Input**: Form input with validation states
- **MatchedDog**: Modal display for matched dogs
- **Modal**: Reusable modal component
- **Select**: Dropdown select component
- **Skeleton**: Loading placeholder for content
- **Spinner**: Loading indicator
