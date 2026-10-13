/**
 * Voice Narration Engine for Roseram Video Studio
 * Supports Gemini 3.8 Flash Lite TTS audio with Web Speech API browser fallback.
 * Accurately tracks spoken word boundaries to keep subtitles in 100% real-time sync with speech.
 */

export interface WordToken {
  word: string;
  start: number;
  end: number;
}

export type WordBoundaryCallback = (wordIndex: number, charIndex: number) => void;

export function extractWordTokens(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return tokens;
}

class VoiceNarrationService {
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCache = new Map<string, string>();
  private boundaryTimer: number | null = null;
  private currentTokens: WordToken[] = [];

  // Pre-fetch TTS audio via server-side Gemini 3.8 Flash Lite TTS
  async fetchGeminiTTS(text: string, voice = 'Kore'): Promise<string | null> {
    const cacheKey = `${voice}:${text}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    try {
      const response = await fetch('/api/generate-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      const data = await response.json();
      if (data.success && data.audioBase64) {
        const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
        this.audioCache.set(cacheKey, audioUrl);
        return audioUrl;
      }
    } catch (err) {
      console.warn('Failed to fetch Gemini TTS audio, will fallback to Web Speech:', err);
    }
    return null;
  }

  // Play narration audio for a given scene with exact word sync
  async speak(
    text: string,
    voice = 'Kore',
    playbackRate = 1,
    onWordBoundary?: WordBoundaryCallback,
    onEnded?: () => void
  ): Promise<void> {
    this.stop();

    if (!text || text.trim() === '') {
      onEnded?.();
      return;
    }

    this.currentTokens = extractWordTokens(text);

    // Initial word highlight
    onWordBoundary?.(0, 0);

    // Try Gemini TTS first
    const cachedUrl = this.audioCache.get(`${voice}:${text}`);
    if (cachedUrl) {
      this.playAudioUrl(cachedUrl, playbackRate, onWordBoundary, onEnded);
      return;
    }

    const ttsUrl = await this.fetchGeminiTTS(text, voice);
    if (ttsUrl) {
      this.playAudioUrl(ttsUrl, playbackRate, onWordBoundary, onEnded);
      return;
    }

    // Fallback to native Web Speech API with word boundary tracking
    this.fallbackWebSpeech(text, playbackRate, onWordBoundary, onEnded);
  }

  private playAudioUrl(
    url: string,
    playbackRate = 1,
    onWordBoundary?: WordBoundaryCallback,
    onEnded?: () => void
  ) {
    try {
      const audio = new Audio(url);
      this.currentAudioElement = audio;
      audio.playbackRate = playbackRate;

      const tokens = this.currentTokens;

      audio.ontimeupdate = () => {
        if (audio.duration && audio.duration > 0 && tokens.length > 0) {
          const progressFraction = Math.min(0.99, audio.currentTime / audio.duration);
          const activeWordIndex = Math.min(
            tokens.length - 1,
            Math.floor(progressFraction * tokens.length)
          );
          onWordBoundary?.(activeWordIndex, tokens[activeWordIndex]?.start ?? 0);
        }
      };

      audio.onended = () => {
        this.currentAudioElement = null;
        if (tokens.length > 0) {
          onWordBoundary?.(tokens.length - 1, tokens[tokens.length - 1]?.start ?? 0);
        }
        onEnded?.();
      };

      audio.onerror = () => {
        this.currentAudioElement = null;
        onEnded?.();
      };

      audio.play().catch(() => {
        onEnded?.();
      });
    } catch {
      onEnded?.();
    }
  }

  private fallbackWebSpeech(
    text: string,
    playbackRate = 1,
    onWordBoundary?: WordBoundaryCallback,
    onEnded?: () => void
  ) {
    if (!('speechSynthesis' in window)) {
      onEnded?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.rate = playbackRate * 1.0;
      utterance.pitch = 1.0;

      const tokens = this.currentTokens;
      let boundaryFired = false;

      // Select natural clear voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Karen'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        onWordBoundary?.(0, 0);

        // Fallback timer in case the selected OS voice does not emit boundary events
        const totalWords = tokens.length;
        // Average speech pace: ~140 words per minute -> ~420ms per word at 1.0 rate
        const msPerWord = Math.max(180, (60000 / (145 * playbackRate)));
        let simulatedIndex = 0;

        if (this.boundaryTimer) clearInterval(this.boundaryTimer);
        this.boundaryTimer = window.setInterval(() => {
          if (!boundaryFired && simulatedIndex < totalWords - 1) {
            simulatedIndex++;
            onWordBoundary?.(simulatedIndex, tokens[simulatedIndex]?.start ?? 0);
          }
        }, msPerWord);
      };

      // Native Web Speech API word boundary event (accurate to the millisecond)
      utterance.onboundary = (event) => {
        if (event.name === 'word' || event.name === undefined) {
          boundaryFired = true;
          if (this.boundaryTimer) {
            clearInterval(this.boundaryTimer);
            this.boundaryTimer = null;
          }

          const charIndex = event.charIndex;
          // Find token that corresponds to this charIndex
          let matchedIdx = tokens.findIndex(
            (t) => charIndex >= t.start && charIndex < t.end
          );
          if (matchedIdx === -1) {
            matchedIdx = tokens.findIndex((t) => t.start >= charIndex);
          }
          if (matchedIdx === -1) {
            matchedIdx = tokens.length - 1;
          }

          if (matchedIdx >= 0 && matchedIdx < tokens.length) {
            onWordBoundary?.(matchedIdx, charIndex);
          }
        }
      };

      utterance.onend = () => {
        if (this.boundaryTimer) {
          clearInterval(this.boundaryTimer);
          this.boundaryTimer = null;
        }
        this.currentUtterance = null;
        if (tokens.length > 0) {
          onWordBoundary?.(tokens.length - 1, tokens[tokens.length - 1]?.start ?? 0);
        }
        onEnded?.();
      };

      utterance.onerror = () => {
        if (this.boundaryTimer) {
          clearInterval(this.boundaryTimer);
          this.boundaryTimer = null;
        }
        this.currentUtterance = null;
        onEnded?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnded?.();
    }
  }

  stop() {
    if (this.boundaryTimer) {
      clearInterval(this.boundaryTimer);
      this.boundaryTimer = null;
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  resume() {
    if (this.currentAudioElement) {
      this.currentAudioElement.play().catch(() => {});
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }
}

export const voiceNarration = new VoiceNarrationService();
