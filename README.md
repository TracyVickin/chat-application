# Chat Application

A full-stack chat application built with Next.js, Express.js, and PostgreSQL. Features a clean Material-UI interface with real-time messaging, conversation management, and a chatbot integration.

## Features

- **Real-time Chat Interface**: Clean, modern chat UI with user and bot message differentiation
- **Conversation Management**: Create, delete, and manage multiple conversations
- **Responsive Design**: Material-UI components with custom styling
- **Database Integration**: PostgreSQL with Prisma ORM
- **RESTful API**: Express.js backend with Swagger documentation
- **Type Safety**: Full TypeScript implementation
- **Docker Support**: Containerized deployment with Docker Compose

## Project Structure

chat-application/
├── backend/ # Express.js API server
│ ├── prisma/ # Database schema and migrations
│ │ ├── migrations/ # Database migration files
│ │ └── schema.prisma # Prisma schema definition
│ ├── server.ts # Main server file
│ ├── swagger.json # API documentation
│ ├── package.json # Backend dependencies
│ └── Dockerfile # Backend container config
├── frontend/ # Next.js React application
│ ├── app/ # Next.js 13+ app directory
│ │ ├── components/ # React components
│ │ │ ├── ChatScreen.tsx # Main chat interface
│ │ │ ├── Conversations.tsx # Conversation list sidebar
│ │ │ └── ConfirmModal.tsx # Delete confirmation modal
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # Root layout component
│ │ └── page.tsx # Home page
│ ├── public/ # Static assets
│ │ ├── chatbot-image.svg # Bot avatar
│ │ └── user-image.svg # User avatar
│ ├── package.json # Frontend dependencies
│ └── Dockerfile # Frontend container config
├── docker-compose.yml # Multi-container setup
└── README.md # This file

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Web server framework
- **TypeScript** - Type safety and better development experience
- **Prisma** - Modern database ORM
- **PostgreSQL** - Relational database
- **Zod** - Schema validation
- **Swagger UI** - API documentation
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Material-UI (MUI)** - Component library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized setup)
- **PostgreSQL** (if running locally without Docker)

## Quick Start

### Full Docker Setup

1. **Clone and start all services**
   git clone <repository-url>
   cd chat-application
   docker-compose up --build

Access the application

Frontend: http://localhost:3000
Backend API: http://localhost:3001



Manual Setup (Without Docker)
Database Setup

Install PostgreSQL and create a database
Update the database URL in backend/prisma/schema.prisma:
prismadatasource db {
  provider = "postgresql"
  url      = "postgresql://username:password@localhost:5432/your_database_name"
}


Backend Setup

Navigate to backend directory
cd backend

Install dependencies
npm install

Set up the database
npx prisma generate
npx prisma migrate dev

Start the development server
npm run dev


Frontend Setup

Navigate to frontend directory
cd frontend

Install dependencies
npm install

Start the development server
npm run dev


Environment Variables
To configure the application, create .env or .env.local files in the respective directories with the following variables:
Frontend (in frontend/)
Create a .env.local file (not tracked by Git):
envNEXT_PUBLIC_API_URL=http://localhost:3001


NEXT_PUBLIC_API_URL: The base URL of the backend API. Set to http://localhost:3001 for local development. For production, update to the deployed backend URL (e.g., https://chat-app-backend-tshu.onrender.com).

Backend (in backend/)
Create a .env file (not tracked by Git):
envDATABASE_URL=postgresql://username:password@localhost:5432/your_database_name?sslmode=require

DATABASE_URL: The connection string for your PostgreSQL database. Replace username, password, and your_database_name with your actual PostgreSQL credentials and database name. The ?sslmode=require parameter ensures secure connections.

API Endpoints
Conversations

GET /conversations - Get all conversations
POST /conversations - Create a new conversation
DELETE /conversations/:id - Delete a conversation

Messages

GET /conversations/:id/messages - Get messages for a conversation
POST /messages - Send a new message

Documentation

GET /api-docs - Swagger UI documentation

Database Schema
Conversation Model
prismamodel Conversation {
  id        String    @id @default(uuid())
  title     String?   // Optional title
  createdAt DateTime  @default(now())
  messages  Message[]
}
Message Model
prismamodel Message {
  id             String       @id @default(uuid())
  content        String
  isFromUser     Boolean      // True if user, False if bot
  createdAt      DateTime     @default(now())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}
UI Components
ChatScreen

Main chat interface with message display
Input field with send functionality
User and bot message differentiation
Loading states and typing indicators

Conversations

Sidebar with conversation list
Create new conversation button
Delete conversation with confirmation modal
Auto-selection of first conversation

ConfirmModal

Reusable confirmation dialog
Customizable title, message, and button text
Material-UI styling with custom colors

Development Scripts
Backend
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
Docker Configuration
The project includes Docker configuration for easy deployment:

Backend Dockerfile: Node.js with TypeScript support
Frontend Dockerfile: Next.js production build
Docker Compose: Multi-container orchestration with PostgreSQL

Deployment
Production Build

Build the frontend
cd frontend
npm run build

Build the backend
cd backend
npm run build

Start production servers
# Backend
cd backend && npm start

# Frontend
cd frontend && npm start


Environment Variables
To configure the application for production, ensure the environment variables are set as described in the "Manual Setup" section above. For deployment platforms (e.g., Render, Vercel), add these variables in the respective dashboard settings:

Frontend: NEXT_PUBLIC_API_URL (e.g., https://chat-app-backend.com).
Backend: DATABASE_URL (your PostgreSQL connection string, e.g., postgresql://username:password@host:port/dbname?sslmode=require).

Contributing

Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add some amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request


Follow TypeScript and ESLint rules
Add tests if applicable
Update documentation as needed

Common Issues

Database Connection Error

Ensure PostgreSQL is running
Check database credentials in schema.prisma or DATABASE_URL
Run npx prisma migrate dev to apply migrations


CORS Issues

Verify backend CORS configuration
Check if frontend and backend are running on correct ports


Port Already in Use

Change ports in package.json scripts or Docker configuration
Kill existing processes using the ports


TypeScript Errors

Run npm install in both frontend and backend directories
Check TypeScript configuration files