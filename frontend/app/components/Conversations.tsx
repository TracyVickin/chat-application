'use client';
import { useState, useEffect } from 'react';
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchConvos();
  }, []);

  const fetchConvos = async () => {
    try {
      setLoading(true);
      onLoadingChange?.(true);
      
      const [res] = await Promise.all([
        axios.get(`${API_URL}/conversations`),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      setConvos(res.data);
      
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
      const res = await axios.post(`${API_URL}/conversations`);
      setConvos(prev => [res.data, ...prev]);
      onSelect(res.data.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const deleteConvo = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/conversations/${id}`);
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
    <div className="h-full flex flex-col w-[313px] items-center justify-center">
      {/* New Chat Button */}
      <div className="p-2 w-full">
        <button
          onClick={createNewConvo}
          className="bg-[#EADDFF] text-black rounded-[12px] text-left capitalize font-medium w-full h-[56px] flex items-center justify-center px-2 hover:bg-[#9c88ff] transition-colors duration-200"
        >
          <img src="/add.svg" alt="Add" className="w-4 h-4 mr-2" />
          Conversations
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 px-2 w-[313px]">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="w-8 h-8 border-4 border-[#9747FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : convos.length === 0 ? (
          <div className="p-2 text-center">
            <p className="text-[#636e72] mb-2"></p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {convos.map((convo, index) => (
              <div
              key={convo.id}
              style={{ backgroundColor: currentConvo === convo.id ? '#E8DEF8' : '#EADDFF' }}
              className={`relative rounded-[12px] w-full h-[56px] flex items-center justify-start px-2 py-[6px] cursor-pointer hover:bg-${currentConvo === convo.id ? '#E8DEF8' : '#9c88ff'} transition-colors duration-200`}
              onClick={() => onSelect(convo.id)}
            >
              <p
                className={`text-[14px] ${currentConvo === convo.id ? 'font-medium' : 'font-normal'} text-black`}
              >
                {getConversationName(convo, index)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDeleteId(convo.id);
                  setConfirmOpen(true);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#636e72] hover:text-[#e17055] transition-colors duration-200"
              >
                <img src="/delete.svg" alt="Delete" className="w-4 h-4" />
              </button>
            </div>
            ))}
          </div>
        )}
      </div>
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
    </div>
  );
}