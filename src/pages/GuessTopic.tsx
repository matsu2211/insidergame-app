import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';

const GuessTopic = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const { topic } = state;
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === topic.toLowerCase()) {
      setFeedback({ type: 'success', message: '正解！インサイダー推測に進みます。' });
      setTimeout(() => {
        dispatch({ type: 'CHANGE_PHASE', payload: 'InsiderGuess' }); // Phase state might still be useful
        navigate('/insider-guess');
      }, 2000); // 2秒後に画面遷移
    } else {
      setFeedback({ type: 'error', message: '残念、不正解です。質問フェーズに戻ります。' });
      setTimeout(() => {
        dispatch({ type: 'CHANGE_PHASE', payload: 'QuestionPhase' }); // Phase state might still be useful
        navigate('/question-phase');
      }, 2000);
    }
  };

  const handleCloseSnackbar = () => {
    setFeedback(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        お題はわかったかな？
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        市民は全員で相談して、お題を推測してください。
      </Typography>
      <Box component="form" onSubmit={handleGuess} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="お題の答え"
          variant="outlined"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          fullWidth
          disabled={!!feedback}
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          disabled={!guess || !!feedback}
          sx={{ fontWeight: 'bold' }}
        >
          これで推測する！
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/question-phase')}
          disabled={!!feedback}
          sx={{ fontWeight: 'bold' }}
        >
          一つ前の画面に戻る
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/')}
          disabled={!!feedback}
          sx={{ fontWeight: 'bold' }}
        >
          初めの画面に戻る
        </Button>
      </Box>

      <Snackbar
        open={!!feedback}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={feedback?.type} sx={{ width: '100%' }}>
          {feedback?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default GuessTopic;
