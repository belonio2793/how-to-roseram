import React from 'react';
import {
  FileCode,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Cpu,
  Eye,
  GitBranch,
  Sparkles,
  Zap,
  DollarSign,
  Globe,
  Share2,
  Mail,
  Share,
  Layers,
  ArrowRight,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { TutorialScene, AspectRatio } from '../../types/tutorial';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  scene: TutorialScene;
  aspectRatio: AspectRatio;
  progressPercent: number; // 0 to 100% within this scene
  themeColor: 'violet' | 'emerald' | 'cyan' | 'amber';
  showCursor?: boolean;
  showCallout?: boolean;
}

export const SimulatedWorkspaceView: React.FC<Props> = ({
  scene,
  aspectRatio,
  progressPercent,
  themeColor,
  showCursor = true,
  showCallout = true,
}) => {
  const { isDark } = useTheme();
  const { simulatedUI, cursorAction, calloutBadge, focusArea } = scene;

  // Determine active view mode
  const activeTab = simulatedUI.activeViewTab || (
    focusArea === 'proposals' ? 'diff' :
    focusArea === 'preview' ? 'preview' :
    focusArea === 'campaign' ? 'campaign' :
    focusArea === 'ledger' ? 'ledger' : 'code'
  );

  // Theme accent styles
  const accentBadge = {
    violet: isDark
      ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
      : 'bg-violet-50 text-violet-700 border-violet-200',
    emerald: isDark
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cyan: isDark
      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      : 'bg-cyan-50 text-cyan-700 border-cyan-200',
    amber: isDark
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-amber-50 text-amber-700 border-amber-200',
  }[themeColor];

  // Cursor position calculation (smooth entry and settle)
  const cursorX = cursorAction?.xPercent ?? 50;
  const cursorY = cursorAction?.yPercent ?? 50;
  const isClicking = cursorAction?.actionType === 'click' && progressPercent > 40 && progressPercent < 80;

  return (
    <div className={`relative w-full h-full flex flex-col font-sans select-none overflow-hidden transition-colors ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Sleek Top Roseram Workspace App Header */}
      <div className={`h-10 border-b px-3 flex items-center justify-between z-10 backdrop-blur shrink-0 transition-colors ${
        isDark ? 'border-zinc-800/80 bg-zinc-900/95' : 'border-slate-200 bg-white/95 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>

          <div className={`h-4 w-px mx-1 ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />

          {/* Roseram Logo */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center shadow-sm shadow-rose-500/30">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className={`font-semibold text-xs tracking-wide ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
              Roseram<span className="text-rose-500 font-bold">.com</span>
            </span>
          </div>

          <span className={`${isDark ? 'text-zinc-600' : 'text-slate-300'} text-xs hidden sm:inline`}>/</span>
          <span className={`text-xs font-mono hidden sm:inline truncate max-w-[140px] ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}>
            {simulatedUI.activeFile || 'workspace-saas'}
          </span>

          {simulatedUI.gitBranch && (
            <div className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
              isDark
                ? 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              <GitBranch className="w-2.5 h-2.5 text-zinc-400" />
              <span>{simulatedUI.gitBranch}</span>
            </div>
          )}
        </div>

        {/* Center: Bounded Automation Workflow Status */}
        <div className={`hidden lg:flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border ${
          isDark
            ? 'bg-zinc-950/80 border-zinc-800'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            focusArea === 'ide'
              ? isDark ? 'bg-zinc-800 text-white' : 'bg-slate-200 text-slate-900 font-bold'
              : isDark ? 'text-zinc-500' : 'text-slate-400'
          }`}>
            Plan
          </span>
          <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>→</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            focusArea === 'terminal' || focusArea === 'router'
              ? isDark ? 'bg-zinc-800 text-white' : 'bg-slate-200 text-slate-900 font-bold'
              : isDark ? 'text-zinc-500' : 'text-slate-400'
          }`}>
            Build
          </span>
          <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>→</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            focusArea === 'proposals'
              ? 'bg-rose-500/20 text-rose-600 font-bold border border-rose-500/30'
              : isDark ? 'text-zinc-500' : 'text-slate-400'
          }`}>
            Review
          </span>
        </div>

        {/* Right Actions: Model Selector & Stats */}
        <div className="flex items-center gap-2">
          {/* Multi-Model Badge */}
          <div
            id="model-selector-badge"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${accentBadge} transition-all shadow-xs`}
          >
            <Cpu className="w-3 h-3" />
            <span className="font-semibold text-[11px]">
              {simulatedUI.modelSelected || 'Claude 3.7 Sonnet'}
            </span>
            <span className="text-[9px] opacity-80 ml-0.5">● Active</span>
          </div>

          {/* Tokens / Cost */}
          {simulatedUI.tokenCount && (
            <div className={`hidden xl:flex items-center gap-1 px-2 py-1 rounded text-[10px] border ${
              isDark
                ? 'bg-zinc-800/60 text-zinc-300 border-zinc-700/40'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              <span>{simulatedUI.tokenCount.toLocaleString()} tok</span>
              <span className={isDark ? 'text-zinc-500' : 'text-slate-300'}>|</span>
              <span className="text-emerald-600 font-semibold">{simulatedUI.costEstimate || '$0.003'}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              id="share-preview-button"
              className={`p-1 rounded text-xs flex items-center gap-1 px-2 border ${
                isDark
                  ? 'bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <Eye className="w-3 h-3 text-rose-500" />
              <span className="text-[10px] hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: File Explorer / Project Navigation */}
        <div className={`w-44 border-r hidden sm:flex flex-col shrink-0 transition-colors ${
          isDark
            ? 'border-zinc-800/80 bg-zinc-950/70'
            : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between border-b ${
            isDark ? 'text-zinc-500 border-zinc-800/50' : 'text-slate-500 border-slate-200'
          }`}>
            <span>Explorer</span>
            <span className={isDark ? 'text-zinc-600' : 'text-slate-400'}>WORKSPACE</span>
          </div>

          <div className="p-2 space-y-0.5 text-xs font-mono overflow-y-auto">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${
              isDark ? 'text-zinc-300 hover:bg-zinc-900' : 'text-slate-700 hover:bg-slate-100'
            }`}>
              <span className={isDark ? 'text-zinc-600' : 'text-slate-400'}>▼</span>
              <span>src</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${
              simulatedUI.activeFile === 'src/App.tsx'
                ? isDark
                  ? 'bg-zinc-800/90 text-white font-semibold border-l-2 border-rose-500'
                  : 'bg-white text-slate-900 font-semibold border-l-2 border-rose-500 shadow-xs'
                : isDark ? 'text-zinc-400 hover:bg-zinc-900/60' : 'text-slate-600 hover:bg-slate-200/50'
            }`}>
              <FileCode className="w-3 h-3 text-cyan-500" />
              <span className="truncate">App.tsx</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${
              simulatedUI.activeFile?.includes('Analytics')
                ? isDark
                  ? 'bg-zinc-800/90 text-white font-semibold border-l-2 border-rose-500'
                  : 'bg-white text-slate-900 font-semibold border-l-2 border-rose-500 shadow-xs'
                : isDark ? 'text-zinc-400 hover:bg-zinc-900/60' : 'text-slate-600 hover:bg-slate-200/50'
            }`}>
              <FileCode className="w-3 h-3 text-violet-500" />
              <span className="truncate">Analytics.tsx</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer ${
              simulatedUI.activeFile?.includes('stripe') || simulatedUI.activeFile?.includes('webhook')
                ? isDark
                  ? 'bg-zinc-800/90 text-white font-semibold border-l-2 border-emerald-500'
                  : 'bg-white text-slate-900 font-semibold border-l-2 border-emerald-500 shadow-xs'
                : isDark ? 'text-zinc-400 hover:bg-zinc-900/60' : 'text-slate-600 hover:bg-slate-200/50'
            }`}>
              <FileCode className="w-3 h-3 text-emerald-600" />
              <span className="truncate">webhook.ts</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded ${
              isDark ? 'text-zinc-400 hover:bg-zinc-900/60' : 'text-slate-600 hover:bg-slate-200/50'
            }`}>
              <FileCode className="w-3 h-3 text-amber-500" />
              <span className="truncate">roseram.config.ts</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded ${
              isDark ? 'text-zinc-400 hover:bg-zinc-900/60' : 'text-slate-600 hover:bg-slate-200/50'
            }`}>
              <FileCode className="w-3 h-3 text-rose-500" />
              <span className="truncate">package.json</span>
            </div>

            {/* Campaign and Ledger shortcuts */}
            <div className={`pt-3 border-t mt-2 ${isDark ? 'border-zinc-800/50' : 'border-slate-200'}`}>
              <div className={`text-[10px] uppercase px-2 mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                Studios
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                activeTab === 'campaign'
                  ? isDark ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'bg-cyan-50 text-cyan-700 font-semibold'
                  : isDark ? 'text-zinc-400 hover:bg-zinc-900' : 'text-slate-600 hover:bg-slate-100'
              }`}>
                <Mail className="w-3 h-3 text-cyan-500" />
                <span>Campaign Studio</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                activeTab === 'ledger'
                  ? isDark ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'bg-amber-50 text-amber-700 font-semibold'
                  : isDark ? 'text-zinc-400 hover:bg-zinc-900' : 'text-slate-600 hover:bg-slate-100'
              }`}>
                <DollarSign className="w-3 h-3 text-amber-500" />
                <span>Token Ledger</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas / Editor / Diff / Studio Area */}
        <div className={`flex-1 flex flex-col overflow-hidden relative transition-colors ${
          isDark ? 'bg-zinc-950' : 'bg-white'
        }`}>
          {/* Tab Bar */}
          <div className={`h-8 border-b flex items-center justify-between px-2 text-xs transition-colors ${
            isDark ? 'border-zinc-800/80 bg-zinc-900/60' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-1 overflow-x-auto">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-t border-t-2 font-mono text-[11px] ${
                activeTab === 'code'
                  ? isDark
                    ? 'border-rose-500 bg-zinc-950 text-white'
                    : 'border-rose-500 bg-white text-slate-900 font-bold shadow-xs'
                  : isDark ? 'border-transparent text-zinc-400' : 'border-transparent text-slate-500'
              }`}>
                <Code2 className="w-3 h-3 text-rose-500" />
                <span>{simulatedUI.activeFile || 'index.tsx'}</span>
              </div>

              {simulatedUI.proposalDiff && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-t border-t-2 font-mono text-[11px] ${
                  activeTab === 'diff'
                    ? isDark
                      ? 'border-emerald-500 bg-zinc-950 text-emerald-300 font-semibold'
                      : 'border-emerald-500 bg-white text-emerald-700 font-semibold shadow-xs'
                    : isDark ? 'border-transparent text-zinc-400' : 'border-transparent text-slate-500'
                }`}>
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Review Proposal (Diff)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              )}

              {activeTab === 'campaign' && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-t border-t-2 border-cyan-500 font-semibold text-[11px] ${
                  isDark ? 'bg-zinc-950 text-cyan-300' : 'bg-white text-cyan-700 shadow-xs'
                }`}>
                  <Mail className="w-3 h-3 text-cyan-500" />
                  <span>Generative Campaign Studio</span>
                </div>
              )}

              {activeTab === 'ledger' && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-t border-t-2 border-amber-500 font-semibold text-[11px] ${
                  isDark ? 'bg-zinc-950 text-amber-300' : 'bg-white text-amber-700 shadow-xs'
                }`}>
                  <DollarSign className="w-3 h-3 text-amber-500" />
                  <span>Token Ledger & Cost Guardrails</span>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-t border-t-2 border-violet-500 font-semibold text-[11px] ${
                  isDark ? 'bg-zinc-950 text-violet-300' : 'bg-white text-violet-700 shadow-xs'
                }`}>
                  <Globe className="w-3 h-3 text-violet-500" />
                  <span>Live App Preview</span>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-2 text-[10px] font-mono ${
              isDark ? 'text-zinc-500' : 'text-slate-400'
            }`}>
              <span>UTF-8</span>
              <span>TypeScript</span>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 overflow-auto p-4 relative font-mono text-xs">
            {/* VIEW 1: DIFF PROPOSAL (Bounded Automation) */}
            {activeTab === 'diff' && simulatedUI.proposalDiff && (
              <div className={`max-w-3xl mx-auto rounded-lg border overflow-hidden shadow-xl ${
                isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200'
              }`}>
                {/* Diff Header */}
                <div className={`p-3 border-b flex items-center justify-between ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-900'}`}>
                      Roseram Agent Proposal: {simulatedUI.proposalDiff.fileName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="reject-diff-button"
                      className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 border ${
                        isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700' : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span>Reject</span>
                    </button>
                    <button
                      id="accept-diff-button"
                      className="px-3 py-1 rounded text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 shadow-md shadow-emerald-900/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Approve & Merge Diff</span>
                    </button>
                  </div>
                </div>

                {/* Diff Lines */}
                <div className={`p-4 space-y-1 font-mono text-[12px] leading-relaxed ${
                  isDark ? 'bg-zinc-950/90' : 'bg-slate-50/50'
                }`}>
                  <div className={`select-none pb-1 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                    @@ -12,4 +12,6 @@ Roseram Human-In-The-Loop Safe Sandbox
                  </div>
                  {simulatedUI.proposalDiff.removed.map((line, idx) => (
                    <div key={`rem-${idx}`} className={`px-2 py-0.5 rounded flex items-center gap-2 ${
                      isDark ? 'bg-red-950/40 text-red-300' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className="text-red-500 select-none font-bold">-</span>
                      <span>{line.replace(/^-\s*/, '')}</span>
                    </div>
                  ))}
                  {simulatedUI.proposalDiff.added.map((line, idx) => (
                    <div key={`add-${idx}`} className={`px-2 py-0.5 rounded flex items-center gap-2 ${
                      isDark ? 'bg-emerald-950/50 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      <span className="text-emerald-600 select-none font-bold">+</span>
                      <span>{line.replace(/^\+\s*/, '')}</span>
                    </div>
                  ))}
                </div>

                <div className={`p-2.5 border-t flex items-center justify-between text-[11px] ${
                  isDark ? 'bg-zinc-900/90 border-zinc-800/80 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Diff verified against TypeScript compiler & security AST
                  </span>
                  <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Press Enter to approve</span>
                </div>
              </div>
            )}

            {/* VIEW 2: CAMPAIGN STUDIO */}
            {activeTab === 'campaign' && simulatedUI.campaignAsset && (
              <div className="max-w-3xl mx-auto space-y-3 font-sans">
                <div className={`border rounded-lg p-3 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-xs mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Target Website URL Ingestion:
                  </div>
                  <div
                    id="campaign-url-input"
                    className={`flex items-center gap-2 border rounded-md px-3 py-1.5 text-xs ${
                      isDark ? 'bg-zinc-950 border-cyan-500/50 text-cyan-300' : 'bg-white border-cyan-300 text-cyan-800 shadow-xs'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="font-mono">https://roseram.com</span>
                    <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-700 px-2 py-0.5 rounded font-medium">
                      Crawled (3.4s)
                    </span>
                  </div>
                </div>

                <div className={`border rounded-lg p-4 shadow-xs ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-2 mb-3 ${
                    isDark ? 'border-zinc-800' : 'border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-500" />
                      <span className={`font-semibold text-sm ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        {simulatedUI.campaignAsset.title}
                      </span>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded font-mono ${
                      isDark ? 'bg-zinc-800 text-cyan-300' : 'bg-cyan-50 text-cyan-700 font-medium'
                    }`}>
                      {simulatedUI.campaignAsset.channel}
                    </span>
                  </div>

                  <div className={`text-xs font-semibold mb-2 ${
                    isDark ? 'text-zinc-300' : 'text-slate-800'
                  }`}>
                    {simulatedUI.campaignAsset.hook}
                  </div>

                  <div className={`p-3 rounded border text-xs whitespace-pre-line leading-relaxed font-mono ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    {simulatedUI.campaignAsset.content}
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      id="campaign-export-btn"
                      className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      <Share className="w-3.5 h-3.5" />
                      <span>Export Campaign Package</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: TOKEN LEDGER */}
            {activeTab === 'ledger' && (
              <div className="max-w-3xl mx-auto space-y-3 font-sans">
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg border ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Total Tokens</div>
                    <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {simulatedUI.tokenCount ? simulatedUI.tokenCount.toLocaleString() : '48,250'}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-1">↓ 68% vs Single LLM</div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Estimated Cost</div>
                    <div className="text-xl font-bold text-emerald-600 mt-1">
                      {simulatedUI.costEstimate || '$0.142'}
                    </div>
                    <div className={`text-[10px] mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Billed per prompt</div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Project Cap</div>
                    <div className="text-xl font-bold text-amber-500 mt-1">$25.00</div>
                    <div className={`text-[10px] mt-1 ${isDark ? 'text-amber-300/80' : 'text-amber-600'}`}>13.6% used</div>
                  </div>
                </div>

                <div className={`p-4 border rounded-lg ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className={`text-xs font-semibold mb-3 flex items-center gap-2 ${
                    isDark ? 'text-zinc-200' : 'text-slate-800'
                  }`}>
                    <Cpu className="w-3.5 h-3.5 text-amber-500" />
                    <span>Multi-Model Engine Breakdown</span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div>
                      <div className={`flex justify-between text-[11px] mb-1 ${
                        isDark ? 'text-zinc-300' : 'text-slate-700'
                      }`}>
                        <span>Claude 3.7 Sonnet (Agentic Code)</span>
                        <span>32,100 tok ($0.096)</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-zinc-950' : 'bg-slate-100'
                      }`}>
                        <div className="bg-violet-500 h-full rounded-full" style={{ width: '66%' }} />
                      </div>
                    </div>

                    <div>
                      <div className={`flex justify-between text-[11px] mb-1 ${
                        isDark ? 'text-zinc-300' : 'text-slate-700'
                      }`}>
                        <span>Gemini 2.5 Pro (Deep Architecture)</span>
                        <span>12,400 tok ($0.031)</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-zinc-950' : 'bg-slate-100'
                      }`}>
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>

                    <div>
                      <div className={`flex justify-between text-[11px] mb-1 ${
                        isDark ? 'text-zinc-300' : 'text-slate-700'
                      }`}>
                        <span>GPT-4o Mini (Boilerplate & Fast Refactor)</span>
                        <span>3,750 tok ($0.015)</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-zinc-950' : 'bg-slate-100'
                      }`}>
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '9%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: LIVE PREVIEW */}
            {activeTab === 'preview' && (
              <div className={`h-full flex flex-col rounded-lg border overflow-hidden font-sans ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                {/* Browser Address Bar */}
                <div className={`p-2 border-b flex items-center gap-2 ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                  <div className={`flex-1 px-3 py-1 rounded text-xs font-mono flex items-center justify-between border ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <span className="truncate">{simulatedUI.livePreviewUrl || 'https://roseram-app.live'}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      SSL Active
                    </span>
                  </div>
                </div>

                {/* Rendered Live App Preview Mock */}
                <div className={`flex-1 p-6 flex flex-col items-center justify-center text-center ${
                  isDark
                    ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950'
                    : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center mb-3 shadow-lg shadow-rose-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Your Application is Live
                  </h3>
                  <p className={`text-xs max-w-sm mb-4 ${
                    isDark ? 'text-zinc-400' : 'text-slate-500'
                  }`}>
                    Deployed with Roseram’s 1-click cloud edge infrastructure. Zero local config required.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      id="deploy-production-btn"
                      className="px-4 py-1.5 rounded-md bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Visit Live Domain</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: CODE EDITOR (Default) */}
            {activeTab === 'code' && (
              <div className="space-y-1">
                {(simulatedUI.codeSnippet || `// Roseram.com Workspace
export default function App() {
  return <div>Welcome to Roseram.com</div>;
}`).split('\n').map((line, idx) => (
                  <div key={idx} className={`flex items-start gap-4 py-0.5 px-1 rounded ${
                    isDark ? 'hover:bg-zinc-900/40' : 'hover:bg-slate-100/70'
                  }`}>
                    <span className={`text-right w-6 select-none text-[11px] ${
                      isDark ? 'text-zinc-600' : 'text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`font-mono text-[12px] leading-relaxed ${
                      line.includes('//') ? (isDark ? 'text-zinc-500 italic' : 'text-slate-400 italic') :
                      line.includes('import') || line.includes('export') || line.includes('function') ? 'text-rose-600 font-semibold' :
                      line.includes('return') || line.includes('const') ? 'text-violet-600 font-medium' :
                      line.includes('<') || line.includes('>') ? (isDark ? 'text-cyan-300' : 'text-cyan-700 font-medium') :
                      line.includes('className') ? 'text-amber-600' : (isDark ? 'text-zinc-200' : 'text-slate-800')
                    }`}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Integrated Terminal (Split Screen) */}
          <div className={`h-32 border-t flex flex-col shrink-0 transition-colors ${
            isDark ? 'border-zinc-800/80 bg-zinc-950' : 'border-slate-200 bg-slate-900 text-slate-100'
          }`}>
            <div className={`h-7 px-3 border-b flex items-center justify-between text-[11px] ${
              isDark ? 'bg-zinc-900/90 border-zinc-800/60' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold text-zinc-200">Roseram Terminal</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">bash (sandboxed)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>Ready</span>
              </div>
            </div>

            <div className="flex-1 p-2.5 font-mono text-[11px] overflow-y-auto text-zinc-300 space-y-1 leading-snug">
              {simulatedUI.terminalCommand && (
                <div
                  id="terminal-input-bar"
                  className="flex items-center gap-2 text-emerald-400"
                >
                  <span className="text-rose-400">roseram@browser:~$</span>
                  <span className="text-zinc-100 font-bold">{simulatedUI.terminalCommand}</span>
                </div>
              )}
              {simulatedUI.terminalOutput ? (
                simulatedUI.terminalOutput.split('\n').map((outLine, idx) => (
                  <div
                    key={idx}
                    className={`leading-tight ${
                      outLine.includes('✓') || outLine.includes('Built in')
                        ? 'text-emerald-400'
                        : outLine.includes('Error') || outLine.includes('fail')
                        ? 'text-red-400'
                        : outLine.includes('[ROSERAM')
                        ? 'text-violet-300'
                        : 'text-zinc-400'
                    }`}
                  >
                    {outLine}
                  </div>
                ))
              ) : (
                <div className="text-zinc-500">[ROSERAM] Watching for project changes...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animated Cursor */}
      {showCursor && cursorAction && (
        <div
          className="absolute z-40 pointer-events-none transition-all duration-700 ease-out flex items-center gap-2"
          style={{
            left: `${cursorX}%`,
            top: `${cursorY}%`,
            transform: 'translate(-4px, -4px)',
          }}
        >
          {/* Custom SVG Mouse Cursor */}
          <div className="relative">
            <svg
              className={`w-6 h-6 filter drop-shadow-md transition-transform duration-200 ${
                isClicking ? 'scale-90' : 'scale-100'
              }`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 3L10.07 20.97L13.58 13.58L20.97 10.07L3 3Z"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Click Ripple Effect */}
            {isClicking && (
              <span className="absolute -inset-2 rounded-full border-2 border-pink-400 animate-ping opacity-80" />
            )}
          </div>

          {/* Action Tooltip Label */}
          {cursorAction.label && (
            <div className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium whitespace-nowrap shadow-xl backdrop-blur border ${
              isDark
                ? 'bg-zinc-900/95 text-white border-pink-500/40'
                : 'bg-white/95 text-slate-900 border-pink-400 shadow-sm'
            }`}>
              {cursorAction.label}
            </div>
          )}
        </div>
      )}

      {/* Floating Callout / Pro Tip Overlay */}
      {showCallout && calloutBadge && (
        <div
          className={`absolute z-30 transition-all duration-500 ${
            calloutBadge.position === 'top-right' ? 'top-14 right-4' :
            calloutBadge.position === 'top-left' ? 'top-14 left-48' :
            calloutBadge.position === 'bottom-right' ? 'bottom-36 right-4' :
            calloutBadge.position === 'bottom-left' ? 'bottom-36 left-48' :
            'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          }`}
        >
          <div className={`p-2.5 rounded-lg border shadow-xl backdrop-blur-md max-w-xs flex items-start gap-2.5 ${
            isDark
              ? calloutBadge.type === 'pro'
                ? 'bg-gradient-to-r from-violet-950/90 to-zinc-950/90 border-violet-500/50 text-violet-200'
                : calloutBadge.type === 'shortcut'
                ? 'bg-zinc-900/90 border-amber-500/50 text-amber-200'
                : 'bg-zinc-900/90 border-rose-500/50 text-rose-200'
              : calloutBadge.type === 'pro'
              ? 'bg-violet-50/95 border-violet-300 text-violet-900 shadow-sm'
              : calloutBadge.type === 'shortcut'
              ? 'bg-amber-50/95 border-amber-300 text-amber-900 shadow-sm'
              : 'bg-rose-50/95 border-rose-300 text-rose-900 shadow-sm'
          }`}>
            <div className={`p-1 rounded shrink-0 mt-0.5 ${
              isDark ? 'bg-zinc-800 text-white' : 'bg-white text-rose-600 shadow-xs'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                {calloutBadge.type === 'pro' ? 'Pro Workflow' : calloutBadge.type === 'shortcut' ? 'Hotkey' : 'Tip'}
              </div>
              <div className={`text-xs font-semibold mt-0.5 leading-snug ${
                isDark ? 'text-zinc-100' : 'text-slate-900'
              }`}>
                {calloutBadge.text}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
