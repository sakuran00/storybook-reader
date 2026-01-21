/** カテゴリ型定義 */
export type Category = 'attitude' | 'symbol' | 'all';

/** 音声情報 */
export interface Voice {
  id: string;
  language: 'ja' | 'en';
  narrator: string; // 朗読者名
  audioUrl: string;
  duration: number; // 秒単位
}

/** ページ情報 */
export interface Page {
  id: string;
  pageNumber: number;
  text: string; // ページのテキスト本文
  imageUrl: string; // イラスト画像
  voices: Voice[]; // 複数言語の朗読対応
}

/** 絵本情報 */
export interface Book {
  id: string;
  title: string;
  author: string;
  illustrator: string;
  category: Category;
  description: string;
  pages: Page[];
  coverImageUrl: string;
  totalDuration: number; // 全ページの総再生時間
  createdAt: Date;
  updatedAt: Date;
}

/** 再生状態管理 */
export interface PlaybackState {
  currentPageIndex: number; // 0から始まるページインデックス
  currentBookId: string;
  isPlaying: boolean;
  currentLanguage: 'ja' | 'en';
  volume: number; // 0-100
  currentTime: number; // 現在の再生位置（秒）
}

/** UIコンポーネント用のプロップス型 */
export interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export interface PageViewerProps {
  page: Page;
  voices: Voice[];
}

export interface AudioPlayerProps {
  currentPage: Page;
  isPlaying: boolean;
  currentTime: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onLanguageChange: (language: 'ja' | 'en') => void;
}