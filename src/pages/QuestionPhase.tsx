import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { HistoryItem } from '../types';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { keyframes } from '@emotion/react';

const blink = keyframes`
  50% {
    opacity: 0;
  }
`;

const QuestionPhase = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const { players, audienceNames, timer, isTimerRunning, history, timerDurationMinutes } = state;

  const [questioner, setQuestioner] = useState('');
  const [question, setQuestion] = useState('');

  const allQuestioners = [...players.map(p => p.name), ...audienceNames].sort();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, dispatch]);

  const handleAnswerSelect = (newAnswer: string) => {
    if (questioner && question) {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { playerName: questioner, question, answer: newAnswer },
      });
      setQuestion('');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getAnswerChipColor = (answer: string): 'error' | 'info' | 'success' => {
    switch (answer) {
      case 'はい':
        return 'error';
      case 'いいえ':
        return 'info';
      case 'わからない':
        return 'success';
      default:
        return 'success'; // Fallback
    }
  };

  const handleDurationChange = (amount: number) => {
    const newDuration = Math.max(1, timerDurationMinutes + amount); // 1分未満にはしない
    dispatch({ type: 'SET_TIMER_DURATION', payload: newDuration });
  };

  return (
    <Grid container spacing={4}>
      {/* Left: Timer and History */}
      <Grid xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h5" gutterBottom>
            質問履歴
          </Typography>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {history.map((item: HistoryItem, index: number) => (
              <ListItem
                key={index}
                divider
                secondaryAction={
                  <Chip
                    label={item.answer}
                    color={getAnswerChipColor(item.answer)}
                    size="small"
                  />
                }
              >
                <ListItemText
                  primary={
                    <>
                      <Typography component="span">{item.playerName}: </Typography>
                      <Typography component="span" sx={{ fontWeight: 'bold' }}>{item.question}</Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Right: Controls */}
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

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>質問を記録</Typography>
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>質問者</InputLabel>
              <Select value={questioner} label="質問者" onChange={(e) => setQuestioner(e.target.value)}>
                {allQuestioners.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="質問内容"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Button
                variant="contained"
                color="error" // 赤系
                onClick={() => handleAnswerSelect('はい')}
                sx={{ flexGrow: 1, mx: 1, fontWeight: 'bold' }}
              >
                はい
              </Button>
              <Button
                variant="contained" // 背景色を適用するためにcontainedに変更
                color="info" // 水色系
                onClick={() => handleAnswerSelect('いいえ')}
                sx={{ flexGrow: 1, mx: 1, fontWeight: 'bold' }}
              >
                いいえ
              </Button>
              <Button
                variant="outlined"
                color="success" // 緑系
                onClick={() => handleAnswerSelect('わからない')}
                sx={{ flexGrow: 1, mx: 1, fontWeight: 'bold' }}
              >
                わからない
              </Button>
            </Box>
          </Box>
        </Paper>
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          sx={{ mt: 3, fontWeight: 'bold' }}
          onClick={() => navigate('/guess-topic')}
        >
          お題推測へ
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          sx={{ mt: 1, fontWeight: 'bold' }}
          onClick={() => navigate('/role-check')}
        >
          一つ前の画面に戻る
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          fullWidth
          sx={{ mt: 1, fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          初めの画面に戻る
        </Button>
      </Grid>
    </Grid>
  );
};

export default QuestionPhase;
