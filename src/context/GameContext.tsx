import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { Player, GamePhase, GameResult, HistoryItem } from '../types';

// --- 状態の型定義 ---
export interface GameState {
  playerNames: string[]; // Home画面で設定するプレイヤー名
  audienceNames: string[]; // 質問のみ参加するオーディエンス名
  players: Player[]; // 役割割り当て後のプレイヤー
  insiderCount: number;
  topic: string;
  phase: GamePhase;
  history: HistoryItem[];
  gameResult: GameResult;
  timer: number;
  timerDurationMinutes: number; // New: タイマーの初期設定値（分）
  isTimerRunning: boolean;
  questionPlayerIndex: number;
}

// --- アクションの型定義 ---
export type GameAction =
  | { type: 'ADD_PLAYER_NAME'; payload: string }
  | { type: 'REMOVE_PLAYER_NAME'; payload: string }
  | { type: 'ADD_AUDIENCE_NAME'; payload: string }
  | { type: 'REMOVE_AUDIENCE_NAME'; payload: string }
  | { type: 'SET_INSIDER_COUNT'; payload: number }
  | { type: 'SETUP_GAME' }
  | { type: 'CHANGE_PHASE'; payload: GamePhase }
  | { type: 'SET_TOPIC'; payload: string }
  | { type: 'CHANGE_TOPIC_RANDOMLY' }
  | { type: 'SET_RESULT'; payload: GameResult }
  | { type: 'ADD_HISTORY'; payload: HistoryItem }
  | { type: 'START_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'SET_TIMER_DURATION'; payload: number } // New: タイマーの分単位の長さを設定
  | { type: 'RESET_GAME' }
  | { type: 'GO_TO_HOME' };

// --- コンテキストの型定義 ---
export interface GameContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

// --- 初期状態 ---
const initialState: GameState = {
  playerNames: [],
  audienceNames: [],
  players: [],
  insiderCount: 1,
  topic: '',
  phase: 'Home',
  history: [],
  gameResult: null,
  timer: 300, // 5 minutes
  timerDurationMinutes: 5, // New: 初期タイマー設定を5分に
  isTimerRunning: false,
  questionPlayerIndex: 0,
};

// --- お題リスト ---
const topics = [
  'マンガ', '小説', '辞書', '手帳', '雑誌',
  '頭', '首', '肩', '体', '手', '足',
  '壁', '柱', '床', '天井', '屋根', '屋上',
  '木', '火', '土', '金', '水', '空気',
  'ギター', 'ピアノ', 'ドラム', '笛', 'バイオリン', 'トランペット',
  '寝室', '台所', '食卓', 'トイレ', '風呂', '庭',
  '動物園', '遊園地', 'ピクニック', '山登り', '海水浴', 'カラオケ',
  '火力発電所', '乾電池', '風車', '太陽電池', '暖炉', '蒸気機関',
  '自動車', '自転車', '三輪車', 'オートバイ', '電車', '飛行機',
  '歩道', 'つり橋', 'トンネル', 'ガードレール', '横断歩道', '信号機',
  '太陽', '地球', '月', '宇宙飛行士', '天文学者', 'スペースシャトル',
  'アパート', 'デパート', 'ファストフード', 'コンビニ', 'カフェ', 'レストラン',
  'テニス', '野球', 'サッカー', '卓球', 'ゴルフ', 'レスリング',
  '帽子', 'メガネ', 'Tシャツ', 'パンツ', 'くつした', 'くつ',
  'ガラパゴス諸島', '南極', 'ハワイ', 'ニュージーランド', 'エベレスト', 'ムー大陸',
  '消防車', 'パトカー', 'ブルドーザー', 'クレーン車', 'レッカー車', 'トラクター',
  '交通標識', '電信柱', '鉄塔', 'ブロック塀', '看板', '高速道路',
  '親子', '兄弟', '姉妹', '双子', '夫婦', '同級生',
  '塩', 'コショウ', 'トウガラシ', 'しょうゆ', 'バジル', '砂糖',
  '弁護士', '国会議員', '建築家', '看護師', '教師', 'パイロット',
  'コーヒー', 'マグカップ', 'ビール', 'ワイン', 'ポップコーン', '紙コップ',
  'サイコロ', 'チェス', 'トランプ', 'ボードゲーム', 'パズル', 'カジノ',
  '小麦', 'トウモロコシ', 'そら豆', 'ピーナッツ', '牛乳', '米',
  'せっけん', '洗剤', 'スポンジ', '歯ブラシ', 'タオル', '洗濯機',
  'スプーン', 'フォーク', 'ナイフ', 'はし', 'お皿', 'コップ',
  'カレンダー', '目覚まし時計', '砂時計', 'コンパス', '影', '季節',
  '駐車場', 'テニスコート', '住宅地', '畑', 'チョコレート', '方眼紙',
  'ボールペン', 'ふで', 'ノート', '鉛筆', '絵の具', '定規',
  '誕生日', 'プレゼント', 'クリスマス', 'パーティ', '結婚式', 'お墓',
  '山', '川', '森', '火山', '海', '池',
  '丸太', 'ストロー', '試験管', '望遠鏡', 'つえ', 'かさ',
  'のこぎり', 'かなづち', 'はさみ', 'カッター', 'オノ', 'つるはし',
  'オリンピック', 'ワールドカップ', 'マラソン', '水泳', 'トライアスロン',
  '電気', '磁石', '重力', 'かみなり', '原子力', '熱',
  'テント', 'ランプ', '寝袋', 'リュックサック', 'ロープ', 'キャンプ',
  '幽霊', 'ろうそく', 'ゾンビ', 'ピラミッド', '吸血鬼', '血',
  'ダイナマイト', '拳銃', 'ブーメラン', '弓矢', '日本刀', '戦車',
  '天気予報', 'ニュース', 'アナウンサー', 'コマーシャル', '俳優', '芸人',
  '国境', '会議', '地球温暖化', '歴史', '文化', '文明',
  'ざる', 'つぼ', 'バケツ', 'カゴ', 'どんぶり', 'ゴミ箱'
];

// --- Reducer ---
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_PLAYER_NAME':
      if (state.playerNames.includes(action.payload) || action.payload.trim() === '') {
        return state;
      }
      return {
        ...state,
        playerNames: [...state.playerNames, action.payload.trim()],
      };
    case 'REMOVE_PLAYER_NAME':
      return {
        ...state,
        playerNames: state.playerNames.filter(name => name !== action.payload),
      };
    case 'ADD_AUDIENCE_NAME':
      if (
        action.payload.trim() === '' ||
        state.playerNames.includes(action.payload.trim()) ||
        state.audienceNames.includes(action.payload.trim())
      ) {
        return state;
      }
      return {
        ...state,
        audienceNames: [...state.audienceNames, action.payload.trim()],
      };
    case 'REMOVE_AUDIENCE_NAME':
      return {
        ...state,
        audienceNames: state.audienceNames.filter(name => name !== action.payload),
      };
    case 'SET_INSIDER_COUNT':
      return {
        ...state,
        insiderCount: action.payload,
      };
    case 'SETUP_GAME':
      // プレイヤーの役割を割り当てる
      const shuffledPlayers = [...state.playerNames].sort(() => Math.random() - 0.5);
      const insiders = shuffledPlayers.slice(0, state.insiderCount);
      const newPlayers: Player[] = state.playerNames.map(name => ({
        name,
        role: insiders.includes(name) ? 'insider' : 'citizen',
      }));

      return {
        ...state,
        players: newPlayers,
        topic: topics[Math.floor(Math.random() * topics.length)],
        phase: 'RoleCheck',
        history: [],
        gameResult: null,
        timer: state.timerDurationMinutes * 60, // 変更: 設定された分単位のタイマー値を使用
        isTimerRunning: false,
      };
    case 'CHANGE_PHASE':
      // 質問フェーズに入るときにタイマーを自動スタート
      if (action.payload === 'QuestionPhase') {
        return { ...state, phase: action.payload, isTimerRunning: true };
      }
      return { ...state, phase: action.payload, isTimerRunning: false }; // 他のフェーズではタイマー停止
    case 'SET_TOPIC':
      return { ...state, topic: action.payload };
    case 'CHANGE_TOPIC_RANDOMLY':
      return {
        ...state,
        topic: topics[Math.floor(Math.random() * topics.length)],
      };
    case 'ADD_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case 'START_TIMER':
      return { ...state, isTimerRunning: true };
    case 'STOP_TIMER':
      return { ...state, isTimerRunning: false };
    case 'TICK_TIMER':
      if (state.timer > 0) {
        return { ...state, timer: state.timer - 1 };
      }
      return { ...state, isTimerRunning: false }; // 0になったら停止
    case 'SET_TIMER_DURATION': // New: タイマーの分単位の長さを設定
      const newDurationMinutes = Math.max(1, action.payload); // 最低1分
      return {
        ...state,
        timerDurationMinutes: newDurationMinutes,
        timer: newDurationMinutes * 60,
        isTimerRunning: false, // タイマー設定変更時は一時停止
      };
    case 'SET_RESULT':
      return { ...state, gameResult: action.payload };
    case 'RESET_GAME':
      return { ...initialState, playerNames: [], players: [] }; // プレイヤー名もリセット
    case 'GO_TO_HOME':
      return {
        ...initialState,
        playerNames: state.playerNames,
        audienceNames: state.audienceNames,
      };
    default:
      return state;
  }
};

// --- Contextの作成 ---
export const GameContext = createContext<GameContextType>({
  state: initialState,
  dispatch: () => null,
});

// --- Providerコンポーネント ---
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
