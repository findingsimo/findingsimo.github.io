import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar position="static">
      <Box display="flex" justifyContent="center">
        <Toolbar style={{ maxWidth: 640, width: '100%', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Flashcard Quiz
          </Typography>
          <IconButton color="inherit">
            <Search />
          </IconButton>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;