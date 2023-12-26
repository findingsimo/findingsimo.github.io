import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';

const ViewCardModal = ({ card, open, onClose }) => {
  const contentWithBreaks = card.content.replace(/\n/g, '<br />');

  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle>{card.title}</DialogTitle>
      <DialogContent sx={{ minWidth: '256px' }}>
        <Typography dangerouslySetInnerHTML={{ __html: contentWithBreaks }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCardModal;