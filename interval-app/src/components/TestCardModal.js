import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const TestCardModal = ({ card, open, onClose, onTest, onCancel }) => {
  const [content, setContent] = useState('');

  const handleTest = () => {
    onTest(content);
    setContent('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{card.title}</DialogTitle>
      <DialogContent sx={{ minWidth: '320px' }}>
        <TextField 
          margin="dense" 
          id="content" 
          label="Content" 
          type="text" 
          fullWidth 
          multiline rows={4}
          required 
          onChange={e => setContent(e.target.value)} 
          value={content} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleTest} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestCardModal;