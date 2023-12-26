import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import Flashcard from './Flashcard';

const TabComponent = ({ cards, archive, onRetry, setViewCard, setEditCardIndex, setDeleteCardIndex, setTestCardIndex, searchTerm }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Calculate the number of in-progress cards
  const inProgressCount = cards.filter(card => card.testStatus.testInProgress).length;

  const filteredCards = cards.filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredArchive = archive.filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <Tabs value={value} onChange={handleChange} centered >
        <Tab 
        label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Tests
            {cards.length > 0 && (
                <Typography 
                variant="button" 
                sx={{ marginLeft: '10px', opacity: 0.75 }}
                >
                {cards.length}
                </Typography>
            )}
            {/* Display the number of in-progress cards */}
            {inProgressCount > 0 && (
              <Box 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '10px',
                  height: '20px',
                  width: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#e74c3c', // Replace with your theme's primary color
                  color: 'white' // Replace with your theme's contrast text color for primary color
                }}
              >
                <Typography variant="button">
                  {inProgressCount}
                </Typography>
              </Box>
            )}
            </Box>
        } 
        />
        <Tab 
        label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Archive
            {archive.length > 0 && (
                <Typography 
                variant="button" 
                sx={{ marginLeft: '10px', opacity: 0.75 }}
                >
                {archive.length}
                </Typography>
            )}
            </Box>
        } 
        />
      </Tabs>
      {value === 0 && (
      <Box p={3}>
        {filteredCards.map((card, index) => (
            <Flashcard 
                key={index} 
                card={card} 
                onView={() => setViewCard(card)} 
                onEdit={() => setEditCardIndex(index)} 
                onDelete={() => setDeleteCardIndex(index)} 
                onTest={() => setTestCardIndex(index)}
            />
          ))}
        </Box>
      )}
      {value === 1 && (
      <Box p={3}>
        {filteredArchive.map((card, index) => (
                <Flashcard 
                key={index} 
                card={card} 
                index={index} 
                onView={() => setViewCard(card)} 
                onEdit={() => setEditCardIndex(index)} 
                onDelete={() => setDeleteCardIndex(index)} 
                onTest={() => setTestCardIndex(index)}
                onRetry={onRetry} 
                isArchived={true} 
              />
            ))}
        </Box>
        )}
    </div>
  );
};

export default TabComponent;