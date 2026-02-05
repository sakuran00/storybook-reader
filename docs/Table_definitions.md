# テーブル定義書 (案)

## `books` (絵本マスタ)
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | text | PK | 絵本ID (例: `magic-forest`) |
| title | text | NOT NULL | タイトル |
| author | text | | 作者名 |
| cover_url | text | | 表紙画像のURL/パス |
| status | text | | 公開状態 (`public`, `draft`など) |
| created_at | timestamptz | DEFAULT now() | 作成日時 |

## `pages` (ページ詳細)
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | uuid | PK, DEFAULT uuid() | 一意なID |
| book_id | text | FK(books.id) | 絵本ID |
| page_index | integer | NOT NULL | ページの順序 (0, 1, 2...) |
| image_path | text | NOT NULL | 画像のStorageパス |
| text_path_ja | text | | 日本語テキストファイルのパス |
| audio_path_ja | text | | 日本語音声ファイルのパス |
| text_path_en | text | | 英語テキストファイルのパス |
| audio_path_en | text | | 英語音声ファイルのパス |

## `reading_logs` (読書履歴) ※ユーザー機能追加用
| カラム名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| user_id | uuid | FK(auth.users) | ユーザーID |
| book_id | text | FK(books.id) | 絵本ID |
| current_page | integer | | 現在開いているページ |
| completed | boolean | DEFAULT false | 読了したかどうか |
| updated_at | timestamptz | | 最終更新日時 |
