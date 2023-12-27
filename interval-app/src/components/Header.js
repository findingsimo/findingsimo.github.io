import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Input } from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Header = ({ searchTerm, setSearchTerm }) => {
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

  return (
    <AppBar position="static" enableColorOnDark >
      <Box display="flex" justifyContent="center">
        <Toolbar style={{ maxWidth: 640, width: '100%', justifyContent: 'space-between' }}>
          {!isSearching && (
            <Typography variant="h6">
              Interval
            </Typography>
          )}
          {isSearching 
            ? (
              <>
                <Input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  inputRef={inputRef} // Attach the ref to the input field using inputRef
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
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;