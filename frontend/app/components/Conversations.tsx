'use client';
import { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, ListItemText, IconButton, Typography, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

interface Conversation {
  id: string;
  title?: string;
}

interface ConversationListProps {
  onSelect: (id: string | null) => void;
  currentConvo: string | null;
}

export default function ConversationList({ onSelect, currentConvo }: ConversationListProps) {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConvos();
  }, []);

  const fetchConvos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/conversations');
      setConvos(res.data);
      
      // Auto-select first conversation if none is selected and conversations exist
      if (res.data.length > 0 && !currentConvo) {
        onSelect(res.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewConvo = async () => {
    try {
      const res = await axios.post('http://localhost:3001/conversations');
      setConvos(prev => [res.data, ...prev]);
      onSelect(res.data.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const deleteConvo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/conversations/${id}`);
      setConvos(prev => prev.filter(convo => convo.id !== id));
      if (currentConvo === id) {
        const remainingConvos = convos.filter(convo => convo.id !== id);
        onSelect(remainingConvos.length > 0 ? remainingConvos[0].id : null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const getConversationName = (convo: Conversation, index: number) => {
    return `Conversation ${index + 1}`;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createNewConvo}
          sx={{
            backgroundColor: '#EADDFF',
            color: 'black',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: '500',
            px: 15,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#9c88ff',
            }
          }}
        >
          Conversations
        </Button>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress sx={{ color: '#a29bfe' }} />
          </Box>
        ) : convos.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#636e72', mb: 2 }}>
              No conversations yet
            </Typography>
            <Button
              variant="outlined"
              onClick={createNewConvo}
              sx={{
                borderColor: '#a29bfe',
                color: '#6c5ce7',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#9c88ff',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Start New Chat
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {convos.map((convo, index) => (
              <Box
                key={convo.id}
                sx={{
                  position: 'relative',
                  backgroundColor: currentConvo === convo.id ? '#E8DEF8' : '#EADDFF',
                  borderRadius: '12px',
                  px: 15,
                  py: 1.5,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: currentConvo === convo.id ? '#E8DEF8' : '#9c88ff',
                  }
                }}
                onClick={() => onSelect(convo.id)}
              >
                <Typography sx={{ 
                  fontSize: '14px', 
                  fontWeight: currentConvo === convo.id ? '500' : '400',
                  color: 'black'
                }}>
                  {getConversationName(convo, index)}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConvo(convo.id);
                  }}
                  sx={{ 
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#636e72',
                    '&:hover': { color: '#e17055' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
