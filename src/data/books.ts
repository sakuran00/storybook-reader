export interface Book {
  id: string;
  title: string;
  subtitle: string;
  status: "available" | "unavailable";
  author: string;
  cover: string;
  pages?: {
    image: string;
    textJa?: string;
    textEn?: string;
    audioJa?: string; // 音声ファイルパス（例: /audio/adventure/adventure_page1.ja.mp3）
    audioEn?: string;
    movie?: string; // 動画ファイルパス（例: /mp4/adventure/adventure_page1.mp4）
  }[];
}

export const BOOKS: Book[] = [
  {
    id: "princess-adventure",
    title: "ゆうきあるおひめさまのぼうけん",
    subtitle: "日本語 / English",
    status: "available",
    author: "saku",
    cover: "/covers/おひめさまのぼうけん.png",
    pages: [
      {
        image: "/pages/adventure/adventure_cover.png",
        textJa: "/text/adventure/adventure_cover.ja.txt",
        textEn: "/text/adventure/adventure_cover.en.txt",
      },
      {
        image: "/pages/adventure/adventure_page1-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page1.mp4",
      },
      {
        image: "/pages/adventure/adventure_page1-2.png",
        textJa: "/text/adventure/adventure_page1.ja.txt",
        textEn: "/text/adventure/adventure_page1.en.txt",
        audioJa: "/audio/adventure/adventure_page1.ja.mp3",
        audioEn: "/audio/adventure/adventure_page1.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page2-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page2.mp4",
      },
      {
        image: "/pages/adventure/adventure_page2-2.png",
        textJa: "/text/adventure/adventure_page2.ja.txt",
        textEn: "/text/adventure/adventure_page2.en.txt",
        audioJa: "/audio/adventure/adventure_page2.ja.mp3",
        audioEn: "/audio/adventure/adventure_page2.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page3-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page3.mp4",
      },
      {
        image: "/pages/adventure/adventure_page3-2.png",
        textJa: "/text/adventure/adventure_page3.ja.txt",
        textEn: "/text/adventure/adventure_page3.en.txt",
        audioJa: "/audio/adventure/adventure_page3.ja.mp3",
        audioEn: "/audio/adventure/adventure_page3.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page4-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page4.mp4",
      },
      {
        image: "/pages/adventure/adventure_page4-2.png",
        textJa: "/text/adventure/adventure_page4.ja.txt",
        textEn: "/text/adventure/adventure_page4.en.txt",
        audioJa: "/audio/adventure/adventure_page4.ja.mp3",
        audioEn: "/audio/adventure/adventure_page4.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page5-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page5.mp4",
      },
      {
        image: "/pages/adventure/adventure_page5-2.png",
        textJa: "/text/adventure/adventure_page5.ja.txt",
        textEn: "/text/adventure/adventure_page5.en.txt",
        audioJa: "/audio/adventure/adventure_page5.ja.mp3",
        audioEn: "/audio/adventure/adventure_page5.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page6-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page6.mp4",
      },
      {
        image: "/pages/adventure/adventure_page6-2.png",
        textJa: "/text/adventure/adventure_page6.ja.txt",
        textEn: "/text/adventure/adventure_page6.en.txt",
        audioJa: "/audio/adventure/adventure_page6.ja.mp3",
        audioEn: "/audio/adventure/adventure_page6.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page7-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page7.mp4",
      },
      {
        image: "/pages/adventure/adventure_page7-2.png",
        textJa: "/text/adventure/adventure_page7.ja.txt",
        textEn: "/text/adventure/adventure_page7.en.txt",
        audioJa: "/audio/adventure/adventure_page7.ja.mp3",
        audioEn: "/audio/adventure/adventure_page7.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page8-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page8.mp4",
      },
      {
        image: "/pages/adventure/adventure_page8-2.png",
        textJa: "/text/adventure/adventure_page8.ja.txt",
        textEn: "/text/adventure/adventure_page8.en.txt",
        audioJa: "/audio/adventure/adventure_page8.ja.mp3",
        audioEn: "/audio/adventure/adventure_page8.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page9-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page9.mp4",
      },
      {
        image: "/pages/adventure/adventure_page9-2.png",
        textJa: "/text/adventure/adventure_page9.ja.txt",
        textEn: "/text/adventure/adventure_page9.en.txt",
        audioJa: "/audio/adventure/adventure_page9.ja.mp3",
        audioEn: "/audio/adventure/adventure_page9.en.mp3",
      },
      {
        image: "/pages/adventure/adventure_page10-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/adventure/adventure_page10.mp4",
      },
      {
        image: "/pages/adventure/adventure_page10-2.png",
        textJa: "/text/adventure/adventure_page10.ja.txt",
        textEn: "/text/adventure/adventure_page10.en.txt",
        audioJa: "/audio/adventure/adventure_page10.ja.mp3",
        audioEn: "/audio/adventure/adventure_page10.en.mp3",
      },
    ],
  },
  {
    id: "magic-forest-princess",
    title: "まほうのもりのゆうきなおひめさま",
    subtitle: "日本語 / English",
    status: "available",
    author: "saku",
    cover: "/covers/もりのゆうきなおひめさま.png",
    pages: [
      {
        image: "/pages/magicForest/magicForest_cover.png",
        textJa: "/text/magicForest/magicForest_cover.ja.txt",
        textEn: "/text/magicForest/magicForest_cover.en.txt",
      },
      {
        image: "/pages/magicForest/magicForest_page1-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page1.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page1-2.png",
        textJa: "/text/magicForest/magicForest_page1.ja.txt",
        textEn: "/text/magicForest/magicForest_page1.en.txt",
        audioJa: "/audio/magicForest/magicForest_page1.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page1.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page2-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page2.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page2-2.png",
        textJa: "/text/magicForest/magicForest_page2.ja.txt",
        textEn: "/text/magicForest/magicForest_page2.en.txt",
        audioJa: "/audio/magicForest/magicForest_page2.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page2.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page3-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page3.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page3-2.png",
        textJa: "/text/magicForest/magicForest_page3.ja.txt",
        textEn: "/text/magicForest/magicForest_page3.en.txt",
        audioJa: "/audio/magicForest/magicForest_page3.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page3.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page4-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page4.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page4-2.png",
        textJa: "/text/magicForest/magicForest_page4.ja.txt",
        textEn: "/text/magicForest/magicForest_page4.en.txt",
        audioJa: "/audio/magicForest/magicForest_page4.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page4.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page5-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page5.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page5-2.png",
        textJa: "/text/magicForest/magicForest_page5.ja.txt",
        textEn: "/text/magicForest/magicForest_page5.en.txt",
        audioJa: "/audio/magicForest/magicForest_page5.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page5.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page6-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page6.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page6-2.png",
        textJa: "/text/magicForest/magicForest_page6.ja.txt",
        textEn: "/text/magicForest/magicForest_page6.en.txt",
        audioJa: "/audio/magicForest/magicForest_page6.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page6.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page7-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page7.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page7-2.png",
        textJa: "/text/magicForest/magicForest_page7.ja.txt",
        textEn: "/text/magicForest/magicForest_page7.en.txt",
        audioJa: "/audio/magicForest/magicForest_page7.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page7.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page8-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page8.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page8-2.png",
        textJa: "/text/magicForest/magicForest_page8.ja.txt",
        textEn: "/text/magicForest/magicForest_page8.en.txt",
        audioJa: "/audio/magicForest/magicForest_page8.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page8.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page9-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page9.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page9-2.png",
        textJa: "/text/magicForest/magicForest_page9.ja.txt",
        textEn: "/text/magicForest/magicForest_page9.en.txt",
        audioJa: "/audio/magicForest/magicForest_page9.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page9.en.mp3",
      },
      {
        image: "/pages/magicForest/magicForest_page10-1.png",
        movie: "https://luqxulvnmkwmqpiskdvn.supabase.co/storage/v1/object/public/mp4/magicForest/magicForest_page10.mp4",
      },
      {
        image: "/pages/magicForest/magicForest_page10-2.png",
        textJa: "/text/magicForest/magicForest_page10.ja.txt",
        textEn: "/text/magicForest/magicForest_page10.en.txt",
        audioJa: "/audio/magicForest/magicForest_page10.ja.mp3",
        audioEn: "/audio/magicForest/magicForest_page10.en.mp3",
      },
    ],
  },
  {
    id: "coming-soon",
    title: "追加予定",
    subtitle: "Coming soon",
    status: "unavailable",
    author: "",
    cover: "/covers/magic book (ロゴ).png",
  },
];
