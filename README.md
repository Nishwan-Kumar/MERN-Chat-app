# 💬 MERN Chat App

A **full-stack real-time chat application** built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. Users can sign up, log in, update their profile, change themes, and exchange messages in real-time — with live online-presence indicators.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure sign-up, login, and logout using HTTP-only cookies
- 💬 **Real-time Messaging** — Instant messaging powered by Socket.IO
- 🟢 **Online Presence** — See which users are currently online
- 🖼️ **Image Sharing** — Send images in chat (uploaded via Cloudinary)
- 👤 **Profile Management** — Update profile picture with crop support
- 🎨 **Theme Switcher** — Multiple UI themes via DaisyUI
- 📱 **Responsive Design** — Mobile-friendly layout with Tailwind CSS

---

## 🗂️ Project Structure

```
PR-1 Chat App/
├── backend/
│   └── src/
│       ├── controllers/        # Route handler logic
│       ├── lib/
│       │   ├── db.js           # MongoDB connection
│       │   ├── Socket.js       # Socket.IO server setup
│       │   ├── cloudinary.js   # Cloudinary config
│       │   └── utils.js        # JWT token generation
│       ├── middleware/         # Auth middleware
│       ├── models/
│       │   ├── user.model.js   # User schema
│       │   └── message.model.js# Message schema
│       ├── routes/
│       │   ├── auth.route.js   # /api/auth
│       │   └── message.route.js# /api/messages
│       └── index.js            # Express + Socket.IO entry point
└── frontend/
    └── src/
        ├── components/         # Reusable UI components
        ├── pages/              # App pages (Home, Login, SignUp, Profile, Settings)
        ├── store/              # Zustand global state
        ├── lib/                # Axios instance & helpers
        ├── constants/          # Theme & other constants
        └── utils/              # Utility functions
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | Real-time bidirectional communication |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Cloud image storage |
| cookie-parser | HTTP cookie handling |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite | Build tool & dev server |
| Tailwind CSS + DaisyUI | Styling & theme system |
| Zustand | Global state management |
| Socket.IO Client | Real-time communication |
| Axios | HTTP requests |
| React Router DOM 7 | Client-side routing |
| Framer Motion | Animations |
| react-easy-crop | Profile picture cropping |
| react-hot-toast | Toast notifications |
| lucide-react | Icons |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/Nishwan-Kumar/MERN-Chat-app.git
cd MERN-Chat-app
```

### 2. Configure environment variables

Create a `.env` file inside the `backend/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
PORT=5001
```

### 3. Install dependencies & run

#### Development (run backend and frontend separately)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

- Backend runs at: `http://localhost:5001`
- Frontend runs at: `http://localhost:5173`

#### Production build (from root)

```bash
npm run build    # Installs deps and builds frontend
npm start        # Starts the backend server (serves built frontend)
```

---

## 🔌 API Routes

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login and receive JWT cookie |
| POST | `/logout` | Logout and clear cookie |
| PUT | `/update-profile` | Update profile picture |
| GET | `/check` | Check authentication status |

### Messages — `/api/messages`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users for the sidebar |
| GET | `/:id` | Get conversation with a specific user |
| POST | `/send/:id` | Send a message to a user |

---

## 📦 Available Scripts

### Root
| Script | Description |
|---|---|
| `npm run build` | Install all deps and build the frontend |
| `npm start` | Start the production backend server |

### Backend (`/backend`)
| Script | Description |
|---|---|
| `npm run dev` | Start backend with nodemon (hot reload) |
| `npm start` | Start backend with node |

### Frontend (`/frontend`)
| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 📄 License

This project is licensed under the **ISC License**.
