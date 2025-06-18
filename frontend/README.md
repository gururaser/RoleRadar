# RoleRadar Frontend

A modern React/Next.js frontend for the RoleRadar job search application, powered by AI semantic search.

## Features

- 🔍 **Natural Language Search**: Describe your dream job in everyday language
- 🎯 **AI-Powered Matching**: Semantic search technology finds the most relevant opportunities
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast & Modern**: Built with Next.js 14 and TypeScript
- 🎨 **Beautiful UI**: Clean, professional interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Backend Requirements

Make sure your RoleRadar backend API is running on `http://localhost:8080`. The frontend uses a Next.js API route (`/api/search`) as a proxy to avoid CORS issues.

**Backend API Endpoint:** `POST http://localhost:8080/api/v1/search/job`

**Frontend API Route:** `POST /api/search` (proxied to backend)

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# For development
NODE_ENV=development
```

## Usage

1. **Search for Jobs**: Enter a natural language query describing your ideal job
   - Example: "Data Analyst jobs in California with SQL and Python experience"
   - Example: "Remote Software Engineer positions with React"

2. **View Results**: Browse through AI-ranked job listings with:
   - Match scores showing relevance
   - Job details including company, location, skills
   - Job level and work type badges

3. **Explore Opportunities**: Click on any job to view more details

## Architecture

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: Fetch API with POST requests

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main search page
├── styles/
│   └── globals.css         # Global styles and Tailwind imports
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Styling
- Modify `tailwind.config.js` to customize colors, fonts, and spacing
- Update `styles/globals.css` for global styles
- The color scheme uses a green primary color that matches the RoleRadar brand

### API Integration
- Update the API endpoint in `app/page.tsx` if your backend runs on a different port
- Modify the search request payload structure if needed

## Performance

- Built with Next.js for optimal performance
- Static generation where possible
- Responsive images and lazy loading
- Optimized bundle size with tree shaking

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the RoleRadar application suite.
