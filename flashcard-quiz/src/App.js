import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabComponent from './components/TabComponent';
import FabComponent from './components/FabComponent';
import ViewCardModal from './components/ViewCardModal';
import EditCardModal from './components/EditCardModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import TestCardModal from './components/TestCardModal';
import { createTheme, ThemeProvider } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { CssBaseline } from '@mui/material';

const App = () => {
  const [cards, setCards] = useState(JSON.parse(localStorage.getItem('cards')) || []);
  const [viewCard, setViewCard] = useState(null);
  const [editCardIndex, setEditCardIndex] = useState(null);
  const [deleteCardIndex, setDeleteCardIndex] = useState(null);
  const [testCardIndex, setTestCardIndex] = useState(null);
  const [testStatus, setTestStatus] = useState({ passedTests: 0, totalTests: 10, nextTest: null, showButtons: true });
  const [archive, setArchive] = useState(JSON.parse(localStorage.getItem('archive')) || []); // New state for archived cards

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    const timers = cards.map((card, index) => {
      const timeUntilNextTest = new Date(card.testStatus.nextTest) - new Date();
      if(timeUntilNextTest > 0){
        return setTimeout(() => {
          // Check if there's an ongoing test
          if (testCardIndex !== null) {
            // Consider the ongoing test as cancelled and reset its next test time
            handleCancelTest();
          }
          setTestCardIndex(index);
        }, timeUntilNextTest);
      }
      return null;
    });
  
    return () => timers.forEach(timer => timer && clearTimeout(timer));
  }, [cards, testCardIndex]); // Add testCardIndex to the dependency array

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#e74c3c',
      },
      background: {
        default: '#FAFCFC',
      },
    },
  });
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#e74c3c',
      },
      background: {
        default: '#303030',
      },
    },
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = prefersDarkMode ? darkTheme : lightTheme;

  const addCard = (title, content) => {
    const nextTest = new Date();
    nextTest.setMinutes(nextTest.getMinutes() + 5); // Set nextTest to 5 minutes from now
    setCards(prevCards => [...prevCards, { title, content, testStatus: { passedTests: 0, totalTests: 10, nextTest, testInProgress: false } }]);
  };

  const editCard = (index, card) => {
    setCards(prevCards => prevCards.map((c, i) => i === index ? card : c));
  };

  const deleteCard = (index) => {
    setCards(prevCards => prevCards.filter((c, i) => i !== index));
  };

  const handleTest = (content) => {
    setCards(prevCards => prevCards.map((card, i) => {
      if (i !== testCardIndex) {
        return card;
      }
      const nextTest = new Date();
      nextTest.setMinutes(nextTest.getMinutes() + 5); // Set nextTest to 5 minutes from now
      if (content.trim() === card.content.trim()) { // Trim the content strings before comparing
        const newPassedTests = card.testStatus.passedTests + 1;
        if (newPassedTests === 10) { // If progress is 10/10
          setArchive(prevArchive => [...prevArchive, { ...card, testStatus: { ...card.testStatus, passedTests: newPassedTests, nextTest, testInProgress: false } }]); // Add the card to archive
          return null; // Remove the card from cards
        }
        return {
          ...card,
          testStatus: {
            ...card.testStatus,
            passedTests: newPassedTests,
            nextTest,
            testInProgress: false
          }
        };
      }
      return {
        ...card,
        testStatus: {
          ...card.testStatus,
          nextTest,
          testInProgress: false
        }
      };
    }).filter(card => card !== null)); // Filter out the null values
    setTestCardIndex(null);
  };

  const handleCancelTest = () => {
    setCards(prevCards => prevCards.map((card, i) => {
      if (i !== testCardIndex) {
        return card;
      }
      return {
        ...card,
        testStatus: {
          ...card.testStatus,
          testInProgress: true
        }
      };
    }));
    setTestCardIndex(null);
  };

  const retryCard = (index) => {
    const cardToRetry = archive[index];
    const nextTest = new Date();
    nextTest.setMinutes(nextTest.getMinutes() + 5); // Set nextTest to 5 minutes from now
    cardToRetry.testStatus = { passedTests: 0, totalTests: 10, nextTest, testInProgress: false }; // Reset the progress state
    setCards(prevCards => [...prevCards, cardToRetry]); // Add the card back to the Tests tab
    setArchive(prevArchive => prevArchive.filter((card, i) => i !== index)); // Remove the card from the archive
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <TabComponent 
        cards={cards} 
        archive={archive} 
        onRetry={retryCard} // Make sure you're passing retryCard function here
        setViewCard={setViewCard} 
        setEditCardIndex={setEditCardIndex} 
        setDeleteCardIndex={setDeleteCardIndex} 
        setTestCardIndex={setTestCardIndex} 
      />
      <FabComponent addCard={addCard} editCard={editCard} editIndex={editCardIndex} />
      {viewCard && 
        <ViewCardModal 
          card={viewCard} 
          open={!!viewCard} 
          onClose={() => { setViewCard(null); handleCancelTest(); }} 
        />
      }
      {editCardIndex !== null && 
        <EditCardModal 
          card={cards[editCardIndex]} 
          open={editCardIndex !== null} 
          onClose={() => setEditCardIndex(null)} 
          onSave={(updatedCard) => { 
            editCard(editCardIndex, { ...cards[editCardIndex], ...updatedCard }); 
            setEditCardIndex(null); 
          }} 
        />
      }
      {deleteCardIndex !== null && 
        <DeleteConfirmationModal 
          open={deleteCardIndex !== null} 
          onClose={() => setDeleteCardIndex(null)} 
          onConfirm={() => { deleteCard(deleteCardIndex); setDeleteCardIndex(null); }} 
        />
      }
      {testCardIndex !== null && 
      <TestCardModal 
        card={cards[testCardIndex]} 
        open={testCardIndex !== null} 
        onClose={() => { setTestCardIndex(null); handleCancelTest(); }} // Call handleCancelTest when the modal is closed
        onTest={handleTest} 
        onCancel={handleCancelTest}
      />
    }
    </div>
    </ThemeProvider>
  );
};

export default App;