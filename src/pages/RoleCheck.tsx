import React, { useState } from 'react';
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
  Divider,
  Snackbar,
  TextField,
  Stack,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplayIcon from '@mui/icons-material/Replay';

const RoleCheck = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const { players, topic, insiderCount } = state;
  const [showRoles, setShowRoles] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState('');

  const handleCopyToClipboard = () => {
    const insiders = players.filter(p => p.role === 'insider').map(p => p.name).join(', ');
    const textToCopy = `
お題: ${topic}
---
インサイダー (${insiderCount}人): ${insiders}
---
プレイヤー:
${players.map(p => `- ${p.name}`).join('\n')}
    `;
    navigator.clipboard.writeText(textToCopy.trim());
    setSnackbarOpen(true);
  };

  const handleSetCustomTopic = () => {
    if (customTopic.trim() !== '') {
      dispatch({ type: 'SET_TOPIC', payload: customTopic.trim() });
    }
  };

  const handleGoToQuestionPhase = () => {
    dispatch({ type: 'CHANGE_PHASE', payload: 'QuestionPhase' });
    navigate('/question-phase');
  };
  
  const handleChangeTopicRandomly = () => {
    dispatch({ type: 'CHANGE_TOPIC_RANDOMLY' });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        お題と役割の確認
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">お題</Typography>
          <IconButton
            aria-label="お題を再抽選"
            onClick={handleChangeTopicRandomly}
          >
            <ReplayIcon />
          </IconButton>
        </Stack>

        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', mb: 2 }}>
          {topic}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TextField 
            label="自由にお題を設定"
            variant="outlined"
            size="small"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button 
            variant="contained" 
            onClick={handleSetCustomTopic}
            disabled={!customTopic.trim()}
            sx={{ fontWeight: 'bold' }}
          >
            お題を設定
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">プレイヤーの役割</Typography>
      {!showRoles && (
        <Button variant="contained" onClick={() => setShowRoles(true)} sx={{ my: 2, fontWeight: 'bold' }}>
          役割を表示する
        </Button>
      )}
      
      {showRoles && (
        <List>
          {players.map((player) => (
            <ListItem key={player.name}>
              <ListItemText 
                primary={player.name}
                secondary={player.role === 'insider' ? 'インサイダー' : '市民'}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyToClipboard}
          sx={{ fontWeight: 'bold' }}
        >
          お題と役割をコピー
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoToQuestionPhase}
          disabled={!showRoles}
          sx={{ fontWeight: 'bold' }}
        >
          質問フェーズへ
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/')}
          sx={{ fontWeight: 'bold' }}
        >
          初めの画面に戻る
        </Button>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="クリップボードにコピーしました"
      />
    </Paper>
  );
};

export default RoleCheck;
