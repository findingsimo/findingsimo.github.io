import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Input } from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Header = ({ searchTerm, setSearchTerm, cards, setCards }) => {
  const [isSearching, setIsSearching] = useState(false);
  const theme = useTheme();

  // Create a reference to the input field
  const inputRef = useRef();

  // Focus the input field whenever isSearching becomes true
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
    }
  }, [isSearching]);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDownload = () => {
    const data = JSON.stringify(cards);
    const blob = new Blob([data], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'cards.json';
    link.href = url;
    link.click();
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        try {
          const newCards = JSON.parse(event.target.result);
          await setCards(newCards); // Update the cards state with the uploaded cards
          localStorage.setItem('cards', JSON.stringify(newCards)); // Update the localStorage data
          alert('File uploaded successfully');
        } catch (error) {
          alert('Error reading file: ' + error.message);
        }
      };
  
      reader.onerror = () => {
        alert('Error reading file');
      };
  
      reader.readAsText(file);
    }
  };

  const fileInputRef = useRef();

  return (
    <AppBar position="static" enableColorOnDark color="primary" elevation={0}>
      <Box display="flex" justifyContent="center">
        <Toolbar style={{ maxWidth: 640, width: '100%', justifyContent: 'space-between' }}>
          {!isSearching && (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Interval
            </Typography>
          )}
          {isSearching 
            ? (
              <>
                <Input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  inputRef={inputRef} 
                  sx={{ 
                      color: 'inherit', 
                      flexGrow: 1, 
                      marginLeft: theme.spacing(2),
                      marginRight: theme.spacing(2),
                      '&::before': {
                      borderColor: 'inherit',
                      },
                      '&::after': {
                      borderColor: 'inherit',
                      },
                      '&:hover:not(.Mui-disabled):before': {
                      borderColor: 'inherit',
                      },
                  }} 
                  />
                <IconButton color="inherit" onClick={() => { setIsSearching(false); setSearchTerm(''); }}>
                  <Close />
                </IconButton>
              </>
            ) 
            : (
              <IconButton color="inherit" onClick={() => setIsSearching(true)}>
                <Search />
              </IconButton>
            )
          }
          <IconButton color="inherit" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </Box>
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Button startIcon={<CloudDownloadIcon />} onClick={handleDownload}>
            Download Cards
          </Button>
          <Button startIcon={<CloudUploadIcon />} onClick={() => fileInputRef.current.click()}>
            Upload Cards
          </Button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;