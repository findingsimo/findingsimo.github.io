import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Input } from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Header = ({ searchTerm, setSearchTerm }) => {
    const [isSearching, setIsSearching] = useState(false);
    const theme = useTheme();
    
    return (
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Box display="flex" justifyContent="center">
          <Toolbar style={{ maxWidth: 640, width: '100%', justifyContent: 'space-between' }}>
            {!isSearching && (
              <Typography variant="h6">
                Flashcard Quiz
              </Typography>
            )}
            {isSearching 
              ? (
                <>
                  <Input 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
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