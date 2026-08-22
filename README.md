# Agency Platform

This is the foundation and architecture for the Video Editing Agency Platform. It uses the MERN stack with Tailwind CSS and Firebase.

## Getting Started

Follow these steps to run the frontend and backend servers simultaneously.

### 1. Start the Backend

Open a terminal and navigate to the `backend` folder:
```bash
cd backend
npm run dev # or node index.js
```
The backend server runs on `http://localhost:5000`.

### 2. Start the Frontend

Open a second terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm run dev
```
The frontend Vite server runs on `http://localhost:5173` (or the port specified by Vite).

### Notes
- **Database**: Ensure MongoDB is running locally (default URI `mongodb://localhost:27017/video-agency` is specified in `backend/.env`).
- **Firebase**: Replace placeholder credentials in `frontend/src/lib/firebase.js` with your actual Firebase project configuration before using authentication features.
