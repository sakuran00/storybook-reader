# テーブル定義書

## `users` (ユーザー)
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | uuid | PK | ユーザーID |
| email | text | NOT NULL, UNIQUE | メールアドレス |
| created_at | timestamptz | DEFAULT now() | 作成日時 |
| updated_at | timestamptz | DEFAULT now() | 更新日時 |

## `profiles` (プロフィール)
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | uuid | PK | プロフィールID |
| user_id | uuid | FK(users.id), UNIQUE | ユーザーID |
| nickname | text | | 表示名 |
| avatar_url | text | | アバター画像URL |

## `books` (絵本マスタ)
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | text | PK | 絵本ID (例: `princess-adventure`) |
| title | text | NOT NULL | タイトル |
| author | text | | 作者名 |
| cover_url | text | NOT NULL | 表紙画像のURL/パス |
| status | text | DEFAULT 'available' | 公開状態 (`available`, `unavailable`) |

## `pages` (ページ詳細)
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | uuid | PK, DEFAULT uuid() | 一意なID |
| book_id | text | FK(books.id) | 絵本ID |
| page_number | integer | NOT NULL | ページ番号 (0, 1, 2...) |
| image_url | text | NOT NULL | 画像のパス |
| text_ja_url | text | | 日本語テキストファイルのパス |
| text_en_url | text | | 英語テキストファイルのパス |
| audio_ja_url | text | | 日本語音声ファイルのパス |
| audio_en_url | text | | 英語音声ファイルのパス |

**ユニーク制約:** `(book_id, page_number)`

## `reading_progress` (読書進捗)
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | uuid | PK, DEFAULT uuid() | 一意なID |
| user_id | uuid | FK(users.id) | ユーザーID |
| book_id | text | FK(books.id) | 絵本ID |
| last_page_index | integer | DEFAULT 0 | 最後に読んだページ |
| is_finished | boolean | DEFAULT false | 読了フラグ |
| updated_at | timestamptz | DEFAULT now() | 最終アクセス日時 |
| language |  text | DEFAULT 'en', CHECK(language IN ('ja', 'en')) | 最後に読んでた時の言語 |

**ユニーク制約:** `(user_id, book_id)`
