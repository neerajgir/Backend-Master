# 🚀 Backend Master - Learning Repository

## 📖 Introduction

Welcome to **Backend Master**, my comprehensive learning repository for backend development! This repository contains hands-on projects, tutorials, and code snippets covering modern backend technologies. I'm building this as a personal knowledge base to master server-side development, APIs, databases, and real-time applications.

## 🛠️ Tech Stack Covered

| Category | Technologies |
|----------|------------|
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Real-time** | Socket.io, WebSockets |
| **Frontend** | React, Vite, Tailwind CSS |
| **Authentication** | JWT, Cloudinary, bcrypt |
| **Database** | MongoDB with Mongoose schemas |
| **State Management** | Zustand, React Context |

## 📁 Project Structure

```
Advance Backend/
├── ChatApp/              # Full-stack MERN chat application
│   ├── backend/          # Express + Socket.io server
│   └── frontend/         # React + Vite client
├── ExpressJS/            # Express.js fundamentals
├── NodeJS/               # Node.js basics & concepts
├── WebSockets/           # Real-time communication
├── Authentication/       # Auth systems & security
├── Cryptography/         # Encryption & hashing
├── Statefull/           # State management techniques
├── Stateless/           # Stateless design patterns
└── MongoDB/              # Database operations
```

## 🚀 Getting Started

### Prerequisites

```bash
# Install Node.js
# Install MongoDB (local or Atlas)
# Install Git
```

### Clone the Repository

```bash
git clone https://github.com/your-username/backend-master.git
cd backend-master
```

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd ChatApp/backend
npm install

# Install frontend dependencies
cd ChatApp/frontend
npm install
```

### Run the Projects

```bash
# Development mode - backend
cd ChatApp/backend
npm run dev

# Development mode - frontend  
cd ChatApp/frontend
npm run dev
```

## 🌟 Featured Topics & Code Snippets

### 1. Express.js Route Handler with Async Error Handling

```javascript
// Express.js error-handling middleware pattern
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Usage
router.get("/users", asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
  });
}));
```

### 2. MongoDB Mongoose Schema with Validation

```javascript
// Message model with validation
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Message content is required"],
    trim: true,
    minlength: [1, "Message cannot be empty"],
    maxlength: [500, "Message cannot exceed 500 characters"],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: {
    type: String,
    validate: {
      validator: (url) => url.startsWith("https://"),
      message: "Image URL must be a valid HTTPS link",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
```

### 3. Socket.io Real-time Communication

```javascript
// Socket.io server setup
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join chat room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Send message
  socket.on("send-message", (data) => {
    io.to(data.room).emit("receive-message", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
```

### 4. JWT Authentication Middleware

```javascript
// Auth middleware to protect routes
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
```

### 5. Cloudinary Image Upload

```javascript
// Cloudinary upload configuration
import cloudinary from "cloudinary.v2";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat-app",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export const upload = multer({ storage });
```

### 6. React Component with Zustand State Management

```javascript
// Chat store using Zustand
import create from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),

  setUsers: (users) => set({ users }),
  addUser: (user) =>
    set((state) => ({ users: [...state.users, user] })),
}));
```

### 7. Tailwind CSS Configuration

```javascript
// vite.config.js with Tailwind
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: [
      tailwindcss(),
      autoprefixer(),
    ],
  },
});
```

### 8. Axios Interceptor for API Calls

```javascript
// axios.js - API client with interceptors
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authority = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 📚 Learning Path

### Phase 1: Node.js Fundamentals
- File system operations (fs module)
- Event loop & asynchronous programming
- Process management
- CLI argument handling

### Phase 2: Express.js & API Development
- Route planning & middleware
- Request validation
- Error handling strategies
- RESTful API design

### Phase 3: Database & Persistence
- MongoDB schema design
- Mongoose population & queries
- Indexing for performance
- Data validation

### Phase 4: Authentication & Security
- JWT implementation
- Password hashing (bcrypt)
- Role-based access control
- Input sanitization

### Phase 5: Real-time Features
- Socket.io integration
- Room-based communication
- Event emission patterns
- Connection management

### Phase 6: Full-Stack Integration
- Frontend-Backend communication
- State management
- UI/UX considerations
- Deployment preparation

## 🤝 Contributing

Feel free to fork this repository and add your own topics! Pull requests are welcome.

1. Fork the repo
2. Create a new branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your changes (`git commit -m 'Add some AwesomeFeature'`)
4. Push to the branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

## 📧 Contact

**Neeraj** - [GitHub](https://github.com/neerajgir)

Project Link: [https://github.com/neerajgir/backend-master](https://github.com/neerajgir/backend-master)

---

⭐ **Star this repo** if you find it helpful for your learning journey!