'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  createdAt?: string;
}

interface ChatScreenProps {
  convoId: string | null;
  isLoadingConversations?: boolean;
}

export default function ChatScreen({ convoId, isLoadingConversations = false }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (convoId) {
      fetchMessages();
    } else {
      setMessages([]);
      setLoading(false);
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
    if (!input.trim() || !convoId) return;
    setDisabled(true);
    try {
      await axios.post('http://localhost:3001/messages', { content: input, conversationId: convoId });
      setInput('');
      fetchMessages();
      setIsTyping(true);
      
      // refetch after bot delay (~2s)
      setTimeout(async () => {
        await fetchMessages();
        setIsTyping(false);
      }, 2200);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setDisabled(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex',  flexDirection: 'column', backgroundColor: 'white', borderRadius: '8px', width: '1089px' }}>
      {/* Top Bar - Always visible */}
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
            ��
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: '500', color: '#2d3436' }}>
            Chatbot
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: 2,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: loading || isLoadingConversations ? 'center' : (messages.length === 0 && !convoId ? 'center' : 'flex-start')
      }}>
        {isLoadingConversations ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: '#9747FF', mb: 2 }} />
            <Typography variant="body2" sx={{ color: '#636e72' }}>
              Loading conversations...
            </Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#9747FF' }} />
          </Box>
        ) : !convoId ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            <Typography variant="h6" sx={{ color: '#636e72', mb: 1 }}>
              Welcome to Chatbot
            </Typography>
            <Typography variant="body2" sx={{ color: '#636e72', textAlign: 'center' }}>
              Select a conversation from the left to start chatting, or create a new one.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Centered timestamp */}
            {messages.length > 0 && (
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
                  {messages[0].createdAt ? formatTime(messages[0].createdAt) : ''}
                </Typography>
              </Box>
            )}

            {messages.map((msg) => (
              <Box 
                key={msg.id}
                sx={{ 
                  display: 'flex', 
                  justifyContent: msg.isFromUser ? 'flex-end' : 'flex-start',
                  mb: 2,
                  alignItems: 'flex-start'
                }}
              >
                {!msg.isFromUser && (
                  <Avatar 
                    src="/chatbot-image.svg"
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1,
                      mt: 0.5
                    }}
                  >
                    🤖
                  </Avatar>
                )}
                
                <Box sx={{ 
                  maxWidth: '70%',
                  backgroundColor: msg.isFromUser ? '#625b72' : '#ECE6F0',
                  color: msg.isFromUser ? 'white' : 'black',
                  px: 2,
                  py: 1,
                  borderRadius: msg.isFromUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  wordWrap: 'break-word'
                }}>
                  <Typography sx={{ fontSize: '14px', lineHeight: 1.4 }}>
                    {msg.content}
                  </Typography>
                </Box>

                {msg.isFromUser && (
                  <Avatar 
                    src="/user-image.svg"
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      ml: 1,
                      mt: 0.5
                    }}
                  >
                    ��
                  </Avatar>
                )}
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start',
                mb: 2,
                alignItems: 'flex-start'
              }}>
                <Avatar 
                  src="/chatbot-image.svg"
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 1,
                    mt: 0.5
                  }}
                >
                  🤖
                </Avatar>
                <Box sx={{ 
                  backgroundColor: '#ECE6F0',
                  px: 2,
                  py: 1,
                  borderRadius: '18px 18px 18px 4px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Typography sx={{ color: '#636e72', fontSize: '16px' }}>
                    ●●●
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
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
          backgroundColor: input ? '#f7f2fb' : '#ECE6F0',
          borderRadius: '25px',
          px: 2,
          py: 0,
          border: input ? '2px solid #000000' : '2px solid transparent',
          transition: 'border 0.2s ease-in-out'
        }}>
          <TextField
            fullWidth
            placeholder="Reply to Chatbot"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled || loading || !convoId || isLoadingConversations}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '14px',
                '& input': {
                  padding: '12px 0',
                }
              }
            }}
          />
          <IconButton 
            onClick={sendMessage} 
            disabled={disabled || !input.trim() || loading || !convoId || isLoadingConversations}
            sx={{ 
              backgroundColor: input ? '#f7f2fb' : '#ECE6F0',
              color: '#2d3436',
              ml: 1,
              '&:hover': {
                backgroundColor: '#ddd6fe',
              },
              '&:disabled': {
                backgroundColor: '#f0f0f0',
                color: '#a29bfe'
              }
            }}
          >
            <img src="/send.svg" alt="Send" style={{ width: 16, height: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}