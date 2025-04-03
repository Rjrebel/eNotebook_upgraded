# eNotebook - MERN Stack Note Application

A modern note-taking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Create, read, update, and delete notes
- Rich text editing
- Note categorization
- Search functionality
- Responsive design
- User authentication (coming soon)

## Project Structure

```
enotebook/
├── client/             # React frontend
├── server/             # Node.js backend
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server (in a new terminal)
   cd client
   npm start
   ```

5. Open http://localhost:3000 in your browser

## Technologies Used

- Frontend:
  - React.js
  - Material-UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT (for authentication) 