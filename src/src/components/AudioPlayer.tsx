import React, { useState } from 'react';
import { PlayIcon, PauseIcon, Volume2Icon } from 'lucide-react';
interface AudioPlayerProps {
  title: string;
  duration: string;
}
export default function AudioPlayer({ title, duration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [autoplay, setAutoplay] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900">{title}</span>
        <span className="text-sm text-gray-500">{duration}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-[#979DA5] hover:bg-[#858b93] rounded-full flex items-center justify-center transition-colors">

          {isPlaying ?
          <PauseIcon className="w-5 h-5 text-white" /> :

          <PlayIcon className="w-5 h-5 text-white ml-0.5" />
          }
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #979DA5 0%, #979DA5 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
            }} />

        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Volume2Icon className="w-4 h-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #979DA5 0%, #979DA5 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
            }} />

        </div>

        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#979DA5] focus:border-transparent outline-none">

          <option>0.5x</option>
          <option>0.75x</option>
          <option>1.0x</option>
          <option>1.25x</option>
          <option>1.5x</option>
          <option>2.0x</option>
        </select>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
            className="w-4 h-4 text-[#979DA5] border-gray-300 rounded focus:ring-[#979DA5]" />

          <span className="text-gray-700">Autoplay</span>
        </label>
      </div>
    </div>);

}