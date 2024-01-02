import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const TestResultModal = ({ open, onClose, result }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{result ? "Success" : "Failure"}</DialogTitle>
      <DialogContent sx={{ minWidth: '320px' }}>
        <Typography variant="body1" component="div" style={{ color: result ? "green" : "red" }}>
          {result ? "Good job!" : "You need more practice."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestResultModal;