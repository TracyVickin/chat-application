'use client';

import { Box, Typography, Drawer, useMediaQuery } from '@mui/material';
import Conversations from './components/Conversations';
import { useState } from 'react';
import ChatScreen from './components/ChatScreen';

export default function Home() {
  const [currentConvo, setCurrentConvo] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  return (
    <Box sx={{ height: '100vh', width:'100wv', display: 'flex', flexDirection: 'column' }}>
      {/* Unified Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
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
        padding: '10px',
        gap: 2,
        justifyContent: isMobile ? 'stretch' : 'center'
      }}>
        {/* Left Sidebar - Conversations */}
        <Box sx={{  
          display: { xs: 'none', md: 'block' },
          flex: '0 0 313px',
          backgroundColor: '#fef7ff',
          marginTop: '20px',
        }}>
          <Conversations 
            onSelect={setCurrentConvo} 
            currentConvo={currentConvo}
            onLoadingChange={setIsLoadingConversations}
          />
        </Box>

        {/* Right Side - Chat Screen */}
        <Box sx={{ 
          flex: isMobile ? '1 1 auto' : '0 0 1039px',
          marginTop: '10px', 
          marginBottom: '10px' 
        }}>
          <ChatScreen 
            convoId={currentConvo} 
            isLoadingConversations={isLoadingConversations}
            onOpenConversations={() => setMobileOpen(true)}
          />
        </Box>
      </Box>

      {/* Mobile Drawer for Conversations */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 313, p: 1 }}>
          <Conversations 
            onSelect={(id) => { setCurrentConvo(id); setMobileOpen(false); }}
            currentConvo={currentConvo}
            onLoadingChange={setIsLoadingConversations}
          />
        </Box>
      </Drawer>
    </Box>
  );
}