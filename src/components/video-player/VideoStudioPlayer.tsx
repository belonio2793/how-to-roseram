import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Music,
  Mic,
  Subtitles,
  Smartphone,
  Tv,
  Square,
  Download,
  Settings,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Tutorial, AspectRatio } from '../../types/tutorial';
import { SimulatedWorkspaceView } from './SimulatedWorkspaceView';
import { audioSynth } from '../../utils/audioSynth';
import { voiceNarration } from '../../utils/ttsService';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  tutorial: Tutorial;
  onSceneChange?: (sceneIndex: number) => void;
  onOpenExport?: () => void;
  onOpenEditor?: () => void;
}

export const VideoStudioPlayer: React.FC<Props> = ({
  tutorial,
  onSceneChange,
  onOpenExport,
  onOpenEditor,
}) => {
  const { isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [sceneElapsed, setSceneElapsed] = useState<number>(0); // seconds in current scene
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bgMusic, setBgMusic] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [soundFxEnabled, setSoundFxEnabled] = useState<boolean>(true);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(tutorial.aspectRatio || '16:9');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const hasTriggeredClickSfxRef = useRef<boolean>(false);

  const currentScene = tutorial.scenes[currentSceneIndex] || tutorial.scenes[0];
  const totalDuration = tutorial.scenes.reduce((sum, s) => sum + s.duration, 0);

  // Calculate cumulative elapsed time
  const totalElapsed = tutorial.scenes
    .slice(0, currentSceneIndex)
    .reduce((sum, s) => sum + s.duration, 0) + sceneElapsed;

  const currentProgressPercent = currentScene
    ? Math.min(100, (sceneElapsed / currentScene.duration) * 100)
    : 0;

  // Split narration into clean word tokens
  const words = currentScene.narration
    ? currentScene.narration.trim().split(/\s+/)
    : [];

  // Start speech narration with exact real-time word boundary sync
  const playNarration = useCallback(
    (sceneIndex: number) => {
      if (!ttsEnabled || isMuted) return;
      const targetScene = tutorial.scenes[sceneIndex];
      if (!targetScene?.narration) return;

      setActiveWordIdx(0);

      voiceNarration.speak(
        targetScene.narration,
        tutorial.voice,
        playbackRate,
        (wordIndex) => {
          setActiveWordIdx(wordIndex);
        },
        () => {
          // Narration completed for this scene
        }
      );
    },
    [ttsEnabled, isMuted, tutorial, playbackRate]
  );

  // Jump to specific scene
  const jumpToScene = useCallback(
    (index: number) => {
      const safeIndex = Math.max(0, Math.min(tutorial.scenes.length - 1, index));
      setCurrentSceneIndex(safeIndex);
      setSceneElapsed(0);
      setActiveWordIdx(0);
      hasTriggeredClickSfxRef.current = false;
      onSceneChange?.(safeIndex);

      if (isPlaying) {
        playNarration(safeIndex);
      } else {
        voiceNarration.stop();
      }
    },
    [tutorial, onSceneChange, isPlaying, playNarration]
  );

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      voiceNarration.pause();
    } else {
      setIsPlaying(true);
      // Start background ambient music if enabled
      if (bgMusic && !isMuted) {
        audioSynth.startAmbientMusic();
      }
      // Speak current scene narration synchronized with words
      playNarration(currentSceneIndex);
    }
  }, [isPlaying, bgMusic, isMuted, playNarration, currentSceneIndex]);

  // Handle background ambient synth music
  useEffect(() => {
    if (bgMusic && isPlaying && !isMuted) {
      audioSynth.startAmbientMusic();
    } else {
      audioSynth.stopAmbientMusic();
    }
    return () => {
      audioSynth.stopAmbientMusic();
    };
  }, [bgMusic, isPlaying, isMuted]);

  // Playback Clock Loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 50; // 20 updates per second for silky smooth timeline
    const stepSeconds = (intervalMs / 1000) * playbackRate;

    timerRef.current = window.setInterval(() => {
      setSceneElapsed((prev) => {
        const next = prev + stepSeconds;

        // Trigger sound fx on cursor clicks
        if (
          soundFxEnabled &&
          !isMuted &&
          !hasTriggeredClickSfxRef.current &&
          currentScene?.cursorAction?.actionType === 'click' &&
          next >= currentScene.duration * 0.45
        ) {
          audioSynth.playClick();
          hasTriggeredClickSfxRef.current = true;
        }

        // Scene ended -> transition to next scene
        if (next >= currentScene.duration) {
          if (currentSceneIndex < tutorial.scenes.length - 1) {
            hasTriggeredClickSfxRef.current = false;
            const newIdx = currentSceneIndex + 1;
            setCurrentSceneIndex(newIdx);
            setActiveWordIdx(0);
            onSceneChange?.(newIdx);
            playNarration(newIdx);
            return 0;
          } else {
            // End of tutorial
            setIsPlaying(false);
            voiceNarration.stop();
            if (soundFxEnabled && !isMuted) {
              audioSynth.playSuccessChime();
            }
            return currentScene.duration;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isPlaying,
    currentScene,
    currentSceneIndex,
    tutorial,
    playbackRate,
    isMuted,
    soundFxEnabled,
    onSceneChange,
    playNarration,
  ]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        jumpToScene(currentSceneIndex + 1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        jumpToScene(currentSceneIndex - 1);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, jumpToScene, currentSceneIndex]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleExportVideo = async () => {
    if (onOpenExport) {
      onOpenExport();
      return;
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Effective word highlight index: uses speech boundary when voice is speaking, or smooth fallback when muted
  const effectiveWordIndex =
    ttsEnabled && !isMuted && isPlaying
      ? activeWordIdx
      : Math.min(
          words.length - 1,
          Math.floor((currentProgressPercent / 100) * words.length)
        );

  return (
    <div className={`flex flex-col w-full rounded-xl overflow-hidden border shadow-lg transition-colors ${
      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
    }`}>
      {/* Video Studio Viewport */}
      <div
        ref={containerRef}
        className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden group select-none"
        style={{
          aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1',
          maxHeight: aspectRatio === '9:16' ? '720px' : '640px',
        }}
      >
        {/* Render simulated Roseram IDE workspace */}
        <SimulatedWorkspaceView
          scene={currentScene}
          aspectRatio={aspectRatio}
          progressPercent={currentProgressPercent}
          themeColor={tutorial.themeColor}
          showCursor={true}
          showCallout={true}
        />

        {/* Scene Title Watermark / HUD overlay */}
        <div className="absolute top-12 left-4 z-20 pointer-events-none transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-700/60 text-[10px] font-mono text-zinc-300 backdrop-blur">
              Scene {currentSceneIndex + 1}/{tutorial.scenes.length}
            </span>
            <span className="text-xs font-semibold text-white drop-shadow-md">
              {currentScene.title}
            </span>
          </div>
        </div>

        {/* Dynamic Closed Captions / Subtitles Overlay with Real-time Voice Sync */}
        {showCaptions && currentScene.narration && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-[90%] pointer-events-none transition-all">
            <div className={`px-5 py-3 rounded-2xl shadow-2xl text-center border backdrop-blur-md transition-all ${
              isDark
                ? 'bg-zinc-950/90 border-zinc-800 text-zinc-100 shadow-black/80'
                : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-900/10'
            }`}>
              <p className="text-xs sm:text-sm font-medium leading-relaxed tracking-wide flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                {words.map((word, idx) => {
                  const isCurrent = idx === effectiveWordIndex;
                  const isPast = idx < effectiveWordIndex;

                  return (
                    <span
                      key={idx}
                      className={`transition-all duration-100 inline-block px-1 rounded ${
                        isCurrent
                          ? 'bg-rose-600 text-white font-bold scale-110 shadow-md shadow-rose-900/30'
                          : isPast
                          ? isDark
                            ? 'text-zinc-100 font-semibold opacity-100'
                            : 'text-slate-900 font-semibold opacity-100'
                          : isDark
                          ? 'text-zinc-500 opacity-60'
                          : 'text-slate-400 opacity-60'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        )}

        {/* Big Centered Play Trigger when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center z-30 shadow-2xl shadow-rose-900/50 hover:scale-105 transition-all cursor-pointer backdrop-blur"
            title="Play Video (Spacebar)"
          >
            <Play className="w-7 h-7 ml-1 fill-white" />
          </button>
        )}
      </div>

      {/* Video Player Timeline & Controls Bar */}
      <div className={`border-t p-3 flex flex-col gap-2.5 transition-colors ${
        isDark ? 'bg-zinc-950 border-zinc-800/80 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Timeline Scrubber with Scene Chapter Dividers */}
        <div className="relative w-full">
          <div className={`flex h-2.5 w-full rounded-full overflow-hidden cursor-pointer group/timeline ${
            isDark ? 'bg-zinc-800/80' : 'bg-slate-200'
          }`}>
            {tutorial.scenes.map((scene, idx) => {
              const sceneWidthPercent = (scene.duration / totalDuration) * 100;
              const isPast = idx < currentSceneIndex;
              const isCurrent = idx === currentSceneIndex;
              const fillPercent = isPast ? 100 : isCurrent ? currentProgressPercent : 0;

              return (
                <div
                  key={scene.id}
                  onClick={() => jumpToScene(idx)}
                  className={`relative h-full border-r transition-all hover:brightness-125 ${
                    isDark ? 'border-zinc-950/60' : 'border-white'
                  }`}
                  style={{ width: `${sceneWidthPercent}%` }}
                  title={`${scene.title} (${scene.duration}s)`}
                >
                  <div
                    className={`h-full transition-all duration-75 ${
                      tutorial.themeColor === 'emerald'
                        ? 'bg-emerald-500'
                        : tutorial.themeColor === 'cyan'
                        ? 'bg-cyan-500'
                        : tutorial.themeColor === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-rose-500 to-violet-500'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Scene Chapter Markers Tooltips Bar */}
          <div className="flex justify-between items-center text-[10px] font-mono mt-1 px-0.5">
            <span className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              {formatTime(totalElapsed)}
            </span>
            <span className={`truncate max-w-[200px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Ch {currentSceneIndex + 1}: {currentScene.title}
            </span>
            <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>
              {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* Lower Controls Strip */}
        <div className="flex items-center justify-between gap-3 text-xs">
          {/* Left Playback Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => jumpToScene(currentSceneIndex - 1)}
              disabled={currentSceneIndex === 0}
              className={`p-1.5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Previous Scene (Left Arrow)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => jumpToScene(currentSceneIndex + 1)}
              disabled={currentSceneIndex >= tutorial.scenes.length - 1}
              className={`p-1.5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Next Scene (Right Arrow)"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => jumpToScene(0)}
              className={`p-1.5 rounded-lg ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Replay from start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Selector */}
            <div className={`flex items-center border rounded-lg p-0.5 ml-2 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {[0.75, 1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    if (isPlaying) {
                      playNarration(currentSceneIndex);
                    }
                  }}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                    playbackRate === rate
                      ? isDark
                        ? 'bg-zinc-800 text-rose-400 font-bold'
                        : 'bg-white text-rose-600 font-bold shadow-xs'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Center Toggles: Audio, Narration, Captions */}
          <div className={`hidden sm:flex items-center gap-1.5 p-1 rounded-lg border ${
            isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {/* Audio Voice Narration */}
            <button
              onClick={() => {
                const nextVal = !ttsEnabled;
                setTtsEnabled(nextVal);
                if (!nextVal) {
                  voiceNarration.stop();
                } else if (isPlaying) {
                  playNarration(currentSceneIndex);
                }
              }}
              className={`p-1.5 rounded flex items-center gap-1 text-[11px] ${
                ttsEnabled
                  ? isDark
                    ? 'bg-zinc-800 text-emerald-400 font-medium'
                    : 'bg-white text-emerald-700 font-semibold shadow-xs'
                  : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Toggle AI Voiceover Narration"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Voice ({tutorial.voice})</span>
            </button>

            {/* Ambient Lo-Fi Synth Music */}
            <button
              onClick={() => setBgMusic(!bgMusic)}
              className={`p-1.5 rounded flex items-center gap-1 text-[11px] ${
                bgMusic
                  ? isDark
                    ? 'bg-zinc-800 text-violet-400 font-medium'
                    : 'bg-white text-violet-700 font-semibold shadow-xs'
                  : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Toggle Lo-Fi Synth Ambient Music"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lo-Fi</span>
            </button>

            {/* Captions Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-1.5 rounded flex items-center gap-1 text-[11px] ${
                showCaptions
                  ? isDark
                    ? 'bg-zinc-800 text-cyan-400 font-medium'
                    : 'bg-white text-cyan-700 font-semibold shadow-xs'
                  : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Toggle Subtitles / Captions"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">CC</span>
            </button>

            {/* Sound Mute */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (nextMuted) {
                  voiceNarration.stop();
                } else if (isPlaying) {
                  playNarration(currentSceneIndex);
                }
              }}
              className={`p-1.5 rounded ${
                isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              } ${isMuted ? 'text-red-500' : ''}`}
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Right Actions: Aspect Ratio, Export & Fullscreen */}
          <div className="flex items-center gap-1.5">
            {/* Aspect Ratio Switcher */}
            <div className={`flex items-center border rounded-lg p-0.5 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`p-1 rounded text-xs ${
                  aspectRatio === '16:9'
                    ? isDark ? 'bg-zinc-800 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Widescreen (16:9)"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`p-1 rounded text-xs ${
                  aspectRatio === '9:16'
                    ? isDark ? 'bg-zinc-800 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Portrait Shorts / Reels (9:16)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`p-1 rounded text-xs ${
                  aspectRatio === '1:1'
                    ? isDark ? 'bg-zinc-800 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Square Feed (1:1)"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export Video Modal Button */}
            <button
              onClick={handleExportVideo}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
              title="Download or Export Video"
            >
              <Download className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className={`p-1.5 rounded-lg ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
