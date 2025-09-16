'use client';

import { Box, Typography, Avatar } from '@mui/material';
import Conversations from './components/Conversations';
import { useState } from 'react';
import ChatScreen from './components/ChatScreen';

export default function Home() {
  const [currentConvo, setCurrentConvo] = useState<string | null>(null);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Unified Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: 'white',
        height: '60px'
      }}>
        <Box sx={{ p: 2, backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              backgroundColor: '#65558f', 
              color: 'white', 
              px: 0.2, 
              py: 1.8, 
              borderRadius: '12px',
              fontSize: '7px',
              fontWeight: 'bold',
            }}
          >
            CHATBOT
          </Typography>
        </Box>  
      </Box>

      {/* Background Color Area */}
      <Box sx={{ 
        backgroundColor: '#fef7ff',
        height: '20px'
      }} />

      {/* Main Content Area */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        backgroundColor: '#fef7ff',
        padding: '10px'
      }}>
        {/* Left Sidebar - Conversations */}
        <Box sx={{ 
          width: '30%', 
          backgroundColor: '#fef7ff',
          marginTop: '20px' // Overlap with background color area
        }}>
          <Conversations onSelect={setCurrentConvo} currentConvo={currentConvo} />
        </Box>

        {/* Right Side - Chat Screen */}
        <Box sx={{ 
          width: '68%',
          marginTop: '10px', // Add margin to show background color
          marginBottom: '10px' // Add margin bottom to show background color
        }}>
          {currentConvo ? (
            <ChatScreen convoId={currentConvo} />
          ) : (
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}>
              <Typography variant="h6" sx={{ color: '#636e72' }}>
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}