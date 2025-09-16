 'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = 'Confirm',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          minWidth: 320,
          p: 1,
          backgroundColor: 'white'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: 18, color: '#2d3436' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ textAlign: 'center', color: '#2d3436', fontSize: 14 }}>
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        <Button
          onClick={onCancel}
          sx={{
            backgroundColor: '#EADDFF',
            color: '#2d3436',
            textTransform: 'none',
            borderRadius: '999px',
            px: 3,
            '&:hover': { backgroundColor: '#dcc8ff' }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            backgroundColor: '#B3261E',
            color: 'white',
            textTransform: 'none',
            borderRadius: '999px',
            px: 3,
            '&:hover': { backgroundColor: '#8e1f18' }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
