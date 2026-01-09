import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Home = () => {
  const { state, dispatch } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newAudienceName, setNewAudienceName] = useState('');
  const navigate = useNavigate();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName) {
      dispatch({ type: 'ADD_PLAYER_NAME', payload: newPlayerName });
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    dispatch({ type: 'REMOVE_PLAYER_NAME', payload: name });
  };

  const handleAddAudience = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAudienceName) {
      dispatch({ type: 'ADD_AUDIENCE_NAME', payload: newAudienceName });
      setNewAudienceName('');
    }
  };

  const handleRemoveAudience = (name: string) => {
    dispatch({ type: 'REMOVE_AUDIENCE_NAME', payload: name });
  };
  
  const handleStartGame = () => {
    if (state.playerNames.length >= 3) {
      dispatch({ type: 'SETUP_GAME' });
      navigate('/role-check');
    }
  };

  const insiderOptions = Array.from({ length: Math.max(0, state.playerNames.length - 2) }, (_, i) => i + 1);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        ゲーム設定
      </Typography>

      <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
        参加プレイヤー
      </Typography>
      
      {/* Player Add Form */}
      <Box component="form" onSubmit={handleAddPlayer} sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="新しいプレイヤー名"
          variant="outlined"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" sx={{ whiteSpace: 'nowrap' }}>
          追加
        </Button>
      </Box>

      {/* Player List */}
      <List dense>
        {state.playerNames.map((name) => (
          <ListItem
            key={name}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePlayer(name)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" component="h3">
        オーディエンス (質問のみ)
      </Typography>

      {/* Audience Add Form */}
      <Box component="form" onSubmit={handleAddAudience} sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
        <TextField
          label="新しいオーディエンス名"
          variant="outlined"
          value={newAudienceName}
          onChange={(e) => setNewAudienceName(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="secondary" sx={{ whiteSpace: 'nowrap' }}>
          追加
        </Button>
      </Box>

      {/* Audience List */}
      <List dense>
        {state.audienceNames.map((name) => (
          <ListItem
            key={name}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAudience(name)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>


      {/* Insider Count Select */}
      {state.playerNames.length >= 3 && (
        <FormControl fullWidth sx={{ my: 3 }}>
          <InputLabel id="insider-count-label">インサイダーの人数</InputLabel>
          <Select
            labelId="insider-count-label"
            value={state.insiderCount}
            label="インサイダーの人数"
            onChange={(e) => dispatch({ type: 'SET_INSIDER_COUNT', payload: Number(e.target.value) })}
          >
            {insiderOptions.map((num) => (
              <MenuItem key={num} value={num}>{num}人</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Action Buttons */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          onClick={handleStartGame}
          disabled={state.playerNames.length < 3}
        >
          ゲーム開始
        </Button>
        <Button
          variant="outlined"
          color="info"
          size="large"
          fullWidth
          onClick={() => navigate('/rules')}
        >
          ルールを確認
        </Button>
      </Box>
      {state.playerNames.length < 3 && (
        <Typography variant="caption" color="error" display="block" mt={1}>
          ※ プレイヤーが3人以上必要です
        </Typography>
      )}
    </Paper>
  );
};

export default Home;