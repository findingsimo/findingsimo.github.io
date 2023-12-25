import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const EditCardModal = ({ card, open, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if(card) {
      setTitle(card.title);
      setContent(card.content);
    }
  }, [card]);

  const handleSave = () => {
    if(title.trim() !== '' && content.trim() !== '') {
      onSave({ title, content });
      onClose();
    } else {
      alert('Both fields are required!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Card</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" id="title" label="Title" type="text" fullWidth required onChange={e => setTitle(e.target.value)} value={title} />
        <TextField margin="dense" id="content" label="Content" type="text" fullWidth multiline rows={4} required onChange={e => setContent(e.target.value)} value={content} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCardModal;