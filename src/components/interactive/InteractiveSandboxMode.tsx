import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Globe,
  Award,
} from 'lucide-react';
import { Tutorial } from '../../types/tutorial';
import { audioSynth } from '../../utils/audioSynth';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  tutorial: Tutorial;
  onExit: () => void;
}

export const InteractiveSandboxMode: React.FC<Props> = ({ tutorial, onExit }) => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('Claude 3.7 Sonnet');
  const [diffApproved, setDiffApproved] = useState<boolean>(false);
  const [terminalRan, setTerminalRan] = useState<boolean>(false);
  const [previewLaunched, setPreviewLaunched] = useState<boolean>(false);

  // Define four interactive hands-on challenges based on Roseram's core capabilities
  const missions = [
    {
      title: 'Configure Multi-Model Routing',
      instruction: 'Click the Model Selector and choose Claude 3.7 Sonnet (Thinking Mode) for deep coding accuracy.',
      actionType: 'select_model',
      done: completedSteps.includes(0),
    },
    {
      title: 'Bounded Automation: Review & Approve Diff',
      instruction: 'Inspect the proposed code changes in Roseram’s safe sandbox, then click "Approve Diff".',
      actionType: 'approve_diff',
      done: completedSteps.includes(1),
    },
    {
      title: 'Run Terminal Build Verification',
      instruction: 'Execute the build and test verification pipeline in the sandboxed Roseram terminal.',
      actionType: 'run_terminal',
      done: completedSteps.includes(2),
    },
    {
      title: 'Verify Instant Edge Preview',
      instruction: 'Open the live edge preview to confirm your web app is fully deployed.',
      actionType: 'launch_preview',
      done: completedSteps.includes(3),
    },
  ];

  const handleStepComplete = (index: number) => {
    if (!completedSteps.includes(index)) {
      audioSynth.playSuccessChime();
      const updated = [...completedSteps, index];
      setCompletedSteps(updated);
      if (index < missions.length - 1) {
        setCurrentStep(index + 1);
      }
    }
  };

  const isAllComplete = completedSteps.length === missions.length;

  return (
    <div className={`w-full rounded-xl overflow-hidden border shadow-xl flex flex-col transition-colors ${
      isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Sandbox Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Interactive Practice Sandbox
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                Hands-On Mode
              </span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Practice the tutorial steps directly in an active simulated Roseram workspace.
            </p>
          </div>
        </div>

        <button
          onClick={onExit}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
            isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
          }`}
        >
          Return to Video Player
        </button>
      </div>

      {/* Main Sandbox Interactive Body */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Side: Mission Checklist */}
        <div className="space-y-3">
          <div className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}>
            Tutorial Objectives ({completedSteps.length}/{missions.length})
          </div>

          <div className="space-y-2">
            {missions.map((m, idx) => {
              const isCurrent = currentStep === idx;
              const isDone = m.done;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? isDark
                        ? 'bg-zinc-900 border-emerald-500/80 shadow-md'
                        : 'bg-emerald-50/60 border-emerald-400 shadow-xs'
                      : isDone
                      ? isDark
                        ? 'bg-zinc-950/80 border-emerald-900/40 text-zinc-300'
                        : 'bg-slate-50/80 border-emerald-200 text-slate-700'
                      : isDark
                      ? 'bg-zinc-950/40 border-zinc-800/60 text-zinc-500'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Circle className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`} />
                    )}
                    <div>
                      <div className={`font-semibold text-xs ${
                        isDone ? 'text-emerald-700 font-bold' : isCurrent ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-zinc-400' : 'text-slate-500')
                      }`}>
                        {idx + 1}. {m.title}
                      </div>
                      <div className={`text-[11px] mt-1 leading-snug ${
                        isDark ? 'text-zinc-400' : 'text-slate-500'
                      }`}>
                        {m.instruction}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isAllComplete && (
            <div className={`p-4 rounded-xl border text-center space-y-2 mt-4 ${
              isDark
                ? 'bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-cyan-950/80 border-emerald-500/50'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xs'
            }`}>
              <Award className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                Roseram Workflow Mastered!
              </div>
              <div className={`text-xs ${isDark ? 'text-zinc-300' : 'text-emerald-700'}`}>
                You successfully validated all bounded automation and multi-model deployment steps.
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Action Workspace Simulation */}
        <div className={`lg:col-span-2 border rounded-xl p-5 flex flex-col justify-between min-h-[380px] ${
          isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-50/70 border-slate-200'
        }`}>
          <div>
            <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span className={`text-xs font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                  Step {currentStep + 1}: {missions[currentStep]?.title}
                </span>
              </div>
              <span className={`text-xs font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                Roseram Live Sandbox
              </span>
            </div>

            {/* Interactive Challenge 1: Multi-Model Selection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Roseram routes prompts across frontier LLMs. Select your preferred engine below:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {['Claude 3.7 Sonnet', 'GPT-4o', 'Gemini 2.5 Pro'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedModel(m);
                        audioSynth.playClick();
                        handleStepComplete(0);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedModel === m
                          ? isDark
                            ? 'bg-rose-500/20 border-rose-500 text-white font-semibold shadow-lg'
                            : 'bg-white border-rose-500 text-rose-700 font-semibold shadow-sm ring-1 ring-rose-400'
                          : isDark
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-4 h-4 text-rose-500" />
                        <span className="text-xs">{m}</span>
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        {m.includes('Claude') ? 'Best for complex code diffs' : m.includes('GPT') ? 'Fast token throughput' : 'Deep context reasoning'}
                      </div>
                    </button>
                  ))}
                </div>

                {completedSteps.includes(0) && (
                  <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    isDark ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}>
                    <span>Active engine set to: {selectedModel} (Adapter initialized)</span>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium text-xs flex items-center gap-1 shadow-xs"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Challenge 2: Diff Review & Approve */}
            {currentStep === 1 && (
              <div className="space-y-3 font-mono text-xs">
                <div className={`border rounded-lg p-3 ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className={`text-[11px] mb-2 font-sans flex items-center justify-between ${
                    isDark ? 'text-zinc-500' : 'text-slate-500'
                  }`}>
                    <span>Proposed modification to: src/auth/session.ts</span>
                    <span className="text-emerald-600 font-semibold">+6 / -1</span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className={`px-2 py-0.5 rounded ${
                      isDark ? 'bg-red-950/40 text-red-300' : 'bg-red-50 text-red-700'
                    }`}>
                      - const token = localStorage.getItem("auth");
                    </div>
                    <div className={`px-2 py-0.5 rounded ${
                      isDark ? 'bg-emerald-950/50 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      + const session = await roseram.auth.verifySession(req);
                    </div>
                    <div className={`px-2 py-0.5 rounded ${
                      isDark ? 'bg-emerald-950/50 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      + if (!session.valid) throw new UnauthorizedError();
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className={`text-xs font-sans ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {diffApproved ? 'Proposal merged into workspace.' : 'Click to approve proposal without local terminal friction:'}
                  </div>

                  <button
                    onClick={() => {
                      setDiffApproved(true);
                      handleStepComplete(1);
                    }}
                    className={`px-4 py-2 rounded-xl font-sans text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                      diffApproved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{diffApproved ? 'Diff Approved ✓' : 'Approve & Apply Diff'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Challenge 3: Run Terminal Verification */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs min-h-[140px] text-zinc-300">
                  <div className="text-emerald-400 flex items-center gap-2 mb-2">
                    <span className="text-rose-500">roseram@browser:~$</span>
                    <span>pnpm vitest run --coverage</span>
                  </div>

                  {terminalRan ? (
                    <div className="space-y-1 text-emerald-400 text-[11px]">
                      <div>✓ src/auth/session.test.ts (4 tests passed)</div>
                      <div>✓ src/api/middleware.test.ts (2 tests passed)</div>
                      <div className="text-cyan-300 mt-2">✨ Build succeeded in 218ms</div>
                      <div className="text-zinc-400">Coverage: 98.4% of statements</div>
                    </div>
                  ) : (
                    <div className="text-zinc-500 italic">
                      Click the "Execute Pipeline" button below to run the command...
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Runs inside browser WebAssembly container.
                  </span>
                  <button
                    onClick={() => {
                      audioSynth.playKeypress();
                      setTimeout(() => {
                        setTerminalRan(true);
                        handleStepComplete(2);
                      }, 400);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer border ${
                      isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-xs'
                    }`}
                  >
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    <span>Execute Pipeline</span>
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Challenge 4: Launch Live Preview */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className={`border rounded-lg p-5 text-center ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-500/20">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Your Application Edge Deployment
                  </div>
                  <div className={`text-xs max-w-sm mx-auto mb-4 font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    https://roseram-app-preview.live
                  </div>

                  <button
                    onClick={() => {
                      setPreviewLaunched(true);
                      handleStepComplete(3);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-semibold text-xs shadow-sm flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{previewLaunched ? 'Preview Active ✓' : 'Launch Edge Preview'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={`pt-4 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-zinc-800' : 'border-slate-200'
          }`}>
            <span className={`font-mono ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
              Mission {currentStep + 1} of {missions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`px-3 py-1 rounded border disabled:opacity-30 ${
                  isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(missions.length - 1, currentStep + 1))}
                disabled={currentStep >= missions.length - 1}
                className={`px-3 py-1 rounded border disabled:opacity-30 ${
                  isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
