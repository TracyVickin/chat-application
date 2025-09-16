'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  createdAt?: string;
}

interface ChatScreenProps {
  convoId: string;
}

export default function ChatScreen({ convoId }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (convoId) {
      fetchMessages();
    }
  }, [convoId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/conversations/${convoId}/messages`);
      setMessages(res.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setDisabled(true);
    try {
      await axios.post('http://localhost:3001/messages', { content: input, conversationId: convoId });
      setInput('');
      fetchMessages();
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        fetchMessages();
        setDisabled(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setDisabled(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '8px' }}>
      {/* Top Bar */}
      <Box sx={{ 
        p: 1, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: '8px 8px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src="/chatbot-image.svg"
            sx={{ 
              width: 40, 
              height: 40,
              mr: 2
            }}
          >
            🤖
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: '500', color: '#2d3436' }}>
            Chatbot
          </Typography>
        </Box>
        
        {/* User Avatar */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            src="/user-image.svg"
            sx={{ 
              width: 32, 
              height: 32,
              backgroundColor: '#6c5ce7',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            U
          </Avatar>
        </Box> */}
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: 2,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: loading ? 'center' : 'flex-start'
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#a29bfe' }} />
          </Box>
        ) : (
          <>
            {/* Centered timestamp */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#636e72',
                  fontSize: '11px',
                  backgroundColor: '#f5f5f5',
                  px: 1,
                  py: 0.5,
                  borderRadius: '8px'
                }}
              >
                {messages.length > 0 && messages[0].createdAt ? formatTime(messages[0].createdAt) : ''}
              </Typography>
            </Box>

            {messages.map((msg) => (
              <Box 
                key={msg.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: msg.isFromUser ? 'flex-end' : 'flex-start',
                  mb: 2,
                  alignItems: 'flex-end'
                }}
              >
                {!msg.isFromUser && (
                  <Avatar 
                    src="/chatbot-image.svg"
                    sx={{ 
                      width: 32, 
                      height: 32,
                      mr: 1
                    }}
                  >
                    🤖
                  </Avatar>
                )}
                <Box sx={{ maxWidth: '70%' }}>
                  <Box
                    sx={{
                      backgroundColor: msg.isFromUser ? '#625b72' : '#ECE6F0',
                      color: msg.isFromUser ? 'white' : '#2d3436',
                      borderRadius: '18px',
                      px: 2,
                      py: 1.5,
                      fontSize: '14px',
                      lineHeight: 1.4
                    }}
                  >
                    {msg.content}
                  </Box>
                </Box>
                {msg.isFromUser && (
                  <Avatar 
                    src="/user-image.svg"
                    sx={{ 
                      width: 32, 
                      height: 32,
                      ml: 1,
                      backgroundColor: '#6c5ce7',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    U
                  </Avatar>
                )}
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src="/chatbot-image.svg"
                  sx={{ width: 32, height: 32, mr: 1 }}
                >
                  🤖
                </Avatar>
                <Box sx={{ backgroundColor: '#e9ecef', borderRadius: '18px', px: 2, py: 1.5 }}>
                  <Typography sx={{ color: '#636e72', fontSize: '16px' }}>
                    ...
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'white',
        borderRadius: '0 0 8px 8px'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: '#ECE6F0',
          borderRadius: '25px',
          px: 2,
          py: 0
        }}>
          <TextField
            fullWidth
            placeholder="Reply to Chatbot"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled || loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                border: 'none',
                backgroundColor: '#ECE6F0',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  backgroundColor: '#f7f2fb',
                },
                '&.Mui-focused': {
                  backgroundColor: '#f7f2fb',
                },
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
                color: '#2d3436',
                '&::placeholder': {
                  color: '#636e72',
                  opacity: 1
                }
              }
            }}
          />
          <IconButton 
            onClick={sendMessage} 
            disabled={disabled || !input.trim() || loading}
            sx={{ 
              backgroundColor: input.trim() ? '#f7f2fb' : '#ECE6F0',
              color: '#2d3436',
              ml: 1,
              '&:hover': {
                backgroundColor: '#f7f2fb',
              },
              '&:disabled': {
                backgroundColor: '#f0f0f0',
                color: '#a29bfe'
              }
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}