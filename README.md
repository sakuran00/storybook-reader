# Storybook Reader

![App Demo](./public/demo.gif)

## 概要

このプロジェクトは、絵本を読み進めながら音声読み上げや多言語（日本語・英語）への切り替えができるWeb絵本リーダーアプリです。

## デモURL・デモアカウント

- **デモURL**: [https://storybook-reader.vercel.app/]) 
- **デモアカウント**:
  - **Email**: ` test@example.com`
  - **Password**: `pass1234`

## 画面キャプチャ

![トップ画面](./public/capture1.png)
![リーダー画面](./public/capture2.png)
*(※ 画像ファイルやGIFは適切なパスに変更してください)*

## 要件定義
本アプリは、子供から大人まで楽しめる「多言語対応の絵本リーダー」を目的としています。
- **ターゲットユーザー**: 絵本を楽しみたい子供、語学学習をしたい大人
- **コアバリュー**: 視覚的なページめくり機能と共に、ネイティブに近い音声読み上げを提供することで、言語学習と読書体験を同時にスムーズに行えるようにする。

## 機能一覧

- **絵本をめくる機能**: `react-pageflip` を用いた、実際の本のようなページめくりアニメーション
- **多言語対応 (日・英)**: 日本語と英語のテキスト切り替えに対応
- **音声読み上げ**: 音声の再生・停止機能。Edge TTSを利用した自然な読み上げ
- **ユーザー認証**: Supabase Auth,Google認証によるアカウント作成 / ログイン機能
- **お気に入り機能**: 好きな絵本をお気に入り登録・管理できる機能
- **作品一覧表示**: 読みたい絵本をスムーズに探せる本棚

## 使用技術 (フレームワーク・ライブラリ)

### フロントエンド / サーバー
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4, Radix UI, Lucide React
- **Forms**: React Hook Form, Zod
- **Animation**: react-pageflip (ページめくりアニメーション)

### バックエンド / データベース
- **BaaS**: Supabase (Auth, Database)
- **ORM**: Prisma (PostgreSQL / `@prisma/adapter-pg`)

## 使用している外部API

- **Supabase**: ユーザー認証およびデータベース接続のバックエンドとして利用
- **Microsoft Edge TTS**: 絵本の読み上げ音声ファイル生成時に利用（`scripts/generate_audio.py` 内で利用）

## 環境構築方法

### 前提条件
- Node.js (v20以上推奨)
- Supabaseプロジェクト (URL, Anon Key, Database URL)

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
ルートディレクトリに `.env.local` などの設定ファイルを作成し、自身のSupabaseの情報等を入力してください。
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
DATABASE_URL="your-database-connection-url"
```

### 3. データベースのセットアップ (Prisma)
Prismaを利用してデータベースへのマイグレーションを適用します。
```bash
npx prisma generate
npx prisma db push
```

### 4. 開発サーバーの立ち上げ
```bash
npm run dev
```
起動後、ブラウザで `http://localhost:3000` にアクセスしてください。

---

### (オプション) 音声ファイルの生成
必要に応じてPythonスクリプトを実行し、絵本テキスト（日本語・英語）から音声を生成することが可能です。
```bash
pip install edge-tts
# または python3 を使用
python scripts/generate_audio.py
```

## 今後実装予定の機能

- ダークモード表示切り替え
- 読書履歴（前回どこまで読んだかの記録・再開機能）
- UI/UXの更新
- モバイル・タブレットでのジェスチャー操作の強化機能
- 絵本のアニメーション
- AIの組み込み（キャラクターとお話できる）

