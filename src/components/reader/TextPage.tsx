"use client"

import { useEffect, useState } from "react";
import Image from "next/image";

interface TextPageProps{
    imageSrc: string;
    textUrl: string;
    audioUrl?: string;
}

export default function TextPage({ imageSrc, textUrl, audioUrl}: TextPageProps){
    const[text, setText] = useState<string>("")
    const[loading, setLoading] = useState(true);
    const[isAnimating, setIsAnimating] = useState(true)

    const styleText = (rawText: string) => {
    setText(rawText);
    };

    useEffect(() => {
        fetch(textUrl)
        .then((res) => res.text())
        .then((t) => styleText(t))
        .finally(() => setLoading(false))
    },[textUrl]);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 600);
        return () => clearTimeout(timer);
    },[]
    )

    return(
    <section className="flex flex-col gap-6 rounded-xl bg-white/70 backdrop-blur p-6 shadow-sm book-perspective">
        {/* 画像（上） */}
        <div className="relative max-w-[3/4] h-[800px] overflow-hidden rounded-lg bg-gray-100">
            <Image src={imageSrc} alt="Text page image" fill className="object-contain" sizes="100vw"/>
        </div>

        {/* テキスト + 音声（下） */}
        <div>
            {loading ? (
                <p className="text-gray-500">読み込み中</p>
            ) : (
                <>
                    <pre className="whitespace-pre-wrap text-lg leading-8 text-gray-800">{text}</pre>
                    {audioUrl && (
                        <div className="mt-4">
                            <audio controls className="w-full">
                                <source src={audioUrl} type="audio/mpeg"/>
                                お使いのブラウザは、audio要素をサポートしていません。
                            </audio>
                        </div>
                    )}
                </>
            )}
        </div>
    </section>
);
}

