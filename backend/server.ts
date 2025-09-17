import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json'; 
import z from 'zod';

const app = express();
const prisma = new PrismaClient();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));

app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Schemas for validation
const MessageSchema = z.object({
  content: z.string().min(1),
  conversationId: z.string().uuid(),
  isFromUser: z.boolean().optional().default(true),
});

// API Routes

// Get all conversations
app.get('/conversations', async (req, res) => {
  const convos = await prisma.conversation.findMany({
    include: { messages: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(convos);
});

// Create new conversation
app.post('/conversations', async (req, res) => {
  const convo = await prisma.conversation.create({ data: {} });
  // Send bot's initial message
  await prisma.message.create({
    data: {
      content: 'How can I help you?',
      isFromUser: false,
      conversationId: convo.id,
    },
  });
  res.json(convo);
});

// Delete conversation
app.delete('/conversations/:id', async (req, res) => {
  await prisma.conversation.delete({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// Get messages for a conversation
app.get('/conversations/:id/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    orderBy: { createdAt: 'asc' },
  });
  res.json(messages);
});

// Send message (user to bot)
app.post('/messages', async (req, res) => {
  const { success, data } = MessageSchema.safeParse(req.body);
  if (!success) return res.status(400).json({ error: 'Invalid data' });

  // Save user message
  const userMsg = await prisma.message.create({
    data: {
      content: data.content,
      isFromUser: true,
      conversationId: data.conversationId,
    },
  });

   

  setTimeout(async () => {
    await prisma.message.create({
      data: {
        content: 'This is an AI generated response',
        isFromUser: false,
        conversationId: data.conversationId,
      },
    });
    
  }, 2000);

  res.json(userMsg);
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));