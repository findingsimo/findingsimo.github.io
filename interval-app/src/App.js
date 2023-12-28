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
import NotificationModal from './components/NotificationModal';

const App = () => {
  const [cards, setCards] = useState(JSON.parse(localStorage.getItem('cards')) || []);
  const [viewCard, setViewCard] = useState(null);
  const [editCardIndex, setEditCardIndex] = useState(null);
  const [deleteCardIndex, setDeleteCardIndex] = useState(null);
  const [testCardIndex, setTestCardIndex] = useState(null);
  const [testStatus, setTestStatus] = useState({ passedTests: 0, totalTests: 10, nextTest: null, showButtons: true });
  const [archive, setArchive] = useState(JSON.parse(localStorage.getItem('archive')) || []); // New state for archived cards
  const [searchTerm, setSearchTerm] = useState('');
  const intervals = [5, 15, 32, 72, 160, 360, 792, 1700, 3840, 8440];
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('archive', JSON.stringify(archive));
  }, [archive]);

 //  useEffect(() => {
    // Check if notifications API is supported
 //   if (!('Notification' in window)) {
 //     console.log('This browser does not support desktop notification');
 //   } else if (Notification.permission === 'default') {
 //     // The user hasn't granted or denied permission
 //     setShowNotificationModal(true);
 //   }
 // }, []);

  useEffect(() => {
    const now = new Date();
    const updatedCards = cards.map(card => {
      const nextTest = new Date(card.testStatus.nextTest);
      if (nextTest < now) {
        // If the next test time is in the past, set the card to the 'test pending' state
        return {
          ...card,
          testStatus: {
            ...card.testStatus,
            testInProgress: true
          }
        };
      }
      return card;
    });
    setCards(updatedCards);
    localStorage.setItem('cards', JSON.stringify(updatedCards));
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
    nextTest.setMinutes(nextTest.getMinutes() + intervals[0]); // Set nextTest to the first interval from now
    setCards(prevCards => [...prevCards, { title, content, testStatus: { passedTests: 0, totalTests: 10, nextTest, testInProgress: false } }]);
  };

  const editCard = (index, card) => {
    setCards(prevCards => prevCards.map((c, i) => i === index ? card : c));
  };

  const deleteCard = (index) => {
    setCards(prevCards => prevCards.filter((c, i) => i !== index));
  };

  const handleConfirm = () => {
    setShowNotificationModal(false);
    Notification.requestPermission()
      .then((permission) => {
        // Handle the permission request outcome
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
  };
  
  const handleCancel = () => {
    setShowNotificationModal(false);
  };

  const handleTest = (content) => {
    setCards(prevCards => prevCards.map((card, i) => {
      if (i !== testCardIndex) {
        return card;
      }
  
      const userWords = content.trim().toLowerCase().replace(/[.,]/g, "").split(/\s+/);
      const cardWords = card.content.trim().toLowerCase().replace(/[.,]/g, "").split(/\s+/);
  
      const commonWords = userWords.filter(word => cardWords.includes(word));
      const matchPercentage = commonWords.length / cardWords.length;
  
      const nextTest = new Date();
  
      if (matchPercentage >= 0.75) {
        const newPassedTests = card.testStatus.passedTests + 1;
        if (newPassedTests < intervals.length) {
          nextTest.setMinutes(nextTest.getMinutes() + intervals[newPassedTests]);
        }
        if (newPassedTests === 10) {
          setArchive(prevArchive => [...prevArchive, { ...card, testStatus: { ...card.testStatus, passedTests: newPassedTests, nextTest, testInProgress: false } }]);
          return null;
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
  
      nextTest.setMinutes(nextTest.getMinutes() + intervals[card.testStatus.passedTests]);
      return {
        ...card,
        testStatus: {
          ...card.testStatus,
          nextTest,
          testInProgress: false
        }
      };
    }).filter(card => card !== null));
  
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
    nextTest.setMinutes(nextTest.getMinutes() + intervals[0]); // Set nextTest to the first interval from now
    cardToRetry.testStatus = { passedTests: 0, totalTests: 10, nextTest, testInProgress: false }; // Reset the progress state
    setCards(prevCards => [...prevCards, cardToRetry]); // Add the card back to the Tests tab
    setArchive(prevArchive => prevArchive.filter((card, i) => i !== index)); // Remove the card from the archive
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <div style={{ minHeight: '100vh' }}>
    <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TabComponent 
        cards={cards} 
        archive={archive} 
        onRetry={retryCard} // Make sure you're passing retryCard function here
        setViewCard={setViewCard} 
        setEditCardIndex={setEditCardIndex} 
        setDeleteCardIndex={setDeleteCardIndex} 
        setTestCardIndex={setTestCardIndex} 
        searchTerm={searchTerm}
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
  {/* {showNotificationModal && 
     <NotificationModal 
        open={showNotificationModal} 
        onConfirm={handleConfirm} 
        onCancel={handleCancel}
      />
   } */}
    </div>
    </ThemeProvider>
  );
};

export default App;