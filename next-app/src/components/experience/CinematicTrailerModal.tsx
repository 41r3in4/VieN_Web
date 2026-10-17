'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHeritage } from '@/context/HeritageContext';
import { DESTINATIONS } from '@/data/destinations';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  FastForward,
  Upload,
  Video,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Subtitles,
  AlertCircle
} from 'lucide-react';
import { heritageAudio } from '@/utils/audioSynth';

export const CinematicTrailerModal: React.FC = () => {
  const {
    isTrailerOpen,
    trailerDestinationId,
    closeTrailer,
    setSelectedDestinationId,
    setIsPersonaModalOpen
  } = useHeritage();

  const destination = DESTINATIONS.find((d) => d.id === trailerDestinationId) || DESTINATIONS[0];
  const trailer = destination.videoTrailer;
  const scenes = trailer.scenes;

  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode: 'video' (real footage) vs 'slideshow' (gallery narration)
  const [activeMode, setActiveMode] = useState<'video' | 'slideshow'>('video');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [videoLoadError, setVideoLoadError] = useState<boolean>(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(75);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Slideshow state
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // Reset or initialize on modal open
  useEffect(() => {
    if (!isTrailerOpen) {
      if (customVideoUrl && customVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(customVideoUrl);
      }
      setCustomVideoUrl(null);
      setVideoLoadError(false);
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    // Play subtle gong on trailer start
    heritageAudio.playGong();
    setVideoLoadError(false);
    setActiveMode('video');
    setIsPlaying(true);
  }, [isTrailerOpen]);

  // Slideshow interval timer (when in slideshow mode or video error)
  useEffect(() => {
    if (!isTrailerOpen || activeMode !== 'slideshow') return;

    const interval = setInterval(() => {
      if (!isPlaying) return;

      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= duration) {
          return duration;
        }
        const newSceneIdx = Math.min(
          scenes.length - 1,
          Math.floor((next / duration) * scenes.length)
        );
        setCurrentSceneIndex(newSceneIdx);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTrailerOpen, isPlaying, activeMode, duration, scenes.length]);

  if (!isTrailerOpen) return null;

  const activeVideoSrc = customVideoUrl || trailer.videoUrl;
  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Skip and transition into explorer quest
  const handleSkipAndExplore = () => {
    heritageAudio.playClick();
    closeTrailer();
    setSelectedDestinationId(destination.id);
    setIsPersonaModalOpen(true);
  };

  // Video playback handlers
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
    setVideoLoadError(false);
  };

  const handleVideoError = () => {
    setVideoLoadError(true);
    // Don't auto-switch, allow user to see message or switch to slideshow
  };

  const togglePlayPause = () => {
    heritageAudio.playClick();
    if (activeMode === 'video' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    heritageAudio.setMuted(nextMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTargetTime = clickPercent * duration;

    setCurrentTime(newTargetTime);
    if (activeMode === 'video' && videoRef.current) {
      videoRef.current.currentTime = newTargetTime;
    } else {
      const newSceneIdx = Math.min(
        scenes.length - 1,
        Math.floor((newTargetTime / duration) * scenes.length)
      );
      setCurrentSceneIndex(newSceneIdx);
    }
  };

  // Local video file picker
  const handleSelectLocalVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCustomVideoUrl(blobUrl);
      setVideoLoadError(false);
      setActiveMode('video');
      setIsPlaying(true);
      heritageAudio.playSuccessChime();
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!modalRef.current) return;
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-[#1A1615] flex flex-col justify-between text-[#FAF7F2] animate-in fade-in duration-300"
    >
      {/* Top Header Bar */}
      <div className="p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-[#1A1615] via-[#1A1615]/80 to-transparent z-20">
        <div className="flex items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-stone-900/90 rounded-full p-1 border border-stone-700">
            <button
              onClick={() => {
                heritageAudio.playClick();
                setActiveMode('video');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                activeMode === 'video'
                  ? 'bg-[#C83C23] text-white shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Thực Tế</span>
            </button>
            <button
              onClick={() => {
                heritageAudio.playClick();
                setActiveMode('slideshow');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                activeMode === 'slideshow'
                  ? 'bg-[#D4AF37] text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Ảnh Thuyết Minh</span>
            </button>
          </div>

          <span className="hidden md:inline text-xs text-stone-300 font-serif line-clamp-1">
            {trailer.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pick local video file directly */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleSelectLocalVideo}
            accept="video/mp4,video/webm,video/quicktime,video/mkv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/90 hover:bg-stone-700 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-medium transition"
            title="Chọn video bạn đã quay từ máy tính để phát thử ngay"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chọn video từ máy</span>
          </button>

          <button
            onClick={closeTrailer}
            className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition"
            title="Đóng trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video / Viewport Screen */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
        {activeMode === 'video' ? (
          <>
            {videoLoadError ? (
              // Friendly helper card when video file not found in public/videos
              <div className="max-w-md mx-4 p-6 rounded-3xl bg-stone-900/90 border border-amber-500/40 text-center space-y-4 shadow-2xl z-20">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#FAF7F2]">
                    Chưa phát hiện file video thực tế
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    Đường dẫn hiện tại: <code className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-amber-300 text-[11px]">{activeVideoSrc}</code>
                  </p>
                  <p className="text-xs text-stone-400 mt-2">
                    Bạn hãy copy file video đã quay vào thư mục <code className="text-amber-200">public/videos/</code> hoặc bấm nút bên dưới để chọn video trực tiếp từ máy!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#C83C23] hover:bg-[#a62f1a] text-white text-xs font-bold transition shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Chọn video từ máy phát ngay</span>
                  </button>
                  <button
                    onClick={() => setActiveMode('slideshow')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
                  >
                    Xem bản diễn họa tạm thời
                  </button>
                </div>
              </div>
            ) : (
              // Real HTML5 Video Player
              <video
                ref={videoRef}
                src={activeVideoSrc}
                autoPlay
                playsInline
                muted={isAudioMuted}
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onError={handleVideoError}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain max-h-[82vh]"
              />
            )}
          </>
        ) : (
          // Slideshow Cinematic Backdrop
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
              style={{
                backgroundImage: `url(${currentScene.image})`,
                filter: 'brightness(0.65) contrast(1.15)'
              }}
            />
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          </>
        )}

        {/* Cinematic letterbox gradients */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#1A1615] via-transparent to-[#1A1615]/50" />

        {/* Watermark */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border border-[#D4AF37]/40 text-[#D4AF37] px-2.5 py-0.5 font-serif text-[11px] rounded opacity-75 select-none pointer-events-none backdrop-blur-sm">
          VieN · Di Sản Thực Địa 4.0
        </div>

        {/* Subtitles Overlay */}
        {showSubtitles && (
          <div className="absolute bottom-6 left-4 right-4 sm:left-12 sm:right-12 z-20 pointer-events-none flex justify-center">
            <div className="max-w-xl text-center px-5 py-3 rounded-2xl bg-black/75 backdrop-blur-md border border-[#D4AF37]/30 shadow-2xl pointer-events-auto">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#D4AF37] font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Thuyết Minh Di Sản ({trailer.duration})</span>
              </div>
              <p className="font-serif text-sm sm:text-base font-bold text-[#FAF7F2] leading-snug">
                &ldquo;{activeMode === 'slideshow' ? currentScene.caption : trailer.title}&rdquo;
              </p>
              <p className="text-xs text-stone-300 italic line-clamp-2 leading-relaxed mt-1">
                {trailer.narrationText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls & Action Bar */}
      <div className="p-3 sm:p-5 bg-gradient-to-t from-[#1A1615] via-[#1A1615]/95 to-transparent z-20 space-y-2.5">
        {/* Interactive Progress / Scrubber Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-stone-400 font-mono">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <span className="text-[#D4AF37] font-serif font-bold">
              {destination.name}
            </span>
          </div>
          <div
            onClick={handleSeek}
            className="w-full h-2 bg-stone-800 rounded-full overflow-hidden cursor-pointer relative group"
            title="Bấm để tua video"
          >
            <div
              className="h-full bg-gradient-to-r from-[#C83C23] to-[#D4AF37] transition-all duration-150 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Media Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={togglePlayPause}
              className="p-2.5 sm:p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition shadow-sm"
              title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 sm:p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition shadow-sm"
              title={isAudioMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
            </button>

            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2.5 sm:p-3 rounded-full transition shadow-sm ${
                showSubtitles ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50' : 'bg-stone-800 text-stone-400'
              }`}
              title={showSubtitles ? 'Ẩn phụ đề thuyết minh' : 'Hiện phụ đề thuyết minh'}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex p-2.5 sm:p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition shadow-sm"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Prominent "Skip & Start Exploring" Button */}
          <button
            onClick={handleSkipAndExplore}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#C83C23] to-[#a62f1a] hover:from-[#a62f1a] hover:to-[#8c2614] text-white font-bold text-xs sm:text-sm shadow-lg ring-1 ring-[#D4AF37]/50 transition transform active:scale-95"
          >
            <span>Bỏ qua & Bắt đầu Khám phá</span>
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

