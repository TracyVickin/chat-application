"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger.json")); // We'll create this later
const zod_1 = __importDefault(require("zod"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}));
app.use(express_1.default.json());
// Swagger setup
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Schemas for validation
const MessageSchema = zod_1.default.object({
    content: zod_1.default.string().min(1),
    conversationId: zod_1.default.string().uuid(),
    isFromUser: zod_1.default.boolean().optional().default(true),
});
// API Routes
// Get all conversations
app.get('/conversations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const convos = yield prisma.conversation.findMany({
        include: { messages: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json(convos);
}));
// Create new conversation
app.post('/conversations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const convo = yield prisma.conversation.create({ data: {} });
    // Send bot's initial message
    yield prisma.message.create({
        data: {
            content: 'How can I help you?',
            isFromUser: false,
            conversationId: convo.id,
        },
    });
    res.json(convo);
}));
// Delete conversation
app.delete('/conversations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.conversation.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
}));
// Get messages for a conversation
app.get('/conversations/:id/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma.message.findMany({
        where: { conversationId: req.params.id },
        orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
}));
// Send message (user to bot)
app.post('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = MessageSchema.safeParse(req.body);
    if (!success)
        return res.status(400).json({ error: 'Invalid data' });
    // Save user message
    const userMsg = yield prisma.message.create({
        data: {
            content: data.content,
            isFromUser: true,
            conversationId: data.conversationId,
        },
    });
    // Simulate bot response after 2 seconds (but since this is API, frontend handles delay)
    // Note: Actual delay and typing animation is frontend-side; here we just prepare the response.
    // But for simulation, we can add a setTimeout in API if needed, but better on frontend.
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.message.create({
            data: {
                content: 'This is an AI generated response',
                isFromUser: false,
                conversationId: data.conversationId,
            },
        });
        // In real app, you'd emit via websockets, but for simplicity, frontend polls or refetches.
    }), 2000);
    res.json(userMsg);
}));
app.listen(3001, () => console.log('Server running on http://localhost:3001'));
