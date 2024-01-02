import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const FabComponent = (props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(false); 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setContent('');
    setError(false);  // Reset the error state
  };

  const handleSave = () => {
    if(title.trim() !== '' && content.trim() !== '') {
      props.addCard(title, content);
      handleClose();
    } else {
      setError(true);  // Set error to true when fields are empty
    }
  };

  return (
    <div>
      <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '20px', right: '20px', marginRight: `calc(50% - min(320px, 50%))` }} onClick={handleClickOpen}>
        <Add />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Card</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="title" label="Title" type="text" fullWidth required onChange={e => {setTitle(e.target.value); setError(false);}} error={error} />
          <TextField margin="dense" id="content" label="Content" type="text" fullWidth multiline rows={4} required onChange={e => {setContent(e.target.value); setError(false);}} error={error} helperText={error && "Both fields are required!"} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FabComponent;