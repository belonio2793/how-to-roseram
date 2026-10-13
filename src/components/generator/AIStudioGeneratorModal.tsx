import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Clock,
  User,
  Tv,
  Mic,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { Tutorial, AspectRatio, VoiceName } from '../../types/tutorial';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTutorialGenerated: (newTutorial: Tutorial) => void;
}

const QUICK_TOPICS = [
  {
    title: 'Connecting GitHub & Forking Repos',
    desc: 'How to import GitHub repositories, branch, and sync PRs with Roseram',
    audience: 'Developer',
    category: 'Agentic Coding',
  },
  {
    title: 'Building a SaaS with Stripe & Auth',
    desc: 'Scaffolding full-stack subscriptions and webhooks using Roseram templates',
    audience: 'Developer',
    category: 'Deployment',
  },
  {
    title: 'Migrating from Cursor to Roseram',
    desc: 'Why browser-first multi-model routing outperforms local editor extensions',
    audience: 'Founder',
    category: 'Getting Started',
  },
  {
    title: 'Optimizing Token Spend across Models',
    desc: 'Setting hard budget caps and auto-routing between Claude, GPT, and Gemini',
    audience: 'Founder',
    category: 'Multi-Model',
  },
  {
    title: 'Viral Social Creatives in Campaign Studio',
    desc: 'Generating LinkedIn posts and X threads from any competitor landing page',
    audience: 'Growth Marketer',
    category: 'Campaign Studio',
  },
];

