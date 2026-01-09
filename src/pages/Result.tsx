import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ReplayIcon from '@mui/icons-material/Replay';

const Result = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const { gameResult, players, topic } = state;

  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  };

  const isCitizenWin = gameResult === '市民チームの勝利';

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        ゲーム結果
      </Typography>
      
      <Box sx={{ my: 4 }}>
        <CelebrationIcon sx={{ fontSize: 60, color: isCitizenWin ? 'primary.main' : 'error.main' }} />
        <Typography variant="h3" component="p" sx={{ fontWeight: 'bold', color: isCitizenWin ? 'primary.main' : 'error.main' }}>
          {gameResult}
        </Typography>
      </Box>
      
      <Typography variant="h6">正解のお題は「{topic}」でした</Typography>
      
      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">プレイヤーの役割</Typography>
      <List sx={{ maxWidth: 400, mx: 'auto', textAlign: 'left' }}>
        {players.map((player) => (
          <ListItem key={player.name}>
            <ListItemText primary={player.name} />
            <Chip 
              label={player.role === 'insider' ? 'インサイダー' : '市民'}
              color={player.role === 'insider' ? 'error' : 'default'}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 5 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<ReplayIcon />}
          onClick={handleRestart}
          sx={{ fontWeight: 'bold' }}
        >
          もう一度遊ぶ
        </Button>
      </Box>
    </Paper>
  );
};

export default Result;
