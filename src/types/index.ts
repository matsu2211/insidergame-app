export type PlayerRole = 'citizen' | 'insider';

export interface Player {
  name: string;
  role: PlayerRole;
}

export type GamePhase = 'Home' | 'RoleCheck' | 'QuestionPhase' | 'GuessTopic' | 'InsiderGuess' | 'Result';

export type GameResult = '市民チームの勝利' | 'インサイダーチームの勝利' | null;

export interface HistoryItem {
  playerName: string;
  question: string;
  answer: string;
}
