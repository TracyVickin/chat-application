'use client';
import { useState, useEffect } from 'react';
import { List, ListItemButton, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

  useEffect(() => {
    fetchConvos();
  }, []);

  const fetchConvos = async () => {
    const res = await axios.get('http://localhost:3001/conversations');
    setConvos(res.data);
  };

  const deleteConvo = async (id: string) => {
    await axios.delete(`http://localhost:3001/conversations/${id}`);
    fetchConvos();
    if (currentConvo === id) onSelect(null);
  };

  return (
    <List>
      {convos.map((convo) => (
        <ListItemButton 
          key={convo.id} 
          selected={currentConvo === convo.id} 
          onClick={() => onSelect(convo.id)}
        >
          <ListItemText primary={convo.title || `Chat ${convo.id.slice(0, 4)}`} />
          <IconButton onClick={() => deleteConvo(convo.id)}><DeleteIcon /></IconButton>
        </ListItemButton>
      ))}
    </List>
  );
}