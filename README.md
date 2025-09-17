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


##  Tech Stack

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
   ```bash
   git clone <repository-url>
   cd chat-application
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

##  Manual Setup (Without Docker)

### Database Setup

1. **Install PostgreSQL** and create a database
2. **Update the database URL** in `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = "postgresql://username:password@localhost:5432/your_database_name"
   }
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Conversations
- `GET /conversations` - Get all conversations
- `POST /conversations` - Create a new conversation
- `DELETE /conversations/:id` - Delete a conversation

### Messages
- `GET /conversations/:id/messages` - Get messages for a conversation
- `POST /messages` - Send a new message

### Documentation
- `GET /api-docs` - Swagger UI documentation

## Database Schema

### Conversation Model
```prisma
model Conversation {
  id        String    @id @default(uuid())
  title     String?   // Optional title
  createdAt DateTime  @default(now())
  messages  Message[]
}
```

### Message Model
```prisma
model Message {
  id             String       @id @default(uuid())
  content        String
  isFromUser     Boolean      // True if user, False if bot
  createdAt      DateTime     @default(now())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}
```

##  UI Components

### ChatScreen
- Main chat interface with message display
- Input field with send functionality
- User and bot message differentiation
- Loading states and typing indicators

### Conversations
- Sidebar with conversation list
- Create new conversation button
- Delete conversation with confirmation modal
- Auto-selection of first conversation

### ConfirmModal
- Reusable confirmation dialog
- Customizable title, message, and button text
- Material-UI styling with custom colors

## Development Scripts

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Docker Configuration

The project includes Docker configuration for easy deployment:

- **Backend Dockerfile**: Node.js with TypeScript support
- **Frontend Dockerfile**: Next.js production build
- **Docker Compose**: Multi-container orchestration with PostgreSQL

## Deployment

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build the backend**
   ```bash
   cd backend
   npm run build
   ```

3. **Start production servers**
   ```bash
   # Backend
   cd backend && npm start
   
   # Frontend
   cd frontend && npm start
   ```

### Environment Variables

Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5433/postgres"
```

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
- Follow TypeScript and ESLint rules
- Add tests if applicable
- Update documentation as needed

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `schema.prisma`
   - Run `npx prisma migrate dev` to apply migrations

2. **CORS Issues**
   - Verify backend CORS configuration
   - Check if frontend and backend are running on correct ports

3. **Port Already in Use**
   - Change ports in `package.json` scripts or Docker configuration
   - Kill existing processes using the ports

4. **TypeScript Errors**
   - Run `npm install` in both frontend and backend directories
   - Check TypeScript configuration files

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure all services are running
4. Check the API documentation at `/api-docs`

