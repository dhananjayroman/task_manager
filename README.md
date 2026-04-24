# Product Space Assignment - Full Stack Project

This is a full-stack application with a React frontend and a Node.js backend.

## Project Structure

- `client/`: React frontend (Vite + Tailwind CSS)
- `server/`: Node.js backend (Express + Sequelize)

## Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database in the `.env` file (copied from `.env.example`).
4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

## Folder Structure Details

### Frontend (client/src)
- `components/`: UI components
- `pages/`: Page-level components
- `hooks/`: Custom hooks
- `services/`: API calls
- `context/`: State management
- `assets/`: Static assets

### Backend (server)
- `config/`: Configuration (database, etc.)
- `models/`: Sequelize models
- `controllers/`: Logic for handling routes
- `routes/`: API route definitions
- `middleware/`: Express middleware
- `utils/`: Helper functions
