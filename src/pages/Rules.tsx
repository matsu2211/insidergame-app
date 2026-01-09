import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, Divider } from '@mui/material';

const Rules: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 500,
          letterSpacing: '0.1em',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          mb: 1,
        }}
      >
        インサイダーゲームのルール
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ my: 2, textAlign: 'left' }}>
        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
            ゲームの目的
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 0.5 }}>
            - 市民チーム: 制限時間内にマスターからお題を当て、インサイダーが誰か当てる。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 0.5 }}>
            - インサイダー: 正体を隠しながら、市民をお題の正解に導く。
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
            役割
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 0.5 }}>
            - マスター: 1人。お題を知っており、質問に「はい」「いいえ」「わからない」だけで答える。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 0.5 }}>
            - インサイダー: 1人（設定可能）。お題を知っているが、市民のフリをする。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 0.5 }}>
            - 市民: 残りの全員。お題を知らない。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 0.5 }}>
            - オーディエンス: 見学者。質問はできるが、インサイダー投票はできない。
          </Typography>
        </Box>
        {/* 他のルールもここに追加できます */}
      </Box>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2, fontWeight: 'bold' }}>
        ロビーに戻る
      </Button>
    </Paper>
  );
};

export default Rules;
