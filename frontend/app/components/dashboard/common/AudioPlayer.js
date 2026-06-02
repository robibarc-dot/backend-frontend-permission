"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw } from 'lucide-react';

export default function AudioPlayer({ src }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => setDuration(audio.duration);
        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
            <audio ref={audioRef} src={src} preload="metadata" />
            
            <div className="flex items-center gap-6 w-full">
                <button 
                    onClick={togglePlay}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                </button>

                <div className="flex-1 space-y-1">
                    <input 
                        type="range" 
                        min="0" 
                        max={duration || 0} 
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    <Volume2 size={18} />
                    <button 
                        onClick={() => {
                            audioRef.current.currentTime = 0;
                            if (!isPlaying) togglePlay();
                        }}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Restart"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}