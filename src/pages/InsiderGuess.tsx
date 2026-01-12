import React, { useState, useEffect } from 'react';
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { keyframes } from '@emotion/react';

const blink = keyframes`
  50% {
    opacity: 0;
  }
`;

const InsiderGuess = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const { players, timer, isTimerRunning, timerDurationMinutes } = state;

  // Initialize votes state
  const [votes, setVotes] = useState<{[key: string]: number}>(() => 
    players.reduce((acc: {[key: string]: number}, player: Player) => {
      acc[player.name] = 0;
      return acc;
    }, {})
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      dispatch({ type: 'STOP_TIMER' });
      handleCountVotes();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer, dispatch]);


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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleDurationChange = (amount: number) => {
    const newDuration = Math.max(1, timerDurationMinutes + amount); // 1分未満にはしない
    dispatch({ type: 'SET_TIMER_DURATION', payload: newDuration });
  };

  return (
    <Grid container spacing={4}>
      <Grid xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
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
        </Paper>
      </Grid>
      <Grid xs={12} md={5}>
      <Paper elevation={10} sx={{ bgcolor: 'white', color: 'grey.800', p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'error.main', // 少し落ち着いた赤
                  mr: 1.5,
                  animation: isTimerRunning ? `${blink} 1s linear infinite` : 'none',
                }}
              />
              <Typography sx={{ letterSpacing: 1 }}>Timer</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>{timerDurationMinutes} min</Typography>
          </Box>
          <Typography
            variant="h2"
            component="div"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 2,
              bgcolor: 'grey.200', // タイマー表示の背景色
              color: 'grey.900', // タイマー表示の文字色
              p: 2,
              borderRadius: 1,
              mb: 2,
            }}
          >
            {formatTime(timer)}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <IconButton
              aria-label="decrease timer"
              onClick={() => handleDurationChange(-1)}
              sx={{ color: 'grey.800' }}
              disabled={isTimerRunning}
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              aria-label="start/stop timer"
              onClick={() => dispatch({ type: isTimerRunning ? 'STOP_TIMER' : 'START_TIMER' })}
              disabled={timer === 0 && !isTimerRunning}
              sx={{
                bgcolor: 'error.main', // ボタンの背景色も変更
                color: 'white',
                '&:hover': { bgcolor: 'error.dark' },
              }}
            >
              {isTimerRunning ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
              aria-label="increase timer"
              onClick={() => handleDurationChange(1)}
              sx={{ color: 'grey.800' }}
              disabled={isTimerRunning}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        </Paper>
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
      </Grid>
    </Grid>
  );
};

export default InsiderGuess;
