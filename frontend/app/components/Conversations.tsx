'use client';
import { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import ConfirmModal from './ConfirmModal';

interface Conversation {
  id: string;
  title?: string;
}

interface ConversationListProps {
  onSelect: (id: string | null) => void;
  currentConvo: string | null;
  onLoadingChange?: (loading: boolean) => void;
}

export default function ConversationList({ onSelect, currentConvo, onLoadingChange }: ConversationListProps) {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchConvos();
  }, []);

  const fetchConvos = async () => {
    try {
      setLoading(true);
      onLoadingChange?.(true);
      
      // Add minimum loading time of 1.5 seconds
      const [res] = await Promise.all([
        axios.get('http://localhost:3001/conversations'),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      setConvos(res.data);
      
      // Auto-select first conversation if none is selected and conversations exist
      if (res.data.length > 0 && !currentConvo) {
        onSelect(res.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '313px', alignItems: 'center', justifyContent: 'center' }}>
      {/* New Chat Button */}
      <Box sx={{ p: 2, width: '100%' }}>
        <Button
          variant="contained"
          startIcon={<img src="/add.svg" alt="Add" style={{ width: 18, height: 18 }} />}
          onClick={createNewConvo}
          sx={{
            backgroundColor: '#EADDFF',
            color: 'black',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: '500',
            width: '100%',
            height: '56px',
            justifyContent: 'center',
            px: 2,
            '&:hover': {
              backgroundColor: '#9c88ff',
            }
          }}
        >
          Conversations
        </Button>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1,  px: 2, width: '313px', }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress sx={{ color: '#9747FF' }} />
          </Box>
        ) : convos.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#636e72', mb: 2 }}>
              {/* No conversations yet */}
            </Typography>
            {/* <Button
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
            </Button> */}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, }}>
            {convos.map((convo, index) => (
              <Box
                key={convo.id}
                sx={{
                  position: 'relative',
                  backgroundColor: currentConvo === convo.id ? '#E8DEF8' : '#EADDFF',
                  borderRadius: '12px',
                  width: '100%',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  px: 2,
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
                    setPendingDeleteId(convo.id);
                    setConfirmOpen(true);
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
                  <img src="/delete.svg" alt="Delete" style={{ width: 16, height: 16 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <ConfirmModal
        open={confirmOpen}
        title="Delete Conversation"
        message={`Are you sure you want to delete ${(() => {
          const idx = convos.findIndex(c => c.id === pendingDeleteId);
          return idx >= 0 ? `Conversation ${idx + 1}?` : 'this conversation?';
        })()}`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (pendingDeleteId) {
            await deleteConvo(pendingDeleteId);
          }
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </Box>
  );
}
