import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Clock,
  Mic,
  Tv,
  Check,
  Code2,
  Layers,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Tutorial, TutorialScene, FocusArea } from '../../types/tutorial';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial;
  onSave: (updated: Tutorial) => void;
}

export const SceneEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tutorial,
  onSave,
}) => {
  const { isDark } = useTheme();
  const [scenes, setScenes] = useState<TutorialScene[]>([...tutorial.scenes]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [title, setTitle] = useState<string>(tutorial.title);
  const [voice, setVoice] = useState(tutorial.voice);

  if (!isOpen) return null;

  const currentScene = scenes[selectedSceneIndex] || scenes[0];

  const updateCurrentScene = (patch: Partial<TutorialScene>) => {
    setScenes((prev) => {
      const next = [...prev];
      next[selectedSceneIndex] = { ...next[selectedSceneIndex], ...patch };
      return next;
    });
  };

  const handleAddScene = () => {
    const newScene: TutorialScene = {
      id: `scene-${Date.now()}`,
      title: 'New Roseram Step',
      subtitle: 'Additional Walkthrough Step',
      narration: 'In this step, we explore further Roseram automation capabilities.',
      duration: 8,
      focusArea: 'ide',
      simulatedUI: {
        activeFile: 'src/App.tsx',
        codeSnippet: '// Added custom step in Roseram',
        terminalCommand: 'pnpm run dev',
        terminalOutput: '[ROSERAM] Step executed successfully.',
        modelSelected: 'Claude 3.7 Sonnet',
        activeViewTab: 'code',
      },
      cursorAction: {
        target: 'step-action',
        actionType: 'click',
        xPercent: 50,
        yPercent: 50,
        label: 'Perform Action',
      },
      calloutBadge: {
        text: 'Pro Tip: Customize this action in Roseram',
        type: 'tip',
        position: 'top-right',
      },
    };

    setScenes([...scenes, newScene]);
    setSelectedSceneIndex(scenes.length);
  };

  const handleDeleteScene = (idx: number) => {
    if (scenes.length <= 1) return;
    const next = scenes.filter((_, i) => i !== idx);
    setScenes(next);
    setSelectedSceneIndex(Math.max(0, idx - 1));
  };

  const handleMoveScene = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= scenes.length) return;
    const next = [...scenes];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setScenes(next);
    setSelectedSceneIndex(targetIdx);
  };

  const handleSaveAll = () => {
    const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
    onSave({
      ...tutorial,
      title,
      voice,
      estimatedDuration: totalDuration,
      scenes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`border rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Layers className="w-4 h-4 text-rose-500" />
              Customize & Edit Video Scenes
            </h2>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Fine-tune spoken narration, timing, focus areas, and code snippets.
            </p>
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

        {/* Content Split: Left Scenes List, Right Scene Details */}
        <div className="flex-1 flex overflow-hidden text-xs">
          {/* Left Column: Scene List */}
          <div className={`w-72 border-r p-3 flex flex-col justify-between overflow-y-auto ${
            isDark ? 'border-zinc-800/80 bg-zinc-950/70' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  Scenes ({scenes.length})
                </span>
                <button
                  onClick={handleAddScene}
                  className={`px-2 py-1 rounded text-rose-600 font-medium text-[11px] flex items-center gap-1 border ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700' : 'bg-white hover:bg-slate-100 border-slate-200 shadow-xs'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Scene</span>
                </button>
              </div>

              {scenes.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSceneIndex(idx)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    idx === selectedSceneIndex
                      ? isDark
                        ? 'bg-zinc-900 border-rose-500/60 text-white shadow-md'
                        : 'bg-rose-50/60 border-rose-400 text-slate-900 shadow-xs font-medium'
                      : isDark
                      ? 'bg-zinc-950/60 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate text-[11px]">
                      {idx + 1}. {s.title}
                    </span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                      {s.duration}s
                    </span>
                  </div>
                  <div className={`text-[10px] truncate mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                    Focus: <span className="uppercase font-mono font-medium">{s.focusArea}</span>
                  </div>

                  <div className={`flex items-center gap-1 mt-2 pt-1 border-t justify-end ${
                    isDark ? 'border-zinc-800/50' : 'border-slate-100'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveScene(idx, 'up');
                      }}
                      disabled={idx === 0}
                      className="p-1 hover:text-rose-600 disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveScene(idx, 'down');
                      }}
                      disabled={idx === scenes.length - 1}
                      className="p-1 hover:text-rose-600 disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    {scenes.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScene(idx);
                        }}
                        className="p-1 hover:text-red-500 text-slate-400 ml-1"
                        title="Delete Scene"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Persona selector */}
            <div className={`pt-3 border-t mt-3 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
              <label className={`block text-[11px] mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Narrator Voice Persona
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value as any)}
                className={`w-full border rounded-lg p-2 ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <option value="Kore">Kore (Clear / Tech)</option>
                <option value="Puck">Puck (Energetic)</option>
                <option value="Fenrir">Fenrir (Authoritative)</option>
                <option value="Zephyr">Zephyr (Warm / Calm)</option>
              </select>
            </div>
          </div>

          {/* Right Column: Selected Scene Editor Form */}
          <div className={`flex-1 p-5 overflow-y-auto space-y-4 ${
            isDark ? 'text-zinc-300 bg-zinc-900/60' : 'text-slate-700 bg-white'
          }`}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Scene Title
                </label>
                <input
                  type="text"
                  value={currentScene.title}
                  onChange={(e) => updateCurrentScene({ title: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 text-xs focus:border-rose-500 focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Subtitle
                </label>
                <input
                  type="text"
                  value={currentScene.subtitle}
                  onChange={(e) => updateCurrentScene({ subtitle: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 text-xs focus:border-rose-500 focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Duration (Seconds)
                </label>
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={currentScene.duration}
                  onChange={(e) => updateCurrentScene({ duration: parseInt(e.target.value, 10) || 5 })}
                  className={`w-full border rounded-lg px-3 py-2 text-xs font-mono focus:border-rose-500 focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Workspace Focus Area
                </label>
                <select
                  value={currentScene.focusArea}
                  onChange={(e) => updateCurrentScene({ focusArea: e.target.value as FocusArea })}
                  className={`w-full border rounded-lg px-3 py-2 text-xs focus:border-rose-500 focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
                  }`}
                >
                  <option value="ide">IDE & Code Editor</option>
                  <option value="router">Multi-Model Router</option>
                  <option value="proposals">Diff Proposals (Bounded Review)</option>
                  <option value="terminal">Interactive Terminal</option>
                  <option value="preview">Live Preview</option>
                  <option value="campaign">Generative Campaign Studio</option>
                  <option value="ledger">Token Ledger & Costs</option>
                </select>
              </div>
            </div>

            {/* Narration Script */}
            <div>
              <label className={`block text-[11px] font-semibold mb-1 flex items-center justify-between ${
                isDark ? 'text-zinc-300' : 'text-slate-800'
              }`}>
                <span>Spoken Voiceover Narration</span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                  {currentScene.narration.length} chars
                </span>
              </label>
              <textarea
                rows={3}
                value={currentScene.narration}
                onChange={(e) => updateCurrentScene({ narration: e.target.value })}
                className={`w-full border rounded-lg p-3 text-xs focus:border-rose-500 focus:outline-none leading-relaxed ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                }`}
                placeholder="Enter what the voice narrator should speak..."
              />
            </div>

            {/* Code Snippet */}
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                Simulated Code Editor Content
              </label>
              <textarea
                rows={4}
                value={currentScene.simulatedUI.codeSnippet || ''}
                onChange={(e) =>
                  updateCurrentScene({
                    simulatedUI: { ...currentScene.simulatedUI, codeSnippet: e.target.value },
                  })
                }
                className={`w-full border rounded-lg p-3 font-mono text-[11px] focus:border-rose-500 focus:outline-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-cyan-300' : 'bg-slate-50 border-slate-300 text-slate-800 shadow-xs'
                }`}
                placeholder="// TypeScript / JSX code to display..."
              />
            </div>

            {/* Terminal Command */}
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                Simulated Terminal Command
              </label>
              <input
                type="text"
                value={currentScene.simulatedUI.terminalCommand || ''}
                onChange={(e) =>
                  updateCurrentScene({
                    simulatedUI: { ...currentScene.simulatedUI, terminalCommand: e.target.value },
                  })
                }
                className={`w-full border rounded-lg px-3 py-2 font-mono text-xs focus:border-rose-500 focus:outline-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-400'
                }`}
                placeholder="e.g. pnpm test && pnpm build"
              />
            </div>

            {/* Callout Tip */}
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                On-Screen Tip / Callout
              </label>
              <input
                type="text"
                value={currentScene.calloutBadge?.text || ''}
                onChange={(e) =>
                  updateCurrentScene({
                    calloutBadge: {
                      text: e.target.value,
                      type: currentScene.calloutBadge?.type || 'tip',
                      position: currentScene.calloutBadge?.position || 'top-right',
                    },
                  })
                }
                className={`w-full border rounded-lg px-3 py-2 text-xs focus:border-rose-500 focus:outline-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                }`}
                placeholder="Highlight important tip or hotkey for viewers..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? 'border-zinc-800 bg-zinc-950/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
            Total Duration: {scenes.reduce((sum, s) => sum + s.duration, 0)}s
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-colors ${
                isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