export const AIStudioGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onTutorialGenerated,
}) => {
  const { isDark } = useTheme();
  const [topic, setTopic] = useState<string>('');
  const [audience, setAudience] = useState<'Developer' | 'Founder' | 'Growth Marketer' | 'Beginner'>('Developer');
  const [format, setFormat] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<string>('45 seconds');
  const [voice, setVoice] = useState<VoiceName>('Kore');
  const [theme, setTheme] = useState<'violet' | 'emerald' | 'cyan' | 'amber'>('violet');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (selectedTopic?: string) => {
    const finalTopic = selectedTopic || topic;
    if (!finalTopic.trim()) {
      setErrorMsg('Please specify a tutorial topic or select a quick prompt below.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep('Analyzing Roseram workspace features & architecture...');

    try {
      setTimeout(() => setGenerationStep('Structuring instructional storyboard scenes...'), 800);
      setTimeout(() => setGenerationStep('Drafting spoken voice narration & terminal commands...'), 1600);

      const response = await fetch('/api/generate-tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: finalTopic,
          audience,
          format,
          durationTarget: duration,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const genData = result.data;
        const newTutorial: Tutorial = {
          id: `custom-${Date.now()}`,
          title: genData.title || finalTopic,
          description: genData.description || `AI-generated tutorial for Roseram.com on "${finalTopic}"`,
          category: (genData.category as any) || 'Custom',
          estimatedDuration: genData.estimatedDuration || 45,
          targetAudience: audience,
          aspectRatio: format,
          themeColor: theme,
          voice,
          tags: ['Roseram', 'AI Generated', audience],
          scenes: genData.scenes.map((s: any, idx: number) => ({
            id: s.id || `scene-${idx + 1}`,
            title: s.title || `Step ${idx + 1}`,
            subtitle: s.subtitle || 'Instructional Step',
            narration: s.narration || '',
            duration: s.duration || 8,
            focusArea: s.focusArea || 'ide',
            simulatedUI: {
              activeFile: s.activeFile || 'src/App.tsx',
              codeSnippet: s.codeSnippet || '// Roseram generated code snippet',
              terminalCommand: s.terminalCommand || 'pnpm run dev',
              terminalOutput: s.terminalOutput || '[ROSERAM] Step completed successfully.',
              modelSelected: s.modelSelected || 'Claude 3.7 Sonnet',
              activeViewTab: s.focusArea === 'proposals' ? 'diff' : s.focusArea === 'campaign' ? 'campaign' : s.focusArea === 'ledger' ? 'ledger' : 'code',
            },
            cursorAction: s.cursorAction || {
              target: 'action-btn',
              actionType: 'click',
              xPercent: 70,
              yPercent: 30,
              label: s.title,
            },
            calloutBadge: s.calloutBadge || {
              text: 'Pro Tip: Follow along inside Roseram.com workspace',
              type: 'tip',
              position: 'top-right',
            },
          })),
        };

        onTutorialGenerated(newTutorial);
        onClose();
        return;
      }

      // Fallback structured generation
      const fallbackTutorial: Tutorial = {
        id: `custom-fallback-${Date.now()}`,
        title: `${finalTopic} - Roseram Walkthrough`,
        description: `Complete step-by-step instructional video tutorial for "${finalTopic}" inside Roseram.com workspace.`,
        category: 'Custom',
        estimatedDuration: 45,
        targetAudience: audience,
        aspectRatio: format,
        themeColor: theme,
        voice,
        tags: ['Custom', 'Roseram Guide', audience],
        scenes: [
          {
            id: 'fb-1',
            title: `Introduction: ${finalTopic}`,
            subtitle: 'Setting Up the Workspace',
            narration: `In this tutorial, you will learn how to achieve ${finalTopic} directly inside Roseram's browser-first AI workspace.`,
            duration: 9,
            focusArea: 'ide',
            simulatedUI: {
              activeFile: 'roseram.config.ts',
              modelSelected: 'Multi-Model Auto',
              codeSnippet: `// Configuration for: ${finalTopic}
export default {
  task: "${finalTopic}",
  engine: "roseram-agent-v3",
  humanInTheLoop: true,
};`,
              terminalCommand: 'roseram init --template quickstart',
              terminalOutput: `[ROSERAM] Initialized workspace for: ${finalTopic}\n[ROSERAM] Ready for agentic execution.`,
            },
            cursorAction: {
              target: 'init-button',
              actionType: 'click',
              xPercent: 65,
              yPercent: 20,
              label: 'Initialize Task',
            },
            calloutBadge: {
              text: 'Roseram executes tasks in isolated sandboxed browser containers',
              type: 'tip',
              position: 'top-right',
            },
          },
          {
            id: 'fb-2',
            title: 'Configuring Multi-Model Routing',
            subtitle: 'Selecting the Best Model for the Task',
            narration: `Next, choose your target frontier model. Roseram automatically adapts your prompts across Claude 3.7 Sonnet, GPT-4o, and Gemini 2.5 Pro.`,
            duration: 9,
            focusArea: 'router',
            simulatedUI: {
              activeFile: 'src/core/router.ts',
              modelSelected: 'Claude 3.7 Sonnet',
              codeSnippet: `// Routing configuration
const model = roseram.route({
  reasoning: 'deep',
  target: '${finalTopic}'
});`,
              terminalOutput: '[ROUTER] Model selected: Claude 3.7 Sonnet (Thinking mode enabled)',
            },
            cursorAction: {
              target: 'model-selector-badge',
              actionType: 'hover',
              xPercent: 78,
              yPercent: 12,
              label: 'Selected Claude 3.7 Sonnet',
            },
            calloutBadge: {
              text: 'Switch models at any point without losing execution context',
              type: 'pro',
              position: 'bottom-right',
            },
          },
          {
            id: 'fb-3',
            title: 'Reviewing Code Diff Proposals',
            subtitle: 'Safe Bounded Human-In-The-Loop Approval',
            narration: `Before any file changes are written to disk, Roseram generates a clean diff proposal. Inspect the additions and click Approve to apply.`,
            duration: 9,
            focusArea: 'proposals',
            simulatedUI: {
              activeFile: 'src/solution.ts',
              activeViewTab: 'diff',
              proposalDiff: {
                fileName: 'src/solution.ts',
                added: [
                  `+ // Implemented ${finalTopic}`,
                  '+ export async function executePipeline() {',
                  '+   return await roseram.run();',
                  '+ }',
                ],
                removed: ['- // Pending implementation'],
                status: 'pending',
              },
              terminalOutput: '[AGENT] Diff ready for review. Awaiting user approval...',
            },
            cursorAction: {
              target: 'accept-diff-button',
              actionType: 'click',
              xPercent: 88,
              yPercent: 32,
              label: 'Approve & Apply Diff',
            },
            calloutBadge: {
              text: 'You have full review authority over every line changed',
              type: 'shortcut',
              position: 'top-left',
            },
          },
          {
            id: 'fb-4',
            title: 'Verifying in Sandboxed Terminal',
            subtitle: 'Live Tests and Instant Verification',
            narration: `Run tests inside the Roseram terminal to verify the implementation. All dependencies and build steps are checked automatically.`,
            duration: 9,
            focusArea: 'terminal',
            simulatedUI: {
              activeFile: 'package.json',
              terminalCommand: 'pnpm test && pnpm build',
              terminalOutput: `✓ Tests completed: 5 passed (0 failures)
✨ Build successful in 340ms
✓ Live preview updated for ${finalTopic}`,
            },
            cursorAction: {
              target: 'terminal-input-bar',
              actionType: 'type',
              xPercent: 45,
              yPercent: 82,
              label: 'Run verification tests',
            },
            calloutBadge: {
              text: 'Zero local dependencies required to test and run',
              type: 'pro',
              position: 'bottom-left',
            },
          },
          {
            id: 'fb-5',
            title: 'Live Preview & Deployment',
            subtitle: 'Ready to Share or Push to Git',
            narration: `Your task is complete! Preview the live running application in real-time or sync it with your GitHub repository with one click.`,
            duration: 8,
            focusArea: 'preview',
            simulatedUI: {
              activeViewTab: 'preview',
              livePreviewUrl: 'https://demo-roseram.preview.dev',
              terminalOutput: `[DEPLOY] Live edge preview active!\n[ROSERAM] Tutorial completed for: ${finalTopic}`,
            },
            cursorAction: {
              target: 'share-preview-button',
              actionType: 'click',
              xPercent: 92,
              yPercent: 12,
              label: 'Share Live URL',
            },
            calloutBadge: {
              text: 'Great job! You have mastered this workflow on Roseram.com',
              type: 'pro',
              position: 'center',
            },
          },
        ],
      };

      onTutorialGenerated(fallbackTutorial);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with generation service');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Generate Roseram How-To Video
                <span className="text-[10px] bg-rose-500/10 text-rose-600 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono">
                  Gemini AI Powered
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Specify any feature or use-case for Roseram.com and get a complete animated tutorial with voiceover.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className={`p-5 overflow-y-auto space-y-5 text-xs ${
          isDark ? 'text-zinc-300' : 'text-slate-700'
        }`}>
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Custom Topic Input */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-zinc-200' : 'text-slate-800'
            }`}>
              What do you want the How-To Video to teach?
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How to inspect and approve code diffs in Roseram's terminal"
                className={`w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-700/80 text-white placeholder-zinc-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !topic.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </div>

          {/* Quick Inspiring Roseram Presets */}
          <div>
            <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}>
              Or Choose a Recommended Roseram Feature:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_TOPICS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setTopic(item.title);
                    handleGenerate(item.title);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all group flex flex-col justify-between ${
                    isDark
                      ? 'bg-zinc-950/80 hover:bg-zinc-800/80 border-zinc-800/80 hover:border-rose-500/50'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-rose-400 shadow-xs'
                  }`}
                >
                  <div>
                    <div className={`font-semibold group-hover:text-rose-600 transition-colors flex items-center justify-between ${
                      isDark ? 'text-zinc-200' : 'text-slate-900'
                    }`}>
                      <span className="truncate">{item.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-rose-600 shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className={`text-[11px] line-clamp-1 mt-0.5 ${
                      isDark ? 'text-zinc-500' : 'text-slate-500'
                    }`}>
                      {item.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-white border border-slate-200 text-slate-600'
                    }`}>
                      {item.audience}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-zinc-800/60 text-zinc-500' : 'bg-slate-200/60 text-slate-500'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Settings Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t ${
            isDark ? 'border-zinc-800/60' : 'border-slate-200'
          }`}>
            {/* Target Audience */}
            <div>
              <label className={`block text-[11px] font-medium mb-1 flex items-center gap-1 ${
                isDark ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                <User className="w-3 h-3 text-slate-400" />
                <span>Audience</span>
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as any)}
                className={`w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <option value="Developer">Developer</option>
                <option value="Founder">Founder</option>
                <option value="Growth Marketer">Growth Marketer</option>
                <option value="Beginner">Beginner</option>
              </select>
            </div>

            {/* Video Format */}
            <div>
              <label className={`block text-[11px] font-medium mb-1 flex items-center gap-1 ${
                isDark ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                <Tv className="w-3 h-3 text-slate-400" />
                <span>Aspect Ratio</span>
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className={`w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Portrait Reels</option>
                <option value="1:1">1:1 Square Feed</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className={`block text-[11px] font-medium mb-1 flex items-center gap-1 ${
                isDark ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Pacing</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={`w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <option value="30 seconds">30s Fast Teaser</option>
                <option value="45 seconds">45s Standard</option>
                <option value="60 seconds">60s Complete</option>
                <option value="90 seconds">90s Deep Dive</option>
              </select>
            </div>

            {/* AI Voice Persona */}
            <div>
              <label className={`block text-[11px] font-medium mb-1 flex items-center gap-1 ${
                isDark ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                <Mic className="w-3 h-3 text-slate-400" />
                <span>AI Voiceover</span>
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value as any)}
                className={`w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <option value="Kore">Kore (Clear / Tech)</option>
                <option value="Puck">Puck (Energetic)</option>
                <option value="Fenrir">Fenrir (Authoritative)</option>
                <option value="Zephyr">Zephyr (Warm / Calm)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? 'border-zinc-800 bg-zinc-950/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`text-[11px] flex items-center gap-2 ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}>
            {isGenerating ? (
              <div className="flex items-center gap-2 text-rose-600 animate-pulse font-medium">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{generationStep || 'Generating video storyboard...'}</span>
              </div>
            ) : (
              <span>Ready to produce high-retention video content for Roseram.com</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-colors ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Video...' : 'Build Video Tutorial'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
