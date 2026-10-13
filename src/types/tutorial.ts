export type FocusArea =
  | 'ide'
  | 'router'
  | 'proposals'
  | 'terminal'
  | 'preview'
  | 'campaign'
  | 'ledger';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type VoiceName = 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon';

export interface CursorAction {
  target: string;
  actionType: 'click' | 'hover' | 'type' | 'highlight';
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  label?: string;
}

export interface CalloutBadge {
  text: string;
  type: 'tip' | 'warning' | 'shortcut' | 'pro';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface CodeDiff {
  fileName: string;
  added: string[];
  removed: string[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CampaignAsset {
  title: string;
  channel: 'Email Sequence' | 'LinkedIn Post' | 'X Thread' | 'Meta Ad';
  hook: string;
  content: string;
}

export interface SimulatedUIState {
  activeFile?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  terminalCommand?: string;
  terminalOutput?: string;
  modelSelected?: string; // 'Claude 3.7 Sonnet' | 'GPT-4o' | 'Gemini 2.5 Pro' | 'Multi-Model Auto'
  proposalDiff?: CodeDiff;
  campaignAsset?: CampaignAsset;
  tokenCount?: number;
  costEstimate?: string;
  livePreviewUrl?: string;
  gitBranch?: string;
  activeViewTab?: 'code' | 'diff' | 'preview' | 'campaign' | 'ledger';
}

export interface TutorialScene {
  id: string;
  title: string;
  subtitle: string;
  narration: string;
  duration: number; // in seconds
  focusArea: FocusArea;
  simulatedUI: SimulatedUIState;
  cursorAction?: CursorAction;
  calloutBadge?: CalloutBadge;
  audioBase64?: string; // cached WAV from Gemini TTS
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'Getting Started' | 'Agentic Coding' | 'Multi-Model' | 'Campaign Studio' | 'Deployment' | 'Custom';
  estimatedDuration: number; // in seconds
  targetAudience: 'Beginner' | 'Developer' | 'Founder' | 'Growth Marketer';
  aspectRatio: AspectRatio;
  themeColor: 'violet' | 'emerald' | 'cyan' | 'amber';
  tags: string[];
  voice: VoiceName;
  scenes: TutorialScene[];
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number; // total elapsed seconds
  currentSceneIndex: number;
  sceneElapsed: number; // seconds inside current scene
  playbackRate: number; // 0.75, 1, 1.25, 1.5
  isMuted: boolean;
  bgMusicEnabled: boolean;
  ttsEnabled: boolean;
}
