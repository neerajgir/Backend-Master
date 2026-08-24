# OpenTube - YouTube Clone API

A full-stack YouTube clone built with Express.js and React, featuring video upload, streaming, comments, and user authentication.

## Tech Stack

**Backend**
- Node.js with Express 5
- MongoDB (Mongoose)
- Cloudinary (video & thumbnail hosting)
- JWT authentication
- bcrypt for password hashing

**Frontend**
- React 18 + Vite
- React Router DOM
- Custom CSS design tokens

## Project Structure

```
Youtube-Api/
├── Backend/
│   ├── config/
│   │   ├── db.config.js       # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary media uploads
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   └── comment.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   └── comment.route.js
│   ├── .env
│   └── index.js
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── auth/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── util.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Watch.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── Studio.jsx
│   │   ├── styles/
│   │   │   ├── app.css
│   │   │   ├── tokens.css
│   │   │   └── stamp.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## API Endpoints

### User Routes (`/api/v1/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |
| GET | `/logout` | Logout user |
| GET | `/profile` | Get current user profile |

### Video Routes (`/api/v1/video`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload video & thumbnail |
| GET | `/` | Get all videos |
| GET | `/:id` | Get video by ID |
| DELETE | `/:id` | Delete video |
| POST | `/:id/views` | Increment view count |

### Comment Routes (`/api/v1/comment`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Add comment to video |
| GET | `/video/:videoId` | Get all comments for a video |
| DELETE | `/:id` | Delete a comment |

All write endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - video feed with search |
| `/login` | User login |
| `/signup` | User registration |
| `/watch/:id` | Video player page |
| `/upload` | Video upload page |
| `/studio` | Creator dashboard |

## Scripts

```bash
# Backend
cd Backend && npm run dev     # Start development server with nodemon

# Frontend
cd Frontend && npm run dev    # Start Vite dev server
cd Frontend && npm run build  # Build for production
cd Frontend && npm run preview # Preview production build
```
