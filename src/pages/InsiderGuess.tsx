import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import {
  Button,
  Typography,
  Paper,
  Stack,
  Box,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Player } from '../types';

const InsiderGuess = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const { players } = state;

  // Initialize votes state
  const [votes, setVotes] = useState<{[key: string]: number}>(() => 
    players.reduce((acc: {[key: string]: number}, player: Player) => {
      acc[player.name] = 0;
      return acc;
    }, {})
  );

  const handleVoteChange = (playerName: string, delta: number) => {
    setVotes(prevVotes => ({
      ...prevVotes,
      [playerName]: Math.max(0, prevVotes[playerName] + delta),
    }));
  };

  const handleCountVotes = () => {
    const maxVotes = Math.max(...Object.values(votes));
    const mostVotedPlayers = Object.keys(votes).filter(name => votes[name] === maxVotes);

    // If there is a tie, or no one has votes, the insider team wins.
    if (mostVotedPlayers.length !== 1) {
      dispatch({ type: 'SET_RESULT', payload: 'インサイダーチームの勝利' });
      navigate('/result');
      return;
    }

    const guessedPlayerName = mostVotedPlayers[0];
    const guessedPlayer = players.find((p: Player) => p.name === guessedPlayerName);

    if (guessedPlayer?.role === 'insider') {
      dispatch({ type: 'SET_RESULT', payload: '市民チームの勝利' });
    } else {
      dispatch({ type: 'SET_RESULT', payload: 'インサイダーチームの勝利' });
    }

    navigate('/result');
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        インサイダーは誰だ？
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        インサイダーだと思うプレイヤーに投票してください。
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {players.map((player: Player) => (
          <Grid key={player.name} xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" textAlign="center">
                  {player.name}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    my: 2,
                  }}
                >
                  <IconButton onClick={() => handleVoteChange(player.name, -1)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="h4" component="span" sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
                    {votes[player.name]}
                  </Typography>
                  <IconButton onClick={() => handleVoteChange(player.name, 1)}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Stack spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleCountVotes}
          sx={{ fontWeight: 'bold' }}
        >
          開票
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/guess-topic')}
        >
          一つ前の画面に戻る
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => navigate('/')}
        >
          初めの画面に戻る
        </Button>
      </Stack>
    </Paper>
  );
};

export default InsiderGuess;
