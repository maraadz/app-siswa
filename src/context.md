## Overview
SISMA APPS is a comprehensive Islamic school management system designed for students, parents, and school staff. It provides a complete mobile-first web application with authentication, student dashboard, academic tracking across 6 dimensions (Agamis, Qurani, Negarawan, Saintis, Multilingual, Berpartisipasi), report cards, attendance management, portfolio, and various educational features. The system uses a modern Islamic EdTech aesthetic with a calm, professional design featuring rounded cards, soft shadows, and a bento grid layout.

## Available Imports

**Components:**
- `App` - (default export) Main application component with routing, authentication, and layout management

**Types:**
- `StudentData` - (named export) Interface for student information

## Component Props & Types

```typescript
interface AppProps {
  'data-id'?: string  // Optional data-id for component identification
}

interface StudentData {
  name: string        // Student's full name
  nis: string         // Student ID number (NIS/NISN)
  kelas: string       // Class/grade (e.g., "X IPA 1")
  avatar?: string     // Optional avatar URL
}
```

## Import Patterns

```typescript
// Default export
import App from './SismaApps'

// Named type export
import type { StudentData } from './SismaApps'
```

## Usage Requirements

**Required Dependencies:**
- `react-router-dom` - For routing and navigation
- `lucide-react` - For icons throughout the application

**Router Context:**
The App component includes its own BrowserRouter, so it should NOT be wrapped in another Router component.

## How It Works

**Authentication Flow:**
- Users start at the login page with username (NIS/NISN) and password fields
- Demo credentials: username "demo" with any password
- After successful login, users are redirected to the home dashboard
- Authentication state persists during the session

**Navigation:**
- Sticky header at top shows greeting, student name, class, NIS, notifications, and profile access
- Bottom navigation bar with 5 items: Bantuan, Portofolio, Home (center), Rapor, Keuangan
- All pages include back buttons for easy navigation
- Smooth page transitions between routes

**Main Features:**
1. **Home Dashboard** - Hero carousel, 6 Dimensi cards, social media section, 9 Kurikulum features
2. **Dimensi Pages** - 6 specialized learning dimension pages with unique features:
   - Agamis: Religious education tracking
   - Qurani: Al-Qur'an progress with audio player (MUFI)
   - Negarawan: Leadership and nationalism
   - Saintis: Science achievements and projects
   - Multilingual: Arabic and English language tracking
   - Berpartisipasi: Extracurricular and competitions
3. **Rapor** - Report cards with filters (Bulanan/Semester/Cambridge)
4. **Bantuan** - Emergency contacts and school staff information
5. **Portofolio** - Student work showcase with upload capability
6. **Profile** - Student information and settings
7. **Feature Pages** - Attendance requests, study plans, school news, achievements, schedules, magazines, try-outs, attendance history, graduation info, character points

**Interactive Elements:**
- Clickable cards navigate to detail pages
- Dropdowns for semester/year selection
- Data tables with sorting and filtering
- Audio player with play/pause, progress, volume, speed controls
- Forms with validation and file upload
- Modal-like interactions for detailed views

## Layout & Appearance

**Design System:**
- Primary color: #979DA5 (muted gray-blue)
- Accent colors: Soft green/blue for Islamic tone
- Background: White and light gray
- Typography: Clean sans-serif (Inter recommended)
- Card style: Rounded-xl (1rem border radius) with soft shadows
- Layout: Bento grid system with generous spacing

**Responsive Behavior:**
- Mobile-first design (default)
- Tablet breakpoint: 768px
- Desktop breakpoint: 1024px
- Bottom navigation fixed on mobile
- Stacked layouts on mobile, grid layouts on desktop
- Touch-friendly targets (minimum 44px)

**Visual Hierarchy:**
- Sticky header: 80px height (20px top padding)
- Bottom navigation: 80px height
- Main content: Padded with pb-20 to avoid bottom nav overlap
- Maximum content width: 1280px (max-w-7xl) centered

## Styling & Theming

**Tailwind Configuration:**
The component uses Tailwind CSS with a custom primary color. Add this to your `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#979DA5'
      }
    }
  }
}
```

**Customization:**
- All components accept standard className props for additional styling
- Color scheme can be modified through Tailwind config
- Card shadows use Tailwind's shadow utilities (shadow-sm, shadow-md)
- Hover states use subtle color transitions
- Motion design: Smooth transitions on interactive elements only (no random decorative animations)

## Code Examples

### Example 1: Basic Usage
```typescript
import App from './SismaApps'

function Root() {
  return <App />
}
```

### Example 2: With Custom Data ID
```typescript
import App from './SismaApps'

function Root() {
  return <App data-id="sisma-main-app" />
}
```

### Example 3: Embedding in Existing Application
```typescript
import App from './SismaApps'

function SchoolPortal() {
  return (
    <div className="school-portal">
      <header>School Portal Header</header>
      {/* Do NOT wrap in another Router - App includes BrowserRouter */}
      <App />
      <footer>School Portal Footer</footer>
    </div>
  )
}
```

### Example 4: Using StudentData Type
```typescript
import App from './SismaApps'
import type { StudentData } from './SismaApps'

function CustomWrapper() {
  // StudentData type is available for type checking
  const mockStudent: StudentData = {
    name: 'Ahmad Fauzi',
    nis: '2024001',
    kelas: 'X IPA 1'
  }
  
  return <App />
}
```

### Example 5: Full Page Implementation
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './SismaApps'
import './index.css' // Ensure Tailwind CSS is imported

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**Important Notes:**
- The App component manages its own routing and authentication state
- Login credentials are demo-only (username: "demo", any password)
- External links (Keuangan, social media) are placeholders
- File uploads are UI-only without backend integration
- Audio player is demonstration-only without actual audio files
- All data is mock data for demonstration purposes