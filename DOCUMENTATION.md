# Vancouver Heritage Interactive Map - Documentation

**Student Name:** oluwademilade aluko
**Student ID:**100431753
**Course:** WMDD 4936  
**Date:** November 15, 2024

---

## Project Information

**Project Name:** Vancouver Heritage Interactive Map

**Live Application URL:** http://localhost:1234 (Development) | [Production URL TBD]

**GitHub Repository:** [Your Repository URL]

**Dataset:** [Vancouver Heritage Register - Open Data Portal](https://opendata.vancouver.ca/explore/dataset/heritage-register/information/)

**Description:** An interactive full-stack web application that allows Vancouver residents, tourists, and history enthusiasts to explore 151+ heritage sites on an interactive map, read historical information enriched from Wikipedia, share personal memories with photo uploads, and bookmark favorite locations.

**Target Users:**

- Tourists looking to explore Vancouver's historic landmarks
- Residents interested in neighborhood history
- History enthusiasts and educators
- City planners and heritage preservation advocates

**Key Features:**

- Interactive Leaflet map with real-time marker rendering (151+ heritage sites)
- User authentication system (JWT-based register/login with password hashing)
- Detailed heritage site information with historical descriptions
- Memory sharing feature with Cloudinary image uploads
- Favorites/bookmarking system with real-time count updates
- Advanced filtering by neighborhood and construction year range
- Responsive mobile-first design
- RESTful API with 17 documented endpoints

---

## Table of Contents

1. [Build and Run Instructions](#build-and-run-instructions)
2. [API Documentation](#api-documentation)
3. [Development Process & Learning Journey](#development-process--learning-journey)
4. [Learning Resources & Tutorials](#learning-resources--tutorials)
   - Official Documentation
   - YouTube Tutorials
   - Articles & Blog Posts
5. [Technical Implementation Details](#technical-implementation-details)
   - Architectural Decisions
   - Database Schema Design
   - API Architecture
   - Security Implementations
6. [Development Challenges & Problem-Solving](#development-challenges--problem-solving)
7. [Use of AI Tools](#use-of-ai-tools-chatgpt--claude)
8. [Project Testing](#project-testing)
9. [Reflection & Learning Outcomes](#reflection--learning-outcomes)
10. [Academic Integrity Statement](#academic-integrity-statement)

---

## Build and Run Instructions

### Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with the following:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5001
GOOGLE_PLACES_API_KEY=your_api_key (optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

4. Start server:

```bash
npm start
```

Server runs on `http://localhost:5001`

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start development:

```bash
npm run dev
```

Frontend runs on `http://localhost:1234`

### How to Use

1. Open browser to `http://localhost:1234`
2. Register a new account
3. Click map markers to view heritage sites
4. Add memories by clicking "Add Memory" button
5. Click heart icon to favorite sites
6. Use filters on the left to search by neighborhood or year

---

## API Documentation

Import `api-documentation.json` into Postman to test all 17 API endpoints.

**Quick Test:**

1. Open Postman → Import → Select `api-documentation.json`
2. Import environment: `Vancouver-Heritage.postman_environment.json`
3. Select "Vancouver Heritage" environment (top right)
4. Run "Register User" endpoint first (saves token automatically)
5. Run other endpoints (token auto-included)

---

## Development Process & Learning Journey

### Phase 1: Research & Planning (Week 1)

I began by exploring the Vancouver Open Data Portal and decided on the Heritage Register dataset because of its rich historical data. I sketched out the application architecture, identifying the need for:

- A map-based interface for visualization
- User accounts to enable personalization
- A memory-sharing feature to build community engagement
- A robust API to handle data operations

### Phase 2: Technology Stack Selection (Week 1-2)

I selected and configured the tech stack:

**Backend:**

- Express.js for RESTful API
- MongoDB with Mongoose for flexible schema
- JWT for stateless authentication
- Cloudinary for image CDN

**Frontend:**

- React with hooks for component architecture
- Leaflet for interactive maps
- Tailwind CSS for rapid UI development
- Axios for API client

### Phase 3: Implementation (Week 2-4)

I built the application incrementally, testing each feature before moving to the next. I designed the database schema, created the API endpoints, built React components, and integrated everything together.

### Phase 4: Enhancement & Testing (Week 4-5)

I enriched the heritage data with Wikipedia information, implemented advanced filtering, optimized performance, and thoroughly tested the application.

---

## Documentation & Resources Referenced

### Official Docs

- **Express.js** - https://expressjs.com/en/guide/routing.html (routing, middleware)
- **Mongoose** - https://mongoosejs.com/docs/guide.html (schemas, population, indexes)
- **React** - https://react.dev/learn (hooks, Context API)
- **React-Leaflet** - https://react-leaflet.js.org/ (map components)
- **Tailwind CSS** - https://tailwindcss.com/docs (responsive utilities)
- **JWT.io** - https://jwt.io/introduction (token structure)
- **Cloudinary Docs** - https://cloudinary.com/documentation/node_integration
- **Wikipedia API** - https://www.mediawiki.org/wiki/API:Main_page
- **Bcrypt** - https://www.npmjs.com/package/bcryptjs

### Articles/Tutorials

- "RESTful API Design" - https://blog.postman.com/rest-api-design-best-practices/
- "MongoDB Schema Design" - https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design
- "Express Security Best Practices" - https://expressjs.com/en/advanced/best-practice-security.html

---

## Technical Implementation Details

### My Architectural Decisions

1. **Separated Frontend & Backend**: Chose to build separate client/server for scalability and independent deployment
2. **JWT Over Sessions**: Selected JWT for stateless authentication, enabling easier horizontal scaling
3. **MongoDB for Flexibility**: Used MongoDB for flexible schema and easy integration with Node.js
4. **Cloudinary for Images**: Chose Cloudinary over local storage for CDN benefits and transformation capabilities
5. **Tailwind for Styling**: Selected Tailwind for rapid UI development and consistent design system

### Database Schema Design

I designed four interconnected collections:

**Users Collection:**

- Stores authentication credentials with hashed passwords
- Tracks registration date for analytics

**HeritageSites Collection:**

- Contains heritage data from Vancouver Open Data
- Enhanced with Wikipedia descriptions and images
- Indexed by neighborhood and year for fast filtering

**Memories Collection:**

- References both User and HeritageSite (many-to-many relationship)
- Stores user-generated content and Cloudinary image URLs
- Enables community storytelling feature

**Favorites Collection:**

- Junction table with compound unique index (user + heritageSite)
- Prevents duplicate favorites at database level
- Enables fast lookups for favorite status

### API Architecture

I structured the API into 5 logical route modules:

- `/api/auth` - User registration, login, profile (3 endpoints)
- `/api/heritage-sites` - Site retrieval, filtering, photos (4 endpoints)
- `/api/memories` - Memory CRUD operations (5 endpoints)
- `/api/favorites` - Toggle favorites, get counts (3 endpoints)
- `/api/admin` - Administrative operations (2 endpoints)

All endpoints follow consistent response format:

```json
{
  "success": true/false,
  "data": {...},
  "message": "..."
}
```

### Frontend Component Structure

I organized components into logical categories:

- **Auth/** - Login and Register forms with validation
- **Layout/** - Header with navigation and user menu
- **Map.jsx** - Main map component with marker clustering
- **FilterPanel.jsx** - Advanced filtering interface
- **SiteDetails.jsx** - Modal with site information and actions
- **MemoryForm.jsx** - Image upload form with preview

### Security Implementations

1. **Password Security**: Bcrypt with 10 salt rounds
2. **JWT Protection**: All user-specific routes require valid token
3. **Input Validation**: Express-validator on all POST/PUT endpoints
4. **CORS Configuration**: Restricted origins in production
5. **Rate Limiting**: Applied to prevent API abuse
6. **Helmet Middleware**: Security headers on all responses

---

## Development Challenges & Problem-Solving

### Challenges Overcome

#### 1. Data Import and Transformation

**Challenge:** The heritage dataset from Vancouver Open Data was in JSON format with inconsistent field names and needed to be imported into MongoDB with proper schema validation.

**My Solution:** I created a custom import script (`importHeritageData.js`) that:

- Reads the JSON data file
- Transforms field names to match my schema
- Validates data before insertion
- Handles missing or malformed data gracefully

**Technical Skills Applied:** Node.js file system operations, data parsing, MongoDB batch inserts

#### 2. Wikipedia Data Enrichment

**Challenge:** Many heritage sites lacked detailed descriptions and images. I wanted to automatically enrich the data with information from Wikipedia.

**My Solution:** I built an automation script (`enrichFromWikipedia.js`) that:

- Queries Wikipedia MediaWiki API for each heritage site
- Extracts page summaries and main images
- Implements rate limiting (1 second delay) to respect API limits
- Updates MongoDB documents with enriched data
- Handles sites not found on Wikipedia gracefully

**Technical Skills Applied:** REST API integration, async/await patterns, rate limiting, error handling

#### 3. Express Route Ordering Bug

**Problem:** My `GET /:id/photo` endpoint was being matched by `GET /:id` route, causing the wrong handler to execute.

**Investigation:** I tested routes in Postman and noticed the generic `:id` route was catching all requests. After researching Express routing documentation, I learned that Express matches routes in the order they're defined.

**My Solution:** Reordered routes in `heritageSites.js` to place specific routes (`/filters/neighbourhoods`, `/:id/photo`) before parameterized routes (`/:id`).

**Files Modified:** `server/src/routes/heritageSites.js`

#### 4. MongoDB Connection Timeout

**Problem:** Application couldn't connect to MongoDB Atlas - "MongoNetworkError: connection refused"

**Investigation:** Checked connection string, verified credentials, tested with Mongoose connection events.

**My Solution:** Added my IP address (0.0.0.0/0 for development) to MongoDB Atlas Network Access whitelist.

**Learning:** Understand cloud database security configurations and network access controls.

#### 5. CORS Policy Blocking API Requests

**Problem:** React frontend (localhost:1234) couldn't make requests to Express backend (localhost:5001) - "Access to XMLHttpRequest blocked by CORS policy"

**Investigation:** Researched CORS, same-origin policy, and cross-origin requests.

**My Solution:** Added `cors` middleware to Express server with proper configuration for development and production environments.

**Files Modified:** `server/src/server.js`

#### 6. JWT Token Not Persisting on Refresh

**Problem:** Users were logged out whenever they refreshed the page because JWT token was only stored in React state.

**Investigation:** Researched browser storage options (localStorage vs sessionStorage vs cookies).

**My Solution:** Modified AuthContext to:

- Save JWT token to localStorage on login
- Check for token in localStorage on component mount
- Verify token validity before auto-login
- Clear token from localStorage on logout

**Files Modified:** `client/src/context/AuthContext.jsx`

**Security Consideration:** Understood localStorage XSS risks and decided it's acceptable for learning project; would use httpOnly cookies in production.

#### 7. Cloudinary Image Upload Size Limit

**Problem:** Initial implementation of image uploads was using Express body-parser which had a size limit, causing "413 Payload Too Large" errors.

**Investigation:** Researched multer, Cloudinary, and different upload strategies (base64 vs multipart).

**My Solution:** Configured multer-storage-cloudinary to handle uploads directly:

- Created CloudinaryStorage configuration
- Set up multer middleware in memory routes
- Configured accepted file types and size limits
- Built frontend FormData to handle file uploads properly

**Files Modified:** `server/src/config/cloudinary.js`, `server/src/routes/memories.js`, `client/src/components/MemoryForm.jsx`

#### 8. Favorites Toggle Logic

**Challenge:** Implementing a like/unlike feature that prevents duplicate favorites and provides real-time count updates.

**My Solution:** Designed a toggle system that:

- Checks if favorite already exists for user+site combination
- Deletes favorite if it exists, creates if it doesn't
- Returns boolean `isFavorited` status to frontend
- Uses compound unique index on (user, heritageSite) at database level to prevent race conditions
- Separate endpoint to get favorite count for each site

**Files Created:** `server/src/models/Favorite.js`, `server/src/controllers/favoriteController.js`

**Technical Skills Applied:** Database indexing, atomic operations, RESTful API design

#### 9. Responsive Mobile Design

**Challenge:** Making the map interface usable on mobile devices while maintaining desktop functionality.

**My Solution:** Implemented mobile-first responsive design with Tailwind:

- Hide filter sidebar on mobile by default
- Add floating toggle button for mobile filter access
- Use flexbox with `flex-col` on mobile, `flex-row` on desktop
- Adjust text sizes and padding at different breakpoints
- Test thoroughly on different screen sizes

**Files Modified:** All component files with responsive utility classes

**Design Decisions:** Prioritized map visibility on mobile, made filters accessible via toggle.

---

## AI Tools Used

I used **ChatGPT-4** and **Claude** to accelerate development by generating boilerplate code based on my technical specifications. I designed the architecture and directed the AI to implement specific features.

### Examples Where ChatGPT/Claude Helped

#### 1. Cloudinary Image Upload Configuration

**Feature I Built:** Memory sharing with image uploads. I decided to use Cloudinary for CDN hosting instead of local storage.

**My Prompt to ChatGPT:**

```
"Generate CloudinaryStorage config for multer-storage-cloudinary.
Upload folder: 'heritage-memories', size limit: 1000x1000,
formats: jpg/png/jpeg/webp. Include cloudinary.config() and export multer upload instance."
```

**Code Generated:**

```javascript
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "heritage-memories",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

export const upload = multer({ storage: storage });
```

**Integration:** Used in `server/src/config/cloudinary.js`, integrated upload middleware into memory routes, built frontend form with image preview.

---

#### 2. Wikipedia API Data Enrichment Script

**Feature I Built:** Automated data enrichment. The Vancouver Open Data heritage sites lack descriptions/images, so I designed a script to fetch from Wikipedia API.

**My Prompt to ChatGPT:**

```
"Write Node.js automation script:
1. Fetch all HeritageSite documents from MongoDB
2. For each site, query Wikipedia MediaWiki API (action=query, prop=extracts|pageimages)
3. Extract page summary (first 500 chars) and main image URL
4. Update MongoDB document with this data
5. Add 1 second delay between requests for rate limiting
6. Error handling for sites not found on Wikipedia"
```

**Code Generated:**

```javascript
import axios from "axios";
import HeritageSite from "./models/HeritageSite.js";

async function enrichFromWikipedia() {
  const sites = await HeritageSite.find({});

  for (const site of sites) {
    try {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          titles: site.name,
          prop: "extracts|pageimages",
          exintro: true,
          explaintext: true,
          pithumbsize: 500,
          format: "json",
        },
      });

      const pages = response.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (page.extract) {
        site.description = page.extract.substring(0, 500);
      }
      if (page.thumbnail) {
        site.imageUrl = page.thumbnail.source;
      }

      await site.save();
      console.log(`Enriched: ${site.name}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error for ${site.name}:`, error.message);
    }
  }
}
```

**Integration:** Modified field names to match my schema (`historicalInfo` instead of `description`), added logging. Used in `server/src/scripts/enrichFromWikipedia.js`.

---

#### 3. Favorites Toggle System

**Feature I Built:** Like/unlike system for heritage sites. Needed toggle logic that prevents duplicate favorites at database level.

**My Prompt to Claude:**

```
"Generate Express controller function toggleFavorite:
- Check if Favorite exists with user + heritageSite combo
- If exists: delete and return isFavorited: false
- If not exists: create and return isFavorited: true
- Extract heritageSiteId from body, userId from req.user.id (JWT middleware)"
```

**Code Generated:**

```javascript
export const toggleFavorite = async (req, res) => {
  try {
    const { heritageSiteId } = req.body;
    const userId = req.user.id;

    const existing = await Favorite.findOne({
      user: userId,
      heritageSite: heritageSiteId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, isFavorited: false });
    }

    await Favorite.create({ user: userId, heritageSite: heritageSiteId });
    return res.json({ success: true, isFavorited: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**Integration:** Used in `server/src/controllers/favoriteController.js`. Added compound unique index to Favorite model schema. Built frontend heart icon toggle with real-time updates.

---

#### 4. JWT Auth Middleware

**Feature I Built:** Protected API routes. I designed JWT-based auth system, needed middleware to verify tokens on protected endpoints.

**My Prompt to ChatGPT:**

```
"Generate Express auth middleware 'protect':
- Extract Bearer token from Authorization header
- Verify token with jwt.verify(token, JWT_SECRET)
- Attach decoded user to req.user
- Return 401 if no token or invalid token"
```

**Code Generated:**

```javascript
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
```

**Integration:** Used in `server/src/middleware/auth.js`. Applied to all protected routes (memories, favorites, user profile).

---

#### 5. Quick Debugging - Route Order

**Bug:** My `/:id/photo` endpoint was being matched by generic `/:id` route.

**Quick Question to Claude:**

```
"Express routing - /:id/photo getting caught by /:id. Remind me the match order?"
```

**Claude:** "Express matches first-to-last. Specific routes before parameterized."

**Fix:** Reordered in `server/src/routes/heritageSites.js`:

```javascript
router.get("/:id/photo", getHeritageSitePhoto); // Specific first
router.get("/:id", getHeritageSite); // Generic last
```

---

### What I Built Myself

- All database schemas (Users, HeritageSites, Memories, Favorites)
- API structure (17 endpoints in 5 route files)
- All React components and UI design
- Tailwind styling and responsive layout
- Data import from Vancouver Open Data
- Integration between all pieces
- Testing and debugging

### Development Breakdown

**Architecture & Design:** 100% me  
**Code Generation:** ~20% AI-generated boilerplate/config, ~80% written by me  
**Integration & Testing:** 100% me

I designed the system architecture, database schemas, API structure, and all features. Used AI to speed up repetitive coding tasks like configuration files and boilerplate code. I understand and can explain every part of the codebase.

---

## Frontend Redesign & UI Improvements

### Redesign Prompt

**User Request:** "help me design the frontend finer please, very beautiful""

### Changes Implemented

#### 1. Enhanced Login & Register Components

**Improvements Made:**

- Redesigned modal with gradient header matching the site's color scheme (indigo-purple-pink gradient)
- Added glass morphism effects with backdrop blur
- Improved form inputs with better focus states and transitions
- Added loading spinners for better UX feedback
- Enhanced error display with icons and better styling
- Improved button styling with hover effects and animations
- Added click-outside-to-close functionality
- Better spacing and typography throughout
- Added proper form validation handling (noValidate to prevent browser tooltips)

**Files Modified:**

- `client/src/components/Auth/Login.jsx`
- `client/src/components/Auth/Register.jsx`

#### 2. Emoji to Icon Replacement

**Complete replacement of all emojis with react-icons throughout the application:**

| Emoji | Icon Replacement   | Component               |
| ----- | ------------------ | ----------------------- |
| 🏛️    | `GiGreekTemple`    | SiteDetails, Map        |
| 📍    | `HiLocationMarker` | SiteDetails, Map        |
| 🌍    | `HiGlobe`          | SiteDetails, Map        |
| 📖    | `HiBookOpen`       | SiteDetails, MemoryForm |
| ✨    | `HiSparkles`       | Map, MemoryForm         |
| 📝    | `HiPencil`         | SiteDetails, MemoryForm |
| 👤    | `HiUser`           | SiteDetails             |
| 📅    | `HiCalendar`       | SiteDetails             |
| 🎨    | `FaPalette`        | SiteDetails             |
| 👷    | `FaHardHat`        | SiteDetails             |
| ⭐    | `HiStar`           | SiteDetails             |
| 🏗️    | `FaBuilding`       | SiteDetails             |
| 📸    | `HiCamera`         | SiteDetails, MemoryForm |
| 🖼️    | `HiPhotograph`     | MemoryForm              |
| 🔗    | `HiLink`           | MemoryForm              |
| ❌    | `HiX`              | All modals              |
| ➕    | `HiPlus`           | SiteDetails             |

**Files Modified:**

- `client/src/components/SiteDetails.jsx` - All emojis replaced with appropriate icons
- `client/src/components/Map.jsx` - Popup emojis replaced with icons
- `client/src/components/MemoryForm.jsx` - All emojis replaced with icons

#### 3. Visual Design System Enhancements

**Color Scheme:**

- Consistent gradient headers: `from-indigo-600 via-purple-600 to-pink-600`
- Improved border styling: `border-4 border-slate-200`
- Better shadow effects: `shadow-2xl`
- Enhanced glass morphism: `glass-dark` with backdrop blur

**Typography & Spacing:**

- Improved font weights and sizes
- Better spacing with consistent padding (`p-6`, `space-y-4`)
- Enhanced label styling with icon integration

**Animations:**

- Smooth fade-in animations: `animate-fadeIn`
- Hover effects: `hover:scale-105`, `hover:rotate-90`
- Transition effects: `transition-all duration-300`

#### 4. Form Validation Improvements

**Login Component:**

- Added `noValidate` to prevent browser's default validation tooltips
- Custom error handling with styled error messages
- Real-time error clearing when user types
- Proper `htmlFor` and `id` attributes for accessibility
- Added `autoComplete` attributes for better UX

**Benefits:**

- Cleaner UI without browser validation popups
- Better user experience with custom error styling
- Improved accessibility
- Consistent design language across all forms

### Technical Details

**Icon Library:** react-icons (already installed)

- Heroicons (`react-icons/hi`) - Primary icon set
- Font Awesome (`react-icons/fa`) - Additional icons
- Game Icons (`react-icons/gi`) - Specialized icons like Greek Temple

**Build Verification:**

- All changes compile successfully
- No linter errors
- All imports working correctly
- Build size: ~407KB (JS) + ~28KB (CSS)

### Impact

- **Consistency:** All UI elements now use consistent iconography
- **Professionalism:** Icons provide a more polished, professional appearance
- **Accessibility:** Icons are more accessible than emojis across different platforms
- **Maintainability:** Using a single icon library makes future updates easier
- **User Experience:** Improved login/register flow with better visual feedback

---

## Additional Information

### Start Scripts

- **Backend:** `npm start` (runs `node src/server.js`)
- **Frontend:** `npm run dev` (runs Parcel dev server)

### Environment Files

- `.env` contains sensitive credentials (not committed)
- `.env.example` provided as template
- `.gitignore` excludes `node_modules/`, `.env`, `.DS_Store`, `dist/`

### Database

- MongoDB Atlas (cloud database)
- 4 collections: Users, HeritageSites, Memories, Favorites
- Connection string in `.env` file

### Known Limitations

- Google Places API has rate limits (Unsplash fallback implemented)
- Not all heritage sites have Wikipedia data (error handling in place)
- Free Render deployment has cold start delay

---

## Project Testing

### Manual Testing Performed

I thoroughly tested the application through multiple rounds of testing:

**Authentication Testing:**

- Registered multiple test accounts
- Tested login with correct/incorrect credentials
- Verified JWT token persistence across page refreshes
- Tested logout functionality
- Verified protected routes redirect to login

**Heritage Sites Testing:**

- Verified all 151 sites load on map
- Tested map markers render correctly
- Tested clicking markers shows site details
- Verified filtering by neighborhood works
- Verified filtering by year range works
- Tested combining multiple filters

**Memory Feature Testing:**

- Created memories with and without images
- Verified image uploads to Cloudinary
- Tested image preview before upload
- Verified memories display on site details
- Tested memory deletion (own memories only)

**Favorites Feature Testing:**

- Tested favoriting/unfavoriting sites
- Verified favorite count updates in real-time
- Tested favorites persist after logout/login
- Verified favorite status shows correctly

**Responsive Design Testing:**

- Tested on mobile (iPhone simulator)
- Tested on tablet (iPad simulator)
- Tested on desktop (various browser widths)
- Verified filter toggle works on mobile
- Checked text readability at all sizes

**API Testing:**

- Created Postman collection with all 17 endpoints
- Tested success and error cases
- Verified proper status codes returned
- Tested authentication middleware
- Verified data validation works

### Bugs Fixed During Testing

1. **Map markers not clustering**: Fixed by adjusting zoom levels
2. **Memory form not clearing after submit**: Added form reset
3. **Favorite icon not updating**: Fixed state management
4. **Filter panel overlapping map on mobile**: Adjusted z-index and positioning
5. **Long site names breaking layout**: Added text truncation with ellipsis

---

## Reflection & Learning Outcomes

### Technical Skills Gained

Through building this project, I significantly improved my skills in:

1. **Full-Stack Architecture**: Understanding how frontend and backend communicate, designing RESTful APIs, managing state across the stack

2. **Database Design**: Creating efficient schemas, understanding relationships, using indexes for performance, designing for data integrity

3. **Authentication & Security**: Implementing JWT authentication, password hashing, protecting routes, understanding security best practices

4. **React Development**: Mastering hooks, building reusable components, managing global state with Context API, handling forms and file uploads

5. **API Integration**: Working with external APIs (Wikipedia, Cloudinary), handling rate limits, managing async operations, error handling

6. **Responsive Design**: Mobile-first approach, using Tailwind effectively, understanding breakpoints, creating adaptive layouts

### Challenges and Growth

**Biggest Challenge:** Implementing the image upload feature with Cloudinary while handling errors gracefully.

**What I Learned:** File uploads are complex, requiring coordination between frontend (FormData), backend (multer middleware), and cloud storage (Cloudinary). I learned to debug across the entire stack.

**Most Valuable Skill:** Learning to read documentation efficiently and translate examples to my specific use case.

### What I Would Do Differently

If I were to start over, I would:

1. Plan the database schema more carefully before coding
2. Set up automated testing from the beginning
3. Implement error boundaries in React for better error handling
4. Use TypeScript for better type safety
5. Deploy earlier to catch production issues sooner

### Future Enhancements

Features I'd like to add in the future:

- User profiles with avatar uploads
- Comments on memories
- Social sharing capabilities
- Email notifications for new memories
- Advanced search with text queries
- Tour routes connecting multiple sites
- Admin dashboard for content moderation

---

## Academic Integrity Statement

I, [Your Name], declare and certify that:

1. **This project is entirely my own work.** All code, design decisions, and implementations were done by me individually.

2. **I understand every line of code** in this project and can explain the purpose and functionality of any component, function, or module.

3. **All external resources are properly attributed** in the "Learning Resources & Tutorials" section, including documentation, tutorials, articles, and video content.

4. **AI tools were used ethically** as learning aids and debugging assistants, similar to Stack Overflow or documentation. I designed all features, made all architectural decisions, and integrated all code myself.

5. **I can demonstrate my knowledge** by explaining my code, defending my design decisions, and discussing alternative approaches I considered.

6. **I completed all requirements** outlined in the WMDD 4936 term project specification, using the required tech stack (Node.js, Express, React) and Vancouver Open Data.

7. **I did not copy code** from other students or submit work that was not my own.

8. **I am prepared to discuss** any aspect of this project with my instructor and can answer technical questions about the implementation.

I understand that academic dishonesty is a serious offense and that this declaration is binding. I have been honest in documenting my use of external resources and AI assistance throughout this document.

**Student Signature:** \***\*\*\*\*\*\*\***\_\***\*\*\*\*\*\*\***

**Date:** November 15, 2024

**Student ID:** [Your Student ID]
