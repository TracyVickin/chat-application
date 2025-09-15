'use client';

import { Box, Button, } from '@mui/material';
import Conversations from './components/Conversations';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [currentConvo, setCurrentConvo] = useState<string | null>(null);

  const createNewConvo = async () => {
    const res = await axios.post('http://localhost:3001/conversations');
    setCurrentConvo(res.data.id);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '30%', borderRight: '1px solid gray' }}>
        <Button onClick={createNewConvo}>New Chat</Button>
        <Conversations onSelect={setCurrentConvo} currentConvo={currentConvo} />
      </Box>
      
    </Box>
  );
}