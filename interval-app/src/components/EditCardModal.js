import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const EditCardModal = ({ card, open, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(false);

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
      setError(true);  // Set error to true when fields are empty
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Card</DialogTitle>
      <DialogContent>
      <TextField autoFocus margin="dense" id="title" label="Title" type="text" fullWidth required onChange={e => {setTitle(e.target.value); setError(false);}} value={title} error={error} />
      <TextField margin="dense" id="content" label="Content" type="text" fullWidth multiline rows={4} required onChange={e => {setContent(e.target.value); setError(false);}} value={content} error={error} helperText={error && "Both fields are required!"} />
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