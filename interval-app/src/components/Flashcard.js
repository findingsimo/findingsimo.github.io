import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Edit, Delete, Refresh } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RetryConfirmationModal from './RetryConfirmationModal'; 

const Flashcard = ({ card, index, onView, onEdit, onDelete, onTest, onRetry, isArchived }) => {
  const { testStatus } = card; 

  const [openRetryModal, setOpenRetryModal] = React.useState(false);

  const handleOpenRetryModal = (e) => {
    e.stopPropagation();
    setOpenRetryModal(true);
  };

  const handleCloseRetryModal = () => {
    setOpenRetryModal(false);
  };

  const handleRetry = () => {
    onRetry(index); 
    handleCloseRetryModal();
  };

  return (
<Box maxWidth={640} margin="auto">
  <Card style={{ marginBottom: '16px', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', paddingBottom: isArchived ? 0 : '4px' }} onClick={testStatus.testInProgress ? () => onTest(card) : null}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: isArchived ? 0 : '20px' }}>
            <Typography variant="h6">{card.title}</Typography>
            {testStatus.testInProgress ? (
              <FiberManualRecordIcon color="primary" />
            ) : (
                <Box>
                <IconButton onClick={(e) => {e.stopPropagation(); onView(card);}}>
                  <VisibilityIcon />
                </IconButton>
                {!isArchived && (
                  <IconButton onClick={(e) => {e.stopPropagation(); onEdit(card);}}>
                    <Edit />
                  </IconButton>
                )}
                 {isArchived && (
                  <IconButton onClick={handleOpenRetryModal}>
                    <Refresh /> 
                  </IconButton>
                )}
                <IconButton onClick={(e) => {e.stopPropagation(); onDelete(card);}}>
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>
          {!isArchived && (
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.5 }}>
              {testStatus.testInProgress ? (
                <Typography variant="body2">Test pending</Typography>
              ) : (
                <>
                  <Typography variant="body2" style={{ marginRight: '10px' }}>{testStatus.passedTests}/10</Typography>
                  {testStatus.nextTest ? <Typography variant="body2">{new Date(testStatus.nextTest).toLocaleString()}</Typography> : <Typography variant="body2">No next test scheduled</Typography>}
                </>
              )}
            </Box>
          )}
        </CardContent>
        <RetryConfirmationModal
          open={openRetryModal}
          onClose={handleCloseRetryModal}
          onConfirm={handleRetry}
        />
      </Card>
    </Box>
  );
};

export default Flashcard;