import os
import asyncio
import edge_tts

# ==========================================
# 設定エリア: ここで場所や声を指定
# ==========================================

#テキストファイルが置いてある場所
TEXT_DIR = "public/text/adventure"

#音声ファイルを保存する場所
AUDIO_DIR = "public/audio/adventure"

# 使用する声の種類（MicrosoftのAI音声）
VOICE_JA = "ja-JP-NanamiNeural"
VOICE_EN = "en-US-AvaMultilingualNeural"

# ==========================================
# メインの処理
# ==========================================

async def main():
    #1 保存先のフォルダがない場合作成
    os.makedirs(AUDIO_DIR, exist_ok=True)
    print(f" 保存先を確認:{AUDIO_DIR}")

    #2 テキストフォルダ内のファイル一覧を取得
    files = sorted([f for f in os.listdir(TEXT_DIR) if f.endswith("ja.txt")])#ファイルを名前順に
    print(f"{TEXT_DIR}の中にあるファイルを処理します..")

    #3 ファイルを一つずつ順番に処理するループ
    for filename in files:

        # txtファイルのみ処理
        if not filename.endswith(".txt"):
            continue

        # ファイルのパス作成
        text_path = os.path.join(TEXT_DIR, filename)

        # ファイルの中身を読み込む
        with open(text_path, "r", encoding="utf-8") as f:
            text = f.read().strip() # 前後の余計な空白や改行を削除

        # もし中に何の文章も入っていなかった場合、スキップ
        if not text:
            print(f"{filename}は中身がないのでスキップします")
            continue

        # ファイル名を見て、日本語か英語かを判断して声を選択 
        voice =VOICE_JA if filename.endswith(".ja.txt") else VOICE_EN
        if not voice: continue

        audio_filename = filename.replace(".txt", ".mp3")
        audio_path = os.path.join(AUDIO_DIR, audio_filename)

        print(f"生成開始: {filename} ", end="", flush=True)

        try:
            communicate = edge_tts.Communicate(text, voice, rate="-10%")
            await communicate.save(audio_path)
            print(f" 音声を生成・保存しました: {audio_filename}")
        except Exception as e:
            print(f" エラーが発生しました: {e}")

print("全ての作業が完了しました")

if __name__ == "__main__":
    asyncio.run(main())
