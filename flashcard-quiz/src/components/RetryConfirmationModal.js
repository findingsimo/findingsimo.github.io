import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

const RetryConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to retry this card?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Retry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RetryConfirmationModal;